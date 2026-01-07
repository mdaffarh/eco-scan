import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import WasteLog from "@/models/WasteLog"

/**
 * @route   GET /api/waste-logs
 * @desc    Get user waste logs history
 * @query   userId
 * @access  Private
 */
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "User ID diperlukan" }, { status: 400 })
    }

    // Cari sampah yang user_id-nya COCOK dengan userId yang diminta
    const logs = await WasteLog.find({ user_id: userId }).sort({ timestamp: -1 }) // Urutkan dari yang terbaru

    return NextResponse.json({ data: logs })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ message: "Gagal mengambil history" }, { status: 500 })
  }
}
