'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';
import { FAKULTAS_OPTIONS } from '@/utils/locationConfig';
import Navbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();
  const { setLocation } = useLocation();
  const [selectedFakultas, setSelectedFakultas] = useState('');

  const handleFakultasChange = (e) => {
    setSelectedFakultas(e.target.value);
  };

  const handleStartScan = () => {
    if (!selectedFakultas) {
      alert('Silakan pilih fakultas terlebih dahulu!');
      return;
    }

    // Save fakultas to context (lokasi akan dipilih di Result page)
    setLocation(selectedFakultas, '', null);
    
    // Navigate to scan page
    router.push('/scan');
  };

  return (
    <>
      <Navbar />
      <div className="px-5 max-w-7xl mx-auto py-5">
        {/* Hero Section */}
        <div className="text-center py-16 px-5 bg-[#1e293b] rounded-[20px] text-white mb-16 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <h1 className="text-6xl font-extrabold mb-4 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)]">
            EcoScan
          </h1>
          <p className="text-2xl mb-5 font-medium">
            Identifikasi Sampah dengan Mudah
          </p>
          <p className="text-lg max-w-3xl mx-auto mb-10 leading-relaxed opacity-95">
            Scan sampah Anda dan dapatkan informasi tentang jenis sampah serta 
            cara pembuangan yang benar untuk lingkungan yang lebih bersih.
          </p>
          
          {/* Location Selection */}
          <div className="bg-[#10b981] rounded-2xl p-8 my-8 mx-auto max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <h3 className="text-xl mb-2 font-semibold text-white">
              📍 Pilih Fakultas Anda
            </h3>
            <p className="text-sm text-white/90 mb-5">
              Lokasi spesifik akan dipilih setelah scan
            </p>
            
            <div className="mb-5 text-left">
              <label htmlFor="fakultas-select" className="block mb-2 font-medium text-base text-white">
                Fakultas:
              </label>
              <select
                id="fakultas-select"
                className="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white text-gray-800 cursor-pointer transition-all duration-300 hover:border-white hover:shadow-md focus:outline-none focus:border-white focus:ring-4 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedFakultas}
                onChange={handleFakultasChange}
              >
                <option value="">-- Pilih Fakultas --</option>
                {FAKULTAS_OPTIONS.map((fakultas) => (
                  <option key={fakultas.value} value={fakultas.value}>
                    {fakultas.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedFakultas && (
              <div className="mt-5 p-4 bg-white/20 rounded-xl text-left">
                <p className="text-base leading-normal m-0 text-white">
                  ✅ Fakultas dipilih: <strong className="font-semibold">
                    {FAKULTAS_OPTIONS.find(f => f.value === selectedFakultas)?.label}
                  </strong>
                </p>
              </div>
            )}
          </div>

          <button 
            className="bg-white text-[#1e293b] border-none px-12 py-4 text-xl font-semibold rounded-full cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] mt-5 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_6px_20px_rgba(0,0,0,0.3)] disabled:opacity-60 disabled:cursor-not-allowed active:enabled:translate-y-0" 
            onClick={handleStartScan}
            disabled={!selectedFakultas}
          >
            Mulai Scan
          </button>
        </div>

        {/* Features Section */}
        <div className="py-10 px-5">
          <h2 className="text-center text-4xl text-gray-800 mb-10">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 className="text-xl text-gray-800 mb-2.5">
                Identifikasi Cepat
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Scan dan identifikasi jenis sampah dalam hitungan detik
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]">
              <span className="text-5xl block mb-4">♻️</span>
              <h3 className="text-xl text-gray-800 mb-2.5">
                Panduan Pembuangan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan instruksi cara membuang sampah yang benar
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]">
              <span className="text-5xl block mb-4">🌱</span>
              <h3 className="text-xl text-gray-800 mb-2.5">
                Ramah Lingkungan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bantu menjaga lingkungan dengan pemilahan sampah yang tepat
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]">
              <span className="text-5xl block mb-4">📍</span>
              <h3 className="text-xl text-gray-800 mb-2.5">
                Lokasi Spesifik
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Rekomendasi tempat sampah sesuai lokasi Anda di kampus
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
