
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Modality } from "@google/genai";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite Setup
const db = new Database("database.sqlite");

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending',
    date TEXT
  );
  
  CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    category TEXT,
    title TEXT,
    author TEXT,
    description TEXT,
    fileUrl TEXT,
    date TEXT
  );
  
  CREATE TABLE IF NOT EXISTS guestbook (
    id TEXT PRIMARY KEY,
    author TEXT,
    message TEXT,
    date TEXT
  );
  
  CREATE TABLE IF NOT EXISTS testimonies (
    id TEXT PRIMARY KEY,
    author TEXT,
    title TEXT,
    content TEXT,
    date TEXT
  );
  
  CREATE TABLE IF NOT EXISTS sponsorships (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    amount TEXT,
    type TEXT,
    message TEXT,
    date TEXT
  );
  
  CREATE TABLE IF NOT EXISTS calendar_events (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    date TEXT,
    type TEXT
  );
  
  CREATE TABLE IF NOT EXISTS notification_logs (
    id TEXT PRIMARY KEY,
    eventId TEXT,
    eventTitle TEXT,
    type TEXT,
    script TEXT,
    audioData TEXT,
    sentAt TEXT,
    status TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/data", (req, res) => {
    try {
      const inquiries = db.prepare("SELECT * FROM inquiries").all();
      const resources = db.prepare("SELECT * FROM resources").all();
      const guestbook = db.prepare("SELECT * FROM guestbook").all();
      const testimonies = db.prepare("SELECT * FROM testimonies").all();
      const sponsorships = db.prepare("SELECT * FROM sponsorships").all();
      const calendarEvents = db.prepare("SELECT * FROM calendar_events").all();
      const notificationLogs = db.prepare("SELECT * FROM notification_logs ORDER BY sentAt DESC LIMIT 50").all();

      res.json({
        inquiries,
        resources,
        guestbook,
        testimonies,
        sponsorships,
        calendarEvents,
        notificationLogs
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).json({ error: "Failed to fetch data from SQLite" });
    }
  });

  app.post("/api/save", (req, res) => {
    const { dbCategory, ...data } = req.body;
    
    try {
      let table = "";
      const id = data.id || Math.random().toString(36).substr(2, 9);
      const date = data.date || new Date().toISOString().split('T')[0];

      if (dbCategory === "inquiry") {
        table = "inquiries";
        data.status = data.status || 'pending';
      } else if (dbCategory === "resource") {
        table = "resources";
      } else if (dbCategory === "guestbook") {
        table = "guestbook";
      } else if (dbCategory === "testimony") {
        table = "testimonies";
      } else if (dbCategory === "sponsorship") {
        table = "sponsorships";
      } else if (dbCategory === "calendar") {
        table = "calendar_events";
      }

      if (table) {
        const rowData = { ...data, id, date };
        const columns = Object.keys(rowData).join(", ");
        const placeholders = Object.keys(rowData).map(() => "?").join(", ");
        const values = Object.values(rowData);

        const upsertQuery = `
          INSERT OR REPLACE INTO ${table} (${columns})
          VALUES (${placeholders})
        `;
        
        db.prepare(upsertQuery).run(...values);
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid category" });
      }
    } catch (error) {
      console.error("Save Error:", error);
      res.status(500).json({ error: "Failed to save data to SQLite" });
    }
  });

  app.post("/api/delete", (req, res) => {
    const { id, type } = req.body;
    if (!id) {
      return res.status(400).json({ error: "ID is required for deletion" });
    }
    
    try {
      let table = "";
      if (type === "inquiry") table = "inquiries";
      else if (type === "resource") table = "resources";
      else if (type === "guestbook") table = "guestbook";
      else if (type === "testimony") table = "testimonies";
      else if (type === "sponsorship") table = "sponsorships";
      else if (type === "calendar") table = "calendar_events";

      if (table) {
        const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
        if (result.changes > 0) {
          res.json({ success: true });
        } else {
          res.status(404).json({ error: "Record not found" });
        }
      } else {
        res.status(400).json({ error: "Invalid type" });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ error: "Failed to delete data from SQLite" });
    }
  });

  // Gemini Witty Notification Logic
  const generateWittyAudio = async (event: any, type: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    const daysMap: Record<string, string> = {
      '7_days': '7일 전',
      '3_days': '3일 전',
      '1_days': '1일 전',
      'manual': '지금 당장'
    };

    const prompt = `
      당신은 헵시바 선교회의 위트 있고 유머러스한 알림 비서입니다.
      다음 일정에 대해 ${daysMap[type]} 알림 음성 메시지 대본을 작성하고 읽어주세요.
      
      일정 제목: ${event.title}
      상세 설명: ${event.description}
      일정 날짜: ${event.date}
      
      지침:
      1. 아주 재미있고, 위트 있으며, 성도님들이 웃을 수 있는 따뜻한 유머를 섞어주세요.
      2. 선교회 분위기에 맞게 정중하면서도 친근하게 말해주세요.
      3. 대본은 한국어로 작성하세요.
      4. "안녕하세요! 헵시바 알림이입니다~"로 시작해서 재미있는 멘트를 날려주세요.
      5. 마지막에는 "잊지 마세요!"라고 말해주세요.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
      
      return {
        audioData: audioPart?.inlineData?.data || "",
        script: textPart?.text || "대본 생성 실패"
      };
    } catch (error) {
      console.error("Gemini TTS Error:", error);
      return null;
    }
  };

  const checkAndSendNotifications = async () => {
    const now = new Date();
    // Only check at 06:00 AM (approximate check every minute)
    if (now.getHours() !== 6 || now.getMinutes() !== 0) return;

    try {
      const events = db.prepare("SELECT * FROM calendar_events WHERE type = 'official'").all() as any[];
      
      for (const event of events) {
        const eventDate = new Date(event.date);
        const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        let type: '7_days' | '3_days' | '1_days' | null = null;
        if (diffDays === 7) type = '7_days';
        else if (diffDays === 3) type = '3_days';
        else if (diffDays === 1) type = '1_days';

        if (type) {
          // Check if already sent
          const existing = db.prepare("SELECT * FROM notification_logs WHERE eventId = ? AND type = ?").get(event.id, type);
          
          if (!existing) {
            console.log(`Sending ${type} notification for: ${event.title}`);
            const result = await generateWittyAudio(event, type);
            if (result) {
              const logId = Math.random().toString(36).substr(2, 9);
              db.prepare(`
                INSERT INTO notification_logs (id, eventId, eventTitle, type, script, audioData, sentAt, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `).run(
                logId,
                event.id,
                event.title,
                type,
                result.script,
                result.audioData,
                new Date().toISOString(),
                'success'
              );
              
              // In a real app, you would call Kakao API here with the audio/script
              console.log(`[SIMULATED KAKAO] Sent witty audio to KakaoTalk for ${event.title}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Notification Scheduler Error:", error);
    }
  };

  // Run scheduler every minute
  setInterval(checkAndSendNotifications, 60000);

  app.post("/api/test-notification", async (req, res) => {
    const { eventId } = req.body;
    try {
      const event = db.prepare("SELECT * FROM calendar_events WHERE id = ?").get(eventId) as any;
      
      if (!event) return res.status(404).json({ error: "Event not found" });

      const result = await generateWittyAudio(event, 'manual');
      if (result) {
        const logId = Math.random().toString(36).substr(2, 9);
        db.prepare(`
          INSERT INTO notification_logs (id, eventId, eventTitle, type, script, audioData, sentAt, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          logId,
          event.id,
          event.title,
          'manual',
          result.script,
          result.audioData,
          new Date().toISOString(),
          'success'
        );
        
        res.json({ success: true, script: result.script, audioData: result.audioData });
      } else {
        res.status(500).json({ error: "Failed to generate witty audio" });
      }
    } catch (error) {
      console.error("Test Notification Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
