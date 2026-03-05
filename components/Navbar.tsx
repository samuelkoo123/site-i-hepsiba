
import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, Heart, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: '홈', value: Page.Home },
    { label: '선교회 소개', value: Page.About },
    { label: '사역 안내', value: Page.Ministries },
    { label: '나눔 광장', value: Page.Community },
    { label: 'AI 멘토', value: Page.AiMentor, isSpecial: true },
    { label: '자료실', value: Page.Resources },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate(Page.Home)}
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <Heart className="text-orange-600 w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">헵시바 선교회</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentPage === item.value 
                    ? 'text-orange-600' 
                    : 'text-gray-600 hover:text-orange-500'
                } ${item.isSpecial ? 'bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 hover:bg-orange-100' : ''}`}
              >
                {item.isSpecial && <Sparkles size={14} className="text-orange-400" />}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate(Page.Support)}
              className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-shadow shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Heart size={16} /> 후원하기
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-orange-50 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onNavigate(item.value);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium ${
                currentPage === item.value 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                {item.isSpecial && <Sparkles size={16} className="text-orange-400" />}
                {item.label}
              </div>
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate(Page.Support);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-center px-4 py-3 bg-orange-500 text-white rounded-lg font-medium shadow-sm"
          >
            후원하기
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
