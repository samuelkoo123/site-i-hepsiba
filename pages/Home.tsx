
import React from 'react';
import { Page } from '../types';
import { Heart, Music, Utensils, Zap, Quote, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=2000" 
            alt="The Cross and Jesus' Love" 
            className="w-full h-full object-cover brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-950/30 via-transparent to-orange-950/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-4"
          >
            <p className="text-xl md:text-3xl font-medium opacity-90 serif tracking-[0.2em]">
              하나님의 기쁨!
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight serif drop-shadow-2xl text-white">
              헵시바 선교회
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] inline-block border border-white/20 shadow-2xl"
          >
            <p className="text-xl md:text-2xl font-medium italic opacity-95 leading-relaxed serif">
              "예수께서 이르시되 할 수 있거든이 무슨 말이냐<br />
              믿는 자에게는 능히 하지 못할 일이 없느니라 하시니"
            </p>
            <div className="w-16 h-0.5 bg-orange-400 mx-auto my-6"></div>
            <span className="block text-base md:text-lg font-bold text-orange-300 tracking-wider">마가복음 9:23</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <button 
              onClick={() => onNavigate(Page.About)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-14 py-4 rounded-full text-lg font-bold transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
            >
              선교회 소개 보기 <Heart className="w-5 h-5 fill-current" />
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FCFBF7] to-transparent z-10"></div>
      </section>

      {/* Vision Summary */}
      <section className="py-24 bg-[#FCFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 serif">선교회 비전</h2>
            <div className="w-12 h-1 bg-orange-400 mx-auto mb-6"></div>
            <p className="text-gray-500 max-w-2xl mx-auto">헵시바 선교회는 복음의 능력으로 영혼을 치유하고 세상을 변화시킵니다.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Heart className="w-10 h-10 text-orange-500" />, 
                title: "복음의 능력", 
                desc: "변치 않는 하나님의 말씀을 세상 끝까지 전하며 영혼 구원에 앞장섭니다." 
              },
              { 
                icon: <Zap className="w-10 h-10 text-yellow-500" />, 
                title: "치유와 회복", 
                desc: "성령의 역사로 영, 혼, 몸의 전인격적인 치유와 온전한 회복을 선포합니다." 
              },
              { 
                icon: <Quote className="w-10 h-10 text-blue-400" />, 
                title: "구제와 사역", 
                desc: "가난하고 소외된 자들에게 그리스도의 따뜻한 손길과 사랑을 나눕니다." 
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-10 rounded-[2.5rem] bg-white border border-orange-100/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                  {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-10 h-10 transition-colors" })}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 serif">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-orange-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-3xl font-bold text-white serif leading-tight"
          >
            복음의 지혜를 함께 나누고<br />사역을 든든히 세워갑니다.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-xl leading-relaxed max-w-2xl mx-auto"
          >
            헵시바 선교회 자료실에서 사역에 필요한 다양한 자료들을 확인해 보세요.<br />
            함께 공부하고 기도로 준비하며 주님의 나라를 세워갑니다.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 pt-4"
          >
            <button 
              onClick={() => onNavigate(Page.Resources)}
              className="px-12 py-5 bg-white text-orange-600 font-bold rounded-full shadow-2xl hover:bg-orange-50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <FolderOpen size={20} /> 자료실 바로가기
            </button>
            <button 
              onClick={() => onNavigate(Page.Community)}
              className="px-12 py-5 border-2 border-white/50 text-white font-bold rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              사역 문의하기
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
