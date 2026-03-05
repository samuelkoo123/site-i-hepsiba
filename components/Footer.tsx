
import React from 'react';
import { Page } from '../types';
import { Mail, Phone, MapPin, Settings } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 serif">헵시바 선교회</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              사랑으로 전도와 선교의 사명을 감당하며,<br />
              도움이 필요한 자의 곁에서 그리스도의 사랑을 전합니다.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">연락처</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-orange-400" />
                <span>010-3264-8413</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-orange-400" />
                <span>samuel_koo@hanmail.net</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-orange-400" />
                <span>인천광역시 계양구 봉오대로 744번길 7 1동 805호</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">함께하기</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onNavigate(Page.Resources)}
                className="text-sm text-gray-600 hover:text-orange-600 text-left transition-colors"
              >
                사역 자료실
              </button>
              <button 
                onClick={() => onNavigate(Page.Community)}
                className="text-sm text-gray-600 hover:text-orange-600 text-left transition-colors"
              >
                간증 및 방명록
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; 2026 Hephzibah Mission.
          </p>
          <button 
            onClick={() => onNavigate(Page.Admin)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings size={12} />
            관리자 모드
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
