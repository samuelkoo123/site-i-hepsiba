
import React, { useState } from 'react';
import { CreditCard, Heart, Users, Globe, Loader2, Handshake } from 'lucide-react';
import { db } from '../db';

const Support: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', amount: '', type: '정기후원' as '정기후원' | '일시후원', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const success = await db.save('sponsorship', {
      ...formData,
      amount: Number(formData.amount),
      date: new Date().toLocaleDateString()
    });

    if (success) {
      alert('후원 신청이 구글 스프레드시트 DB에 접수되었습니다. 주님의 축복이 가득하시길 기도합니다.');
      setFormData({ name: '', phone: '', amount: '', type: '정기후원', message: '' });
    } else {
      alert('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
    setSubmitting(false);
  };

  return (
    <div className="py-24 bg-[#FCFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-2 text-orange-600">
            <Handshake size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 serif">후원 안내</h1>
          <p className="text-gray-500 max-w-xl mx-auto">헵시바 선교회의 전도와 선교 사역은 동역자님들의 소중한 후원으로 이루어집니다.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Support Info */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 serif">동역의 기쁨에 참여하세요</h2>
              <div className="space-y-6">
                {[
                  { icon: <Heart className="text-orange-500" />, title: "정기 후원", desc: "매월 일정 금액을 후원하여 사역의 안정적인 동력이 되어주세요." },
                  { icon: <CreditCard className="text-blue-500" />, title: "일시 후원", desc: "특별한 기념일이나 주님의 마음이 닿을 때 자유롭게 후원하실 수 있습니다." },
                  { icon: <Users className="text-green-500" />, title: "물품/사역 지원", desc: "생필품, 악기, 선교 장비 등 사역에 필요한 물품으로도 동역하실 수 있습니다." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-3xl bg-white shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0 w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Account Card */}
            <div className="bg-orange-500 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <Globe className="w-16 h-16 opacity-20 absolute -top-4 -right-4" />
                <h3 className="text-2xl font-bold serif flex items-center gap-2">
                  무통장 입금 계좌
                </h3>
                <div className="space-y-5 mt-10">
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="opacity-80 text-sm">은행명</span>
                    <span className="font-bold">국민은행</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="opacity-80 text-sm">계좌번호</span>
                    <span className="font-bold text-xl tracking-wider">089502-04-038657</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-80 text-sm">예금주</span>
                    <span className="font-bold">구본배</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl border border-orange-50">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-10 serif">온라인 후원 신청</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">성함</label>
                <input 
                  required type="text" value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none"
                  placeholder="실명 혹은 기업/단체명"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">연락처</label>
                <input 
                  required type="tel" value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none"
                  placeholder="010-0000-0000"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(['정기후원', '일시후원'] as const).map(type => (
                  <button 
                    key={type} type="button"
                    onClick={() => setFormData({...formData, type})}
                    className={`py-4 rounded-2xl font-bold border-2 transition-all ${formData.type === type ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-400'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">후원 예정 금액 (원)</label>
                <input 
                  required type="number" value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none"
                  placeholder="예: 50000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">기도 제목 및 한마디 (선택)</label>
                <textarea 
                  rows={4} value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none resize-none"
                  placeholder="선교회에 전하고 싶은 말씀이나 기도 제목을 적어주세요"
                ></textarea>
              </div>
              <button 
                disabled={submitting}
                type="submit" className="w-full py-5 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-orange-600 transition-all flex justify-center items-center gap-2"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {submitting ? '접수 중...' : '후원 동참하기'}
              </button>
            </form>
            <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
              * 신청하신 정보는 구글 스프레드시트 사역 관리용으로만 사용되며,<br />
              입금 확인 후 선교회에서 개별 연락을 드립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
