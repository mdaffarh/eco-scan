import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

/**
 * @route   GET /api/admin/users/[id]
 * @desc    Get single user by ID
 * @access  Admin
 */
export async function GET(request, { params }) {
  try {
    await connectDB()

    const user = await User.findById(params.id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   PUT /api/admin/users/[id]
 * @desc    Update user
 * @access  Admin
 */
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()
    const user = await User.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   DELETE /api/admin/users/[id]
 * @desc    Delete user
 * @access  Admin
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
