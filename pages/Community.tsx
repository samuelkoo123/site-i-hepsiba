
import React, { useState, useEffect } from 'react';
import { Testimony, GuestbookEntry } from '../types';
import { MessageSquare, PenTool, Send, Heart, X, Loader2 } from 'lucide-react';
import { db } from '../db';

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guestbook' | 'testimony' | 'inquiry'>('testimony');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [serverStatus, setServerStatus] = useState<{ ok: boolean, msg: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  
  const [isTestimonyFormOpen, setIsTestimonyFormOpen] = useState(false);
  const [testimonyData, setTestimonyData] = useState({ author: '', title: '', content: '' });
  const [guestbookName, setGuestbookName] = useState('');
  const [guestbookMsg, setGuestbookMsg] = useState('');
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', subject: '', message: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      // 서버 상태 확인
      const healthUrl = `${window.location.origin}/api/health`;
      console.log("Checking health at:", healthUrl);
      
      const healthRes = await fetch(healthUrl).catch((err) => {
        console.error("Health check fetch error:", err);
        return { ok: false, statusText: err.message };
      });

      if (healthRes && 'ok' in healthRes && healthRes.ok) {
        setServerStatus({ ok: true, msg: '서버 연결됨' });
      } else {
        const errorMsg = (healthRes && 'status' in healthRes) 
          ? `서버 오류 (상태: ${healthRes.status})` 
          : `연결 실패: ${healthRes && 'statusText' in healthRes ? healthRes.statusText : '알 수 없는 오류'}`;
        setServerStatus({ 
          ok: false, 
          msg: `${errorMsg}. API 서버가 실행 중인지, 그리고 /api/health 경로가 유효한지 확인해 주세요.` 
        });
      }

      await refreshDebugInfo();

      const data = await db.getAll();
      setTestimonies(data.testimonies || []);
      setGuestbook(data.guestbook || []);
    } catch (error) {
      console.error("데이터 로드 중 오류:", error);
      setServerStatus({ ok: false, msg: '데이터 로드 중 오류 발생' });
    }
    setLoading(false);
  };

  const refreshDebugInfo = async () => {
    const debugUrl = `${window.location.origin}/api/debug`;
    const debugRes = await fetch(debugUrl).catch((err) => {
      console.error("Debug fetch error:", err);
      return null;
    });
    if (debugRes && debugRes.ok) {
      setDebugInfo(await debugRes.json());
    }
  };

  const handleTestDbWrite = async () => {
    setIsTestingDb(true);
    try {
      const result = await db.save('guestbook', { 
        author: '시스템 테스트', 
        message: `디버그 테스트 메시지 (${new Date().toLocaleString()})`,
        id: 'debug-test-' + Date.now()
      });
      
      if (result.success) {
        alert('데이터베이스 쓰기 테스트 성공!');
        await refreshDebugInfo();
        loadData();
      } else {
        alert(`데이터베이스 쓰기 테스트 실패: ${result.error}`);
      }
    } catch (e) {
      alert(`테스트 중 오류 발생: ${(e as Error).message}`);
    }
    setIsTestingDb(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyData.author || !testimonyData.title || !testimonyData.content) return;
    
    setSubmitting(true);
    const result = await db.save('testimony', testimonyData);
    if (result.success) {
      alert('은혜로운 간증이 등록되었습니다.');
      setTestimonyData({ author: '', title: '', content: '' });
      setIsTestimonyFormOpen(false);
      // 즉시 다시 로드
      loadData();
    } else {
      alert(`등록 중 오류가 발생했습니다: ${result.error || '알 수 없는 오류'}`);
    }
    setSubmitting(false);
  };

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookName || !guestbookMsg) return;
    
    setSubmitting(true);
    const result = await db.save('guestbook', { author: guestbookName, message: guestbookMsg });
    if (result.success) {
      alert('방명록이 등록되었습니다.');
      setGuestbookName('');
      setGuestbookMsg('');
      // 즉시 다시 로드
      loadData();
    } else {
      alert(`등록 중 오류가 발생했습니다: ${result.error || '알 수 없는 오류'}`);
    }
    setSubmitting(false);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await db.save('inquiry', inquiryData);
    if (result.success) {
      alert('문의사항이 관리자 탭으로 전송되었습니다.');
      setInquiryData({ name: '', email: '', subject: '', message: '' });
    } else {
      alert(`등록 중 오류가 발생했습니다: ${result.error || '알 수 없는 오류'}`);
    }
    setSubmitting(false);
  };

  return (
    <div className="py-24 bg-[#FCFBF7]">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 serif mb-4">나눔 광장</h1>
          <div className="flex flex-col items-center gap-2">
            {serverStatus && (
              <div 
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${serverStatus.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                onClick={() => setShowDebug(!showDebug)}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${serverStatus.ok ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                {serverStatus.msg} (클릭하여 상세 정보 확인)
              </div>
            )}
            
            {showDebug && debugInfo && (
              <div className="mt-4 p-4 bg-gray-900 text-green-400 text-left rounded-xl text-xs font-mono max-w-full overflow-auto shadow-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-2 border-bottom border-gray-700 pb-1">
                  <span className="font-bold text-white">서버 진단 정보</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleTestDbWrite} 
                      disabled={isTestingDb}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isTestingDb ? '테스트 중...' : '쓰기 테스트 실행'}
                    </button>
                    <button onClick={() => setShowDebug(false)} className="text-gray-500 hover:text-white">닫기</button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap break-all">{JSON.stringify(debugInfo, null, 2)}</pre>
                <div className="mt-2 pt-2 border-t border-gray-700 text-gray-500 italic">
                  * dbTest가 success가 아니면 서버의 파일 쓰기 권한을 확인하세요.<br/>
                  * 현재 접속 주소: {window.location.href}<br/>
                  * API 주소: {window.location.origin}/api
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex justify-center mb-12 bg-white p-2 rounded-2xl shadow-sm border border-orange-50">
          {(['testimony', 'guestbook', 'inquiry'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {tab === 'testimony' ? '은혜의 간증' : tab === 'guestbook' ? '방명록' : '문의하기'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-orange-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="serif text-lg"></p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {activeTab === 'testimony' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsTestimonyFormOpen(true)}
                    className="flex items-center gap-2 bg-orange-100 text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-200 transition-colors"
                  >
                    <PenTool size={18} />
                    간증 작성하기
                  </button>
                </div>

                {isTestimonyFormOpen && (
                  <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-orange-200 animate-in zoom-in duration-300 mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800 serif">은혜의 간증 나누기</h3>
                      <button onClick={() => setIsTestimonyFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                      </button>
                    </div>
                    <form onSubmit={handleTestimonySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          type="text" placeholder="작성자 성함" required
                          value={testimonyData.author}
                          onChange={(e) => setTestimonyData({...testimonyData, author: e.target.value})}
                          className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                        />
                        <input 
                          type="text" placeholder="간증 제목" required
                          value={testimonyData.title}
                          onChange={(e) => setTestimonyData({...testimonyData, title: e.target.value})}
                          className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                        />
                      </div>
                      <textarea 
                        placeholder="하나님의 놀라운 역사를 들려주세요." rows={6} required
                        value={testimonyData.content}
                        onChange={(e) => setTestimonyData({...testimonyData, content: e.target.value})}
                        className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 resize-none"
                      ></textarea>
                      <button 
                        disabled={submitting}
                        type="submit" className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex justify-center items-center gap-2"
                      >
                        {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                        {submitting ? 'DB 전송 중...' : '간증 등록하기'}
                      </button>
                    </form>
                  </div>
                )}

                {testimonies.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] text-center text-gray-400 border border-gray-100">
                    아직 DB에 등록된 간증이 없습니다.
                  </div>
                ) : (
                  testimonies.map((t, idx) => (
                    <article key={t.id || idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-orange-50 space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800 serif">{t.title}</h3>
                        <span className="text-sm text-gray-400">{t.date}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{t.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-50">
                        <Heart size={14} className="text-orange-400" />
                        <span>글쓴이: {t.author}</span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {activeTab === 'guestbook' && (
              <div className="space-y-12">
                <form onSubmit={handleGuestbookSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-md border border-orange-100 space-y-4">
                  <input 
                    type="text" placeholder="작성자 성함" required
                    value={guestbookName}
                    onChange={(e) => setGuestbookName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                  />
                  <textarea 
                    placeholder="따뜻한 인사를 남겨주세요." rows={3} required
                    value={guestbookMsg}
                    onChange={(e) => setGuestbookMsg(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 resize-none"
                  ></textarea>
                  <div className="flex justify-end">
                    <button 
                      disabled={submitting}
                      type="submit" className="flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={18} />}
                      {submitting ? 'DB 전송 중' : '등록하기'}
                    </button>
                  </div>
                </form>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guestbook.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400">등록된 방명록이 없습니다.</div>
                  ) : (
                    guestbook.map((g, idx) => (
                      <div key={g.id || idx} className="bg-white/70 p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-gray-800">{g.author}</span>
                          <span className="text-xs text-gray-400">{g.date}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{g.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'inquiry' && (
              <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-orange-50 space-y-10">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 serif">무엇을 도와드릴까요?</h2>
                  <p className="text-gray-500 mt-2"></p>
                </div>
                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      required type="text" placeholder="이름"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                    />
                    <input 
                      required type="email" placeholder="이메일"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                    />
                  </div>
                  <input 
                    required type="text" placeholder="제목"
                    value={inquiryData.subject}
                    onChange={(e) => setInquiryData({...inquiryData, subject: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-gray-50"
                  />
                  <textarea 
                    required rows={5} placeholder="상세 내용"
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-gray-50 resize-none"
                  ></textarea>
                  <button 
                    disabled={submitting}
                    type="submit" className="w-full py-5 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-orange-600 transition-all flex justify-center items-center gap-2"
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {submitting ? 'DB 전송 중...' : '보내기'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
