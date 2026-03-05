
import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
// Fix: Added FolderOpen to the imported icons from lucide-react
import { Search, Download, Upload, Filter, FileText, Music, Globe, GraduationCap, Briefcase, X, Loader2, Plus, FolderOpen } from 'lucide-react';
import { db } from '../db';

const CATEGORIES = ['전체', '설교자료', '찬양자료', '선교자료', '교육자료', '교회행정자료'] as const;

const Resources: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [uploadData, setUploadData] = useState({
    title: '',
    author: '',
    category: '설교자료' as Resource['category'],
    description: '',
    fileUrl: ''
  });

  const loadResources = async () => {
    setLoading(true);
    const data = await db.getAll();
    setResources(data.resources || []);
    setLoading(false);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await db.save('resource', uploadData);
    if (success) {
      alert('자료가 성공적으로 등록되었습니다.');
      setUploadData({ title: '', author: '', category: '설교자료', description: '', fileUrl: '' });
      setIsUploadOpen(false);
      loadResources();
    } else {
      alert('등록 중 오류가 발생했습니다.');
    }
    setSubmitting(false);
  };

  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === '전체' || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '설교자료': return <FileText className="text-indigo-500" />;
      case '찬양자료': return <Music className="text-rose-500" />;
      case '선교자료': return <Globe className="text-blue-500" />;
      case '교육자료': return <GraduationCap className="text-emerald-500" />;
      case '교회행정자료': return <Briefcase className="text-amber-500" />;
      default: return <FileText />;
    }
  };

  return (
    <div className="py-16 bg-[#FCFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 serif">사역 자료실</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            헵시바 선교회가 나누는 복음의 지혜와 사역 도구입니다.<br />
            함께 공유하며 주님의 나라를 더 든든히 세워갑니다.
          </p>
        </div>

        {/* Action Bar (Centered Layout) */}
        <div className="flex flex-col items-center gap-6 mb-16">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            <input 
              type="text" 
              placeholder="자료명, 작성자, 내용 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-3xl border border-orange-100 focus:ring-2 focus:ring-orange-200 outline-none shadow-md bg-white text-lg transition-all"
            />
          </div>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-10 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <Plus size={22} /> 자료 등록하기
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${
                activeCategory === cat 
                ? 'bg-orange-100 border-orange-500 text-orange-600' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource Grid */}
        {loading ? (
          <div className="flex flex-col items-center py-32 text-orange-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="serif text-xl">자료를 불러오고 있습니다...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-orange-50 p-32 text-center shadow-inner">
            <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-400 serif text-xl">해당 조건에 맞는 자료가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((res) => (
              <div 
                key={res.id} 
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50 hover:shadow-xl transition-all group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-orange-50 transition-colors">
                    {getCategoryIcon(res.category)}
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full uppercase tracking-widest">{res.date}</span>
                </div>
                <div className="mb-4">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter mb-1 block">{res.category}</span>
                  <div className="h-14 overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-800 serif line-clamp-2">{res.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {res.description}
                </p>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400">작성자: {res.author}</span>
                  <a 
                    href={res.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors"
                  >
                    다운로드 <Download size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-6 md:p-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                      <Upload size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 serif">자료 등록</h2>
                  </div>
                  <button onClick={() => setIsUploadOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 ml-1">자료 분류</label>
                      <select 
                        required 
                        value={uploadData.category}
                        onChange={(e) => setUploadData({...uploadData, category: e.target.value as any})}
                        className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none text-sm"
                      >
                        {CATEGORIES.slice(1).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 ml-1">작성자/출처</label>
                      <input 
                        required type="text"
                        value={uploadData.author}
                        onChange={(e) => setUploadData({...uploadData, author: e.target.value})}
                        placeholder="이름 혹은 출처"
                        className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">자료 제목</label>
                    <input 
                      required type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                      placeholder="자료의 제목을 입력하세요"
                      className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">자료 링크 (URL)</label>
                    <input 
                      required type="url"
                      value={uploadData.fileUrl}
                      onChange={(e) => setUploadData({...uploadData, fileUrl: e.target.value})}
                      placeholder="공유 링크 (Google Drive 등)"
                      className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none text-sm"
                    />
                    <p className="text-[9px] text-gray-400 ml-1">* 외부 저장소 링크를 입력해 주세요.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">자료 설명</label>
                    <textarea 
                      rows={3}
                      value={uploadData.description}
                      onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                      placeholder="자료에 대한 간단한 설명"
                      className="w-full px-5 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-orange-200 bg-gray-50 outline-none resize-none text-sm"
                    ></textarea>
                  </div>
                  <button 
                    disabled={submitting}
                    type="submit" 
                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base shadow-lg hover:bg-orange-600 transition-all flex justify-center items-center gap-2 mt-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? '등록 중...' : '자료 등록 완료'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
