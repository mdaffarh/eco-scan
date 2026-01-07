"use client"

import Navbar from "@/components/Navbar"

export default function About() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-5 min-h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="text-center mb-12 py-10 px-5 bg-[#1e293b] rounded-[20px] text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
          <h1 className="text-5xl mb-2.5 font-bold">Tentang EcoScan</h1>
          <p className="text-xl opacity-95">Solusi Cerdas untuk Identifikasi Sampah</p>
        </div>

        <div className="bg-white rounded-[20px] p-10 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#10b981] font-bold">Apa itu EcoScan?</h2>
            <p className="text-gray-600 text-lg leading-[1.8]">
              EcoScan adalah aplikasi berbasis AI yang membantu Anda mengidentifikasi jenis sampah dengan mudah dan cepat. Cukup ambil foto sampah, dan aplikasi kami akan memberikan informasi lengkap tentang jenis sampah tersebut beserta
              cara pembuangan yang tepat.
            </p>
          </section>

          {/* How to Use */}
          <section className="mb-12">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#10b981] font-bold">Cara Menggunakan</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-8">
              <div className="text-center py-8 px-5 bg-[#f8f9ff] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
                <div className="w-[60px] h-[60px] bg-[#10b981] text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-5">1</div>
                <h3 className="text-2xl text-[#10b981] mb-2.5 font-semibold">Ambil Foto</h3>
                <p className="text-gray-600 text-base">Klik tombol &quot;Mulai Scan&quot; dan ambil foto sampah Anda</p>
              </div>
              <div className="text-center py-8 px-5 bg-[#f8f9ff] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
                <div className="w-[60px] h-[60px] bg-[#10b981] text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-5">2</div>
                <h3 className="text-2xl text-[#10b981] mb-2.5 font-semibold">Proses AI</h3>
                <p className="text-gray-600 text-base">Sistem AI kami akan menganalisis dan mengidentifikasi jenis sampah</p>
              </div>
              <div className="text-center py-8 px-5 bg-[#f8f9ff] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
                <div className="w-[60px] h-[60px] bg-[#10b981] text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-5">3</div>
                <h3 className="text-2xl text-[#10b981] mb-2.5 font-semibold">Lihat Hasil</h3>
                <p className="text-gray-600 text-base">Dapatkan informasi detail dan panduan pembuangan yang benar</p>
              </div>
            </div>
          </section>

          {/* Waste Categories */}
          <section className="mb-12">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#10b981] font-bold">Kategori Sampah</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mt-8">
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#10b981] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(16,185,129,0.2)]">
                <span className="text-6xl block mb-4">🌿</span>
                <h3 className="text-xl text-gray-800 mb-2.5">Organik</h3>
                <p className="text-gray-600 text-sm leading-normal">Sampah yang dapat terurai secara alami seperti sisa makanan, daun, ranting</p>
              </div>
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#10b981] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(16,185,129,0.2)]">
                <span className="text-6xl block mb-4">♻️</span>
                <h3 className="text-xl text-gray-800 mb-2.5">Anorganik</h3>
                <p className="text-gray-600 text-sm leading-normal">Sampah yang tidak dapat terurai seperti plastik, logam, kaca</p>
              </div>
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#10b981] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(16,185,129,0.2)]">
                <span className="text-6xl block mb-4">⚠️</span>
                <h3 className="text-xl text-gray-800 mb-2.5">B3 (Berbahaya)</h3>
                <p className="text-gray-600 text-sm leading-normal">Sampah yang mengandung bahan berbahaya seperti baterai, cat, pestisida</p>
              </div>
              <div className="text-center py-6 px-4 bg-white border-2 border-gray-200 rounded-2xl transition-all duration-300 hover:border-[#10b981] hover:-translate-y-1 hover:shadow-[0_8px_15px_rgba(16,185,129,0.2)]">
                <span className="text-6xl block mb-4">🔄</span>
                <h3 className="text-xl text-gray-800 mb-2.5">Dapat Didaur Ulang</h3>
                <p className="text-gray-600 text-sm leading-normal">Sampah yang dapat diolah kembali seperti kertas, kardus, botol plastik</p>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section className="mb-12 bg-[#f0fdf4] p-8 rounded-2xl border-l-[5px] border-[#10b981]">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#10b981] font-bold">Misi Kami</h2>
            <p className="text-gray-700 text-xl leading-[1.8] font-medium">
              Membantu masyarakat untuk memilah dan membuang sampah dengan benar, sehingga dapat mengurangi pencemaran lingkungan dan meningkatkan kesadaran akan pentingnya pengelolaan sampah yang baik.
            </p>
          </section>

          {/* Team Info */}
          <section className="text-center mb-0">
            <h2 className="text-3xl text-gray-800 mb-5 pb-2.5 border-b-[3px] border-[#10b981] font-bold">Tentang Proyek</h2>
            <p className="text-gray-600 text-lg leading-[1.8] mb-4">
              EcoScan dikembangkan sebagai <strong>Tugas Besar Mata Kuliah Basis Data Non-Relational</strong>
              di Universitas Pendidikan Indonesia. Proyek ini bertujuan untuk memberikan solusi praktis dalam pengelolaan sampah melalui integrasi teknologi kecerdasan buatan (AI) dan database NoSQL yang scalable. Dengan memanfaatkan
              MongoDB sebagai basis data utama, aplikasi ini mampu menyimpan dan mengolah data sampah secara real-time, memberikan insight statistik, serta mendukung sistem tracking riwayat scan untuk setiap pengguna.
            </p>

            <div className="mt-8 p-8 bg-[#f8f9ff] rounded-2xl">
              <h3 className="text-2xl text-[#10b981] mb-6 font-bold">Teknologi yang Digunakan</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">⚛️</div>
                  <h4 className="font-bold text-gray-800 text-sm">Next.js 15</h4>
                  <p className="text-xs text-gray-500">Frontend Framework</p>
                </div>
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-bold text-gray-800 text-sm">React 19</h4>
                  <p className="text-xs text-gray-500">UI Library</p>
                </div>
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">🍃</div>
                  <h4 className="font-bold text-gray-800 text-sm">MongoDB Atlas</h4>
                  <p className="text-xs text-gray-500">NoSQL Database</p>
                </div>
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">🚀</div>
                  <h4 className="font-bold text-gray-800 text-sm">Node.js</h4>
                  <p className="text-xs text-gray-500">Backend Runtime</p>
                </div>
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-bold text-gray-800 text-sm">TensorFlow.js</h4>
                  <p className="text-xs text-gray-500">AI/ML Model</p>
                </div>
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">🎨</div>
                  <h4 className="font-bold text-gray-800 text-sm">Tailwind CSS</h4>
                  <p className="text-xs text-gray-500">Styling</p>
                </div>
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">📡</div>
                  <h4 className="font-bold text-gray-800 text-sm">Express.js</h4>
                  <p className="text-xs text-gray-500">REST API</p>
                </div>
                <div className="py-4 px-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="text-3xl mb-2">🔐</div>
                  <h4 className="font-bold text-gray-800 text-sm">JWT & bcrypt</h4>
                  <p className="text-xs text-gray-500">Authentication</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">Dikembangkan dengan arsitektur full-stack modern menggunakan MongoDB sebagai database NoSQL</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
