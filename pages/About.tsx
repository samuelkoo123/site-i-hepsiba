
import React from 'react';
import { Heart, Sun, Leaf, Anchor } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-20 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 serif">선교회 소개</h1>
          <p className="text-orange-600 font-medium tracking-widest uppercase">Our Identity & Vision</p>
          <div className="w-24 h-1 bg-orange-200 mx-auto mt-6"></div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 serif">헵시바: "나의 기쁨이 그녀에게 있다"</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              이사야 62장 4절에 등장하는 '헵시바'는 하나님께서 당신의 백성을 얼마나 사랑하시는지 보여주는 이름입니다. 
              우리는 그 사랑을 가슴에 품고, 세상 속에서 하나님의 기쁨이 되는 공동체가 되고자 합니다.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              사랑으로 전도와 선교의 사명을 감당하며, 소외된 이웃들에게 따뜻한 밥 한 끼와 
              복음의 소망을 전하는 것이 우리의 핵심 가치입니다.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3">
            <img 
              src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800" 
              alt="Nature reflection" 
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="bg-white rounded-[3rem] p-12 md:p-20 shadow-sm border border-orange-50 mb-32">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16 serif">4대 핵심 비전</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {[
              { icon: <Sun className="text-orange-400" />, title: "복음 중심 전도", desc: "예수 그리스도의 십자가 사랑을 모든 영혼에게 선포합니다." },
              { icon: <Anchor className="text-blue-400" />, title: "열방 선교 지원", desc: "땅끝까지 선교사를 파송하고 현지 교회를 돕습니다." },
              { icon: <Heart className="text-rose-400" />, title: "이웃 구제 사역", desc: "물질적, 정서적으로 곤경에 처한 이들을 돕습니다." },
              { icon: <Leaf className="text-green-400" />, title: "전인격적 치유", desc: "말씀과 기도로 영, 혼, 몸의 진정한 회복을 이룹니다." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 serif">인사말</h2>
            <p className="text-gray-600 italic leading-loose text-lg">
              "주님의 사랑 안에서 여러분을 환영합니다. 헵시바 선교회는 단순한 단체가 아닌, 
              함께 웃고 울며 주님의 나라를 일구어가는 가족입니다. 
              고통 속에 있는 영혼들이 주님의 날개 아래서 쉼을 얻고 회복되길 간절히 기도합니다."
            </p>
            <p className="font-bold text-gray-800"></p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
