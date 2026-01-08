"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { setUser } from "@/utils/authUtils"
import { Spinner } from "@/components/ui/spinner"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError("")

    // Validasi input
    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi!")
      return
    }

    setIsLoading(true)

    try {
      // Panggil API Backend Login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login gagal")
      }

      // Simpan user data ASLI dari Database ke localStorage
      // Fungsi setUser ada di utils/authUtils.js
      setUser({
        id: data.user._id || data.user.id, // Tambahkan ID dari database
        email: data.user.email,
        name: data.user.name,
        level: data.user.level, // Load Level dari DB
        xp: data.user.total_xp, // Load XP dari DB
        joinDate: data.user.joinDate,
      })

      // Redirect ke home
      router.push("/home")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10b981] to-[#1e3a8a] flex items-center justify-center px-5 py-10">
      <div className="bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] max-w-md w-full p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Selamat Datang</h1>
          <p className="text-gray-600 text-base">Masuk ke akun EcoScan Anda</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/20"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2 text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/20"
              disabled={isLoading}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-[#10b981] text-sm font-medium hover:underline">
              Lupa password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold text-lg py-3.5 rounded-full transition-all duration-300 hover:enabled:shadow-[0_6px_20px_rgba(16,185,129,0.4)] hover:enabled:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="text-white" />
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm font-medium">ATAU</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#10b981] font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Back to Welcome */}
        <div className="text-center mt-6">
          <Link href="/welcome" className="text-gray-500 text-sm hover:text-gray-700 hover:underline">
            ← Kembali ke halaman awal
          </Link>
        </div>
      </div>
    </div>
  )
}
