import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Bin from "@/models/Bin"

/**
 * @route   GET /api/admin/bins/by-value/[value]
 * @desc    Get bin by value (location ID)
 * @access  Admin
 */
export async function GET(request, { params }) {
  try {
    await connectDB()

    const bin = await Bin.findOne({ value: params.value })

    if (!bin) {
      return NextResponse.json({ success: false, error: "Bin location not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error fetching bin by value:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
