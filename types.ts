
export interface Testimony {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  date: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'completed';
  date: string;
}

export interface Resource {
  id: string;
  category: '설교자료' | '찬양자료' | '선교자료' | '교육자료' | '교회행정자료';
  title: string;
  author: string;
  description: string;
  fileUrl: string; // 실제 파일 링크 (구글 드라이브 등)
  date: string;
}

export interface Sponsorship {
  id: string;
  name: string;
  phone: string;
  amount: number;
  type: '정기후원' | '일시후원';
  message: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'personal' | 'official';
}

export interface NotificationLog {
  id: string;
  eventId: string;
  eventTitle: string;
  type: '7_days' | '3_days' | '1_days' | 'manual';
  script: string;
  audioData: string; // base64
  sentAt: string;
  status: 'success' | 'failed';
}

export enum Page {
  Home = 'home',
  About = 'about',
  Ministries = 'ministries',
  Community = 'community',
  AiMentor = 'aimentor',
  Resources = 'resources',
  Support = 'support',
  Admin = 'admin'
}
