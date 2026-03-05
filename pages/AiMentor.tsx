
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { Send, Sparkles, User, Heart, MessageCircle, BookOpen, Handshake, Loader2, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiMentor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '샬롬! 헵시바 AI 멘토입니다. 성경적 상담, 신학적 궁금증, 영육의 치유, 그리고 전도와 선교의 지혜가 필요하시다면 무엇이든 물어보세요. 주님의 사랑으로 함께 고민하고 길을 찾겠습니다.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { label: '성경과 신학', icon: <BookOpen size={14} />, prompt: '개혁주의 신학 관점에서 창세기 1장을 어떻게 이해해야 하나요?' },
    { label: '치유와 회복', icon: <Heart size={14} />, prompt: '마음의 상처와 우울함으로 힘들어하는 분을 위한 위로의 말씀과 기도 제목을 알려주세요.' },
    { label: '전도와 선교', icon: <Handshake size={14} />, prompt: '현대인들에게 거부감 없이 복음을 전할 수 있는 창의적인 전도 방법 3가지를 알려주세요.' },
    { label: '사역 지침', icon: <Sparkles size={14} />, prompt: '소외된 이웃을 돕는 구제 사역을 시작할 때 유의해야 할 성경적 원리는 무엇인가요?' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const modelName = 'gemini-3-flash-preview';
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: textToSend,
        config: {
          systemInstruction: `당신은 '헵시바 선교회'의 전문 AI 멘토입니다. 
사용자의 질문에 대해 다음과 같은 원칙으로 답변하세요:
1. 기독교 신앙과 성경 말씀을 기초로 하여 따뜻하고 지혜로운 조언을 제공합니다.
2. 개혁주의 신학에 근거하여 바른 교리를 안내합니다.
3. 치유 상담 분야에서는 공감과 위로를 우선하되, 영적인 회복과 실제적인 상담 원리를 결합합니다.
4. 전도와 선교 전략에 대해서는 현대적이고 실천 가능한 창의적인 아이디어를 제안합니다.
5. 항상 문장의 마지막이나 중간에 적절한 성경 구절을 인용하여 권위를 더하세요.
6. 존칭을 사용하여 정중하고 온화한 한국어로 답변하세요.`,
          temperature: 0.7,
          topP: 0.95,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        }
      });

      const aiMessage: Message = { role: 'assistant', content: response.text || '죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다.' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Response Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: '대화 내용이 초기화되었습니다. 다시 상담을 시작해볼까요? 어떤 주제로 이야기를 나눌까요?'
    }]);
  };

  return (
    <div className="py-12 bg-[#FCFBF7] min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-4 text-orange-600 animate-bounce">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 serif">헵시바 AI 멘토</h1>
          <p className="text-gray-500 mt-2">성경과 신학, 치유 상담, 전도와 선교의 지혜를 나눕니다.</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-orange-100 flex flex-col h-[650px] overflow-hidden relative">
          {/* Scroll Area */}
          <div 
            ref={scrollRef}
            className="flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth bg-gradient-to-b from-white to-orange-50/20"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <MessageCircle size={20} />}
                </div>
                <div className={`max-w-[75%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-orange-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-orange-50 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-orange-400 p-2 animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium">멘토가 생각 중입니다...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleSend(cat.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500 transition-all shadow-sm"
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-orange-100 flex items-center gap-3">
            <button 
              onClick={resetChat}
              className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all"
              title="대화 초기화"
            >
              <RotateCcw size={20} />
            </button>
            <div className="flex-grow relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="어떤 고민이 있으신가요?"
                className="w-full pl-6 pr-14 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-gray-50 text-sm"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Biblical Quote Footer */}
        <div className="mt-8 text-center bg-white/50 backdrop-blur p-6 rounded-[2rem] border border-orange-50">
          <p className="text-gray-600 italic text-sm serif">
            "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라"
          </p>
          <span className="block mt-2 text-xs font-bold text-orange-400">야고보서 1:5</span>
        </div>
      </div>
    </div>
  );
};

export default AiMentor;
