import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import WasteLog from "@/models/WasteLog"

/**
 * @route   GET /api/admin/waste-logs/[id]
 * @desc    Get single waste log by ID
 * @access  Admin
 */
export async function GET(request, { params }) {
  try {
    await connectDB()

    const wasteLog = await WasteLog.findById(params.id)

    if (!wasteLog) {
      return NextResponse.json({ success: false, error: "Waste log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error fetching waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   PUT /api/admin/waste-logs/[id]
 * @desc    Update waste log
 * @access  Admin
 */
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const body = await request.json()

    // Recalculate XP if confidence changed
    if (body.confidence && !body.xp_earned) {
      body.xp_earned = Math.round(body.confidence * 10)
    }

    const wasteLog = await WasteLog.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!wasteLog) {
      return NextResponse.json({ success: false, error: "Waste log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error updating waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   DELETE /api/admin/waste-logs/[id]
 * @desc    Delete waste log
 * @access  Admin
 */
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const wasteLog = await WasteLog.findByIdAndDelete(params.id)

    if (!wasteLog) {
      return NextResponse.json({ success: false, error: "Waste log not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: wasteLog,
    })
  } catch (error) {
    console.error("Error deleting waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
