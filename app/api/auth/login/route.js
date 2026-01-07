import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export async function POST(request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Cari user berdasarkan email
    const user = await User.findOne({ email })

    // Cek user dan password (sederhana)
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 })
    }

    // Login Sukses -> Kirim data user ke frontend
    return NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        total_xp: user.total_xp,
        level: user.level,
        joinDate: user.joined_at,
      },
    })
  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
