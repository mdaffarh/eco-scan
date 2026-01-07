import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
export async function POST(request) {
  try {
    await connectDB()

    const { name, email, password } = await request.json()

    // Validasi dasar
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Semua field harus diisi" }, { status: 400 })
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah digunakan" }, { status: 400 })
    }

    // Buat User Baru (XP dan Level otomatis default)
    const newUser = new User({
      username: name, // Mapping 'name' dari frontend ke 'username' di DB
      email,
      password: password, // (Catatan: Di production sebaiknya di-hash pakai bcrypt)
    })

    await newUser.save()

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: { email: newUser.email, name: newUser.username },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Register Error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
