
import React from 'react';
import { Music, Mic2, HeartHandshake, Sparkles } from 'lucide-react';

const Ministries: React.FC = () => {
  const ministryList = [
    {
      id: 1,
      title: "작은 음악회",
      icon: <Music className="w-12 h-12" />,
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
      description: "매년 가을 9월 셋째 주 토요일, 충청북도 보은 지역 주민들과 함께하는 따뜻한 음악 및 CCM 음악회입니다. 음악을 통해 마음에 평안을 선사합니다.",
      time: "매년 가을 9월 셋째 주 토요일 오전 10시",
      location: "보은 늘사랑 교회 예배당"
    },
    {
      id: 2,
      title: "찬양 버스킹",
      icon: <Mic2 className="w-12 h-12" />,
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
      description: "거리에서 울려 퍼지는 찬양을 통해 잃어버린 영혼들에게 다가갑니다. 밝고 경쾌한 찬양으로 하나님을 증거합니다.",
      time: "매월 세째 주 목요일 오후 2시",
      location: "공원 및 번화가"
    },
    {
      id: 3,
      title: "구제사역(사랑의 식사)",
      icon: <HeartHandshake className="w-12 h-12" />,
      image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&q=80&w=800",
      description: "따뜻한 밥 한 끼로 주님의 사랑을 나눕니다. 노숙인 및 저소득층 어르신들에게 영양 가득한 식사를 대접합니다.",
      time: "매주 월, 수, 금 오전 11시",
      location: "은혜교회 헵시바 나눔 식당"
    },
    {
      id: 4,
      title: "금요성령치유집회",
      icon: <Sparkles className="w-12 h-12" />,
      image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800",
      description: "강력한 기도의 영성으로 영적 갈급함을 채우고 육체의 질병과 마음의 상처를 치유받는 뜨거운 집회 시간입니다.",
      time: "매주 금요일 저녁 8시",
      location: "예수사랑교회 예배당"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 serif">사역 안내</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">헵시바 선교회는 복음의 능력으로 세상의 어둠을 밝히는 구체적인 실천 사역들을 감당하고 있습니다.</p>
        </div>

        <div className="space-y-32">
          {ministryList.map((m, idx) => (
            <div key={m.id} className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
              <div className="w-full md:w-1/2">
                <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
                  <img src={m.image} alt={m.title} className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-6 py-4 rounded-3xl shadow-lg">
                    <div className="text-orange-500">{m.icon}</div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-widest uppercase mb-2">
                  Ministry {m.id}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 serif">{m.title}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{m.description}</p>
                <div className="space-y-4 bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 font-bold text-xs uppercase">Time</div>
                    <span className="text-gray-700 font-medium">{m.time}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-orange-500 font-bold text-xs uppercase">Loc</div>
                    <span className="text-gray-700 font-medium">{m.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ministries;
