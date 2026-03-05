
import React, { useState, useEffect } from 'react';
import { Inquiry, Resource, GuestbookEntry, Testimony, Sponsorship, CalendarEvent } from '../types';
import { LayoutDashboard, MessageSquare, Heart, BookOpen, Trash2, Quote, Loader2, RefreshCcw, ExternalLink, Phone, Handshake, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { db } from '../db';
import { motion, AnimatePresence } from 'motion/react';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'inquiries' | 'sponsorships' | 'guestbook' | 'testimonies' | 'resources' | 'calendar'>('inquiries');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editingSponsorship, setEditingSponsorship] = useState<Sponsorship | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string, viewType: string } | null>(null);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [data, setData] = useState({
    inquiries: [] as Inquiry[],
    sponsorships: [] as Sponsorship[],
    guestbook: [] as GuestbookEntry[],
    testimonies: [] as Testimony[],
    resources: [] as Resource[],
    calendarEvents: [] as CalendarEvent[]
  });

  const loadAllData = async () => {
    setLoading(true);
    const allData = await db.getAll();
    setData({
        inquiries: allData.inquiries || [],
        sponsorships: allData.sponsorships || [],
        guestbook: allData.guestbook || [],
        testimonies: allData.testimonies || [],
        resources: allData.resources || [],
        calendarEvents: allData.calendarEvents || []
    });
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2580') {
      setIsLoggedIn(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    
    let type = '';
    switch(deletingItem.viewType) {
      case 'inquiries': type = 'inquiry'; break;
      case 'sponsorships': type = 'sponsorship'; break;
      case 'guestbook': type = 'guestbook'; break;
      case 'testimonies': type = 'testimony'; break;
      case 'resources': type = 'resource'; break;
      case 'calendar': type = 'calendar'; break;
      default: type = deletingItem.viewType;
    }

    setLoading(true);
    const success = await db.delete(type, deletingItem.id);
    if (success) {
      setDeletingItem(null);
      loadAllData();
    } else {
      alert('삭제 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource({ ...resource });
  };

  const handleEditSponsorship = (sponsorship: Sponsorship) => {
    setEditingSponsorship({ ...sponsorship });
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent({ ...event });
  };

  const handleAddEvent = (date?: string) => {
    setEditingEvent({
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      date: date || new Date().toISOString().split('T')[0],
      type: 'official'
    });
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    setLoading(true);
    const success = await db.save('resource', editingResource);
    if (success) {
      alert('저장되었습니다.');
      setEditingResource(null);
      loadAllData();
    } else {
      alert('저장 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleSaveSponsorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsorship) return;

    setLoading(true);
    const success = await db.save('sponsorship', editingSponsorship);
    if (success) {
      alert('저장되었습니다.');
      setEditingSponsorship(null);
      loadAllData();
    } else {
      alert('저장 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    setLoading(true);
    const success = await db.save('calendar', editingEvent);
    if (success) {
      alert('저장되었습니다.');
      setEditingEvent(null);
      loadAllData();
    } else {
      alert('저장 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-orange-100 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 serif">관리자 시스템</h1>
            <p className="text-sm text-gray-500 mt-3">Hephzibah Mission Admin Console</p>
          </div>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="관리자 비밀번호" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all bg-gray-50 font-medium text-center"
            />
            <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg">
              로그인
            </button>
          </div>
        </form>
      </div>
    );
  }

  const currentList = data[view as keyof typeof data];

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/50 border border-gray-100"></div>);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = data.calendarEvents.filter(e => e.date === dateStr);
      
      days.push(
        <div 
          key={d} 
          className="h-32 bg-white border border-gray-100 p-2 hover:bg-orange-50/30 transition-colors group relative"
          onClick={() => handleAddEvent(dateStr)}
        >
          <span className="text-sm font-bold text-gray-400 group-hover:text-orange-500 transition-colors">{d}</span>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
                className={`text-[10px] p-1 rounded-md truncate cursor-pointer shadow-sm ${
                  event.type === 'official' ? 'bg-orange-100 text-orange-700 border-l-2 border-orange-500' : 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
          <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400">
            <Plus size={14} />
          </button>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 serif flex items-center gap-4">
            실시간 관리 센터
            {loading && <Loader2 className="w-8 h-8 animate-spin text-orange-500" />}
          </h1>
          <p className="text-gray-500 mt-2">SQLite DB 데이터와 실시간 연동 중입니다.</p>
        </div>
        
        <div className="flex flex-wrap items-center bg-white p-2 rounded-[1.5rem] shadow-sm border border-orange-50 gap-2">
          <button 
            onClick={loadAllData}
            disabled={loading}
            className="p-3 hover:bg-orange-50 rounded-xl text-orange-500 transition-colors disabled:opacity-50"
            title="새로고침"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="w-px h-6 bg-gray-100 mx-2"></div>
          {[
            { id: 'inquiries', label: '문의', icon: <MessageSquare size={18} />, count: data.inquiries.length },
            { id: 'sponsorships', label: '후원 현황', icon: <Handshake size={18} />, count: data.sponsorships.length },
            { id: 'guestbook', label: '방명록', icon: <BookOpen size={18} />, count: data.guestbook.length },
            { id: 'testimonies', label: '간증', icon: <Quote size={18} />, count: data.testimonies.length },
            { id: 'resources', label: '자료실', icon: <BookOpen size={18} />, count: data.resources.length },
            { id: 'calendar', label: '일정 관리', icon: <CalendarIcon size={18} />, count: data.calendarEvents.length },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${view === tab.id ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${view === tab.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {view === 'calendar' ? (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-orange-50 overflow-hidden p-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-center gap-12 mb-10">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-3 hover:bg-orange-50 text-orange-500 rounded-full transition-all hover:scale-110"
            >
              <ChevronLeft size={32} />
            </button>
            <h2 className="text-4xl font-bold text-gray-800 serif min-w-[250px] text-center">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </h2>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-3 hover:bg-orange-50 text-orange-500 rounded-full transition-all hover:scale-110"
            >
              <ChevronRight size={32} />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={`text-center font-bold text-xs uppercase tracking-widest py-4 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 border-t border-l border-gray-100">
            {renderCalendar()}
          </div>
          <div className="mt-8 flex gap-6 text-xs font-bold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-500">공식 일정</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-500">개인 일정</span>
            </div>
            <div className="ml-auto text-gray-400 italic">
              * 날짜를 클릭하여 일정을 추가할 수 있습니다.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-orange-50 overflow-hidden">
          {!loading && currentList.length === 0 ? (
            <div className="py-40 text-center">
              <RefreshCcw className="text-gray-200 w-16 h-16 mx-auto mb-4" />
              <p className="text-gray-400 serif text-xl">데이터가 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">날짜</th>
                    <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">작성자/후원자</th>
                    <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">상세 내역</th>
                    <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentList.map((item: any, idx) => (
                    <tr key={item.id || idx} className="hover:bg-orange-50/10 transition-colors group">
                      <td className="px-10 py-8 text-sm text-gray-400 font-medium">{item.date}</td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                          <p className="font-bold text-gray-800 text-lg">{item.name || item.author}</p>
                          {item.phone && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone size={10} /> {item.phone}
                            </p>
                          )}
                          {item.email && <p className="text-xs text-orange-400">{item.email}</p>}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-2">
                          {view === 'sponsorships' ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${item.type === '정기후원' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {item.type}
                                </span>
                                <p className="font-bold text-gray-800">
                                  {Number(item.amount).toLocaleString()}원
                                </p>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 max-w-md">
                                {item.message || '남긴 메시지가 없습니다.'}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-700">{item.subject || item.title || '메시지'}</p>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 max-w-md">
                                {item.message || item.description || item.content}
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-2">
                          {view === 'resources' && (
                            <button 
                              onClick={() => handleEditResource(item)}
                              className="p-2 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                              title="수정"
                            >
                              <RefreshCcw size={18} />
                            </button>
                          )}
                          {view === 'sponsorships' && (
                            <button 
                              onClick={() => handleEditSponsorship(item)}
                              className="p-2 text-gray-300 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                              title="수정"
                            >
                              <RefreshCcw size={18} />
                            </button>
                          )}
                          <button 
                            onClick={() => setDeletingItem({ id: item.id, viewType: view })}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="삭제"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Resource Edit Modal */}
      {editingResource && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 serif">자료 수정</h2>
              <button onClick={() => setEditingResource(null)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSaveResource} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">카테고리</label>
                  <select 
                    value={editingResource.category}
                    onChange={(e) => setEditingResource({...editingResource, category: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  >
                    <option value="설교자료">설교자료</option>
                    <option value="찬양자료">찬양자료</option>
                    <option value="선교자료">선교자료</option>
                    <option value="교육자료">교육자료</option>
                    <option value="교회행정자료">교회행정자료</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">작성자</label>
                  <input 
                    type="text"
                    value={editingResource.author}
                    onChange={(e) => setEditingResource({...editingResource, author: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">제목</label>
                <input 
                  type="text"
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({...editingResource, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">설명</label>
                <textarea 
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">파일 URL</label>
                <input 
                  type="text"
                  value={editingResource.fileUrl}
                  onChange={(e) => setEditingResource({...editingResource, fileUrl: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sponsorship Edit Modal */}
      {editingSponsorship && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 serif">후원 정보 수정</h2>
              <button onClick={() => setEditingSponsorship(null)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSaveSponsorship} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">후원자 성함</label>
                  <input 
                    type="text"
                    value={editingSponsorship.name}
                    onChange={(e) => setEditingSponsorship({...editingSponsorship, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">연락처</label>
                  <input 
                    type="text"
                    value={editingSponsorship.phone}
                    onChange={(e) => setEditingSponsorship({...editingSponsorship, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">후원 유형</label>
                  <select 
                    value={editingSponsorship.type}
                    onChange={(e) => setEditingSponsorship({...editingSponsorship, type: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  >
                    <option value="정기후원">정기후원</option>
                    <option value="일시후원">일시후원</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">금액 (원)</label>
                  <input 
                    type="number"
                    value={editingSponsorship.amount}
                    onChange={(e) => setEditingSponsorship({...editingSponsorship, amount: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">메시지</label>
                <textarea 
                  value={editingSponsorship.message}
                  onChange={(e) => setEditingSponsorship({...editingSponsorship, message: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingSponsorship(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Calendar Event Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 serif">일정 {editingEvent.id ? '수정' : '추가'}</h2>
              <button onClick={() => setEditingEvent(null)} className="text-gray-400 hover:text-gray-600">
                <Trash2 className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSaveEvent} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">일정 유형</label>
                  <select 
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value as any})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  >
                    <option value="official">공식 일정</option>
                    <option value="personal">개인 일정</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-2">날짜</label>
                  <input 
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">일정 제목</label>
                <input 
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none"
                  placeholder="일정 제목을 입력하세요"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-2">상세 설명</label>
                <textarea 
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                  placeholder="상세 내용을 입력하세요"
                />
              </div>
              <div className="flex gap-4 pt-4">
                {editingEvent.id && (
                  <button 
                    type="button"
                    onClick={() => {
                      setDeletingItem({ id: editingEvent.id, viewType: 'calendar' });
                      setEditingEvent(null);
                    }}
                    className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-100 transition-all"
                  >
                    삭제
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 serif mb-2">정말 삭제하시겠습니까?</h3>
              <p className="text-gray-500 text-sm">이 작업은 되돌릴 수 없습니다.</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 transition-all border-r border-gray-100"
              >
                취소
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-4 text-red-500 font-bold hover:bg-red-50 transition-all"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
