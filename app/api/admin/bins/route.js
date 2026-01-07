import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Bin from "@/models/Bin"

/**
 * @route   GET /api/admin/bins
 * @desc    Get all bins with filters
 * @query   search, fakultas
 * @access  Admin
 */
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const fakultas = searchParams.get("fakultas")

    let query = {}

    // Search filter
    if (search) {
      query.$or = [{ value: { $regex: search, $options: "i" } }, { label: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Fakultas filter
    if (fakultas) {
      query.fakultas = fakultas
    }

    const bins = await Bin.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: bins,
      count: bins.length,
    })
  } catch (error) {
    console.error("Error fetching bins:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   POST /api/admin/bins
 * @desc    Create new bin
 * @access  Admin
 */
export async function POST(request) {
  try {
    await connectDB()

    const formData = await request.formData()

    // Handle image upload first if exists
    let imageUrl = ""
    const imageFile = formData.get("image")

    if (imageFile && imageFile.size > 0) {
      // Upload image to /api/upload/bin-image
      const uploadFormData = new FormData()
      uploadFormData.append("image", imageFile)

      const uploadResponse = await fetch(`${request.nextUrl.origin}/api/upload/bin-image`, {
        method: "POST",
        body: uploadFormData,
      })

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        imageUrl = uploadResult.imageUrl
      }
    }

    const binData = {
      value: formData.get("value"),
      label: formData.get("label"),
      description: formData.get("description"),
      fakultas: formData.get("fakultas"),
      image_url: imageUrl || formData.get("image_url") || "",
    }

    // Parse bins array if it's a string
    const binsString = formData.get("bins")
    if (binsString) {
      binData.bins = typeof binsString === "string" ? JSON.parse(binsString) : binsString
    }

    const bin = await Bin.create(binData)

    return NextResponse.json(
      {
        success: true,
        data: bin,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating bin:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
