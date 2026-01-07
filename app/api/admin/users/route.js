import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with optional search filter
 * @query   search - Search term for username or email
 * @access  Admin
 */
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let query = {}
    if (search) {
      query = {
        $or: [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      }
    }

    const users = await User.find(query).sort({ joined_at: -1 })

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   POST /api/admin/users
 * @desc    Create new user
 * @access  Admin
 */
export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const user = await User.create(body)

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
