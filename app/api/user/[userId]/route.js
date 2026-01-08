import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

/**
 * @route   GET /api/user/[userId]
 * @desc    Get user profile by ID
 * @access  Private
 */
export async function GET(request, context) {
  try {
    await connectDB()

    const { userId } = await context.params

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
    }

    // Return user data
    return NextResponse.json({
      message: "User data fetched successfully",
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        total_xp: user.total_xp,
        level: user.level,
        badges: user.badges,
        joinDate: user.joined_at,
      },
    })
  } catch (error) {
    console.error("Get User Error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}

/**
 * @route   PUT /api/user/[userId]
 * @desc    Update user profile
 * @access  Private
 */
export async function PUT(request, context) {
  try {
    await connectDB()

    const { userId } = await context.params
    const { name, email } = await request.json()

    // Validasi input
    if (!name || !email) {
      return NextResponse.json({ message: "Nama dan email harus diisi" }, { status: 400 })
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 })
    }

    // Cek apakah email sudah digunakan user lain
    const existingUser = await User.findOne({ email, _id: { $ne: userId } })
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah digunakan oleh user lain" }, { status: 400 })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: name,
        email: email,
      },
      { new: true } // Return updated document
    )

    if (!updatedUser) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Profile berhasil diperbarui",
      user: {
        id: updatedUser._id,
        name: updatedUser.username,
        email: updatedUser.email,
        total_xp: updatedUser.total_xp,
        level: updatedUser.level,
        badges: updatedUser.badges,
        joinDate: updatedUser.joined_at,
      },
    })
  } catch (error) {
    console.error("Update User Error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  }
}
