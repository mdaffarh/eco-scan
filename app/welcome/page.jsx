'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleNext = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
      router.push('/home');
    }
  };

  const screens = [
    {
      icons: { large: '♻️', medium: '🗑️', small: '🌱' },
      title: 'Identifikasi Sampah',
      description: 'Scan sampah dengan mudah dan dapatkan informasi cara pembuangan yang benar untuk lingkungan yang lebih bersih'
    },
    {
      icons: { large: '📷', medium: '🔍', small: '✨' },
      title: 'Scan & Analisis',
      description: 'Gunakan kamera untuk mengambil foto sampah, AI kami akan mengidentifikasi jenis sampah secara otomatis'
    },
    {
      icons: { large: '🌍', medium: '💚', small: '♻️' },
      title: 'Jaga Lingkungan',
      description: 'Dengan memilah sampah dengan benar, kita berkontribusi untuk bumi yang lebih bersih dan sehat'
    }
  ];

  const currentData = screens[currentScreen];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8f9ff] to-white p-5">
      <div className="max-w-[480px] w-full text-center flex flex-col items-center gap-7">
        {/* Logo Section */}
        <div className="mt-5">
          <h1 className="text-5xl font-bold text-primary mb-1 flex items-center justify-center gap-2.5 tracking-[2px]">
            EcoScan
          </h1>
          <p className="text-sm text-gray-500 italic m-0">Our New Lifestyles</p>
        </div>

        {/* Illustration Section */}
        <div className="w-full my-5">
          <div className="w-full max-w-[400px] h-[350px] mx-auto bg-[#1e293b] rounded-[30px] flex items-center justify-center relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
            {/* Placeholder untuk ilustrasi */}
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              <span className="text-[8rem] absolute animate-[float_3s_ease-in-out_infinite]">
                {currentData.icons.large}
              </span>
              <span className="text-6xl absolute top-5 right-2.5 animate-[float_2.5s_ease-in-out_infinite] [animation-delay:0.5s]">
                {currentData.icons.medium}
              </span>
              <span className="text-5xl absolute bottom-7 left-5 animate-[float_2s_ease-in-out_infinite] [animation-delay:1s]">
                {currentData.icons.small}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-5">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {currentData.title}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-[400px] mx-auto">
            {currentData.description}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-3 justify-center my-2.5">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentScreen === index
                  ? 'w-[30px] bg-[#10b981]'
                  : 'w-2.5 bg-gray-300'
              }`}
            ></span>
          ))}
        </div>

        {/* Button Section */}
        <button
          className="w-full max-w-[400px] py-4 px-10 text-xl font-semibold text-white bg-[#10b981] hover:bg-[#059669] border-none rounded-full cursor-pointer transition-all duration-300 shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(16,185,129,0.4)] active:-translate-y-0 mt-2.5"
          onClick={handleNext}
        >
          {currentScreen === 2 ? 'Mulai' : 'Lanjutkan'}
        </button>
      </div>

      {/* Keyframe animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
}
