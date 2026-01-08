import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Bin from "@/models/Bin"

/**
 * @route   GET /api/admin/bins/[id]
 * @desc    Get single bin by ID
 * @access  Admin
 */
export async function GET(request, context) {
  try {
    await connectDB()

    const { id } = await context.params
    const bin = await Bin.findById(id)

    if (!bin) {
      return NextResponse.json({ success: false, error: "Bin not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error fetching bin:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   PUT /api/admin/bins/[id]
 * @desc    Update bin
 * @access  Admin
 */
export async function PUT(request, context) {
  try {
    await connectDB()

    const { id } = await context.params
    const formData = await request.formData()

    // Handle image upload if new image provided
    let imageUrl = formData.get("image_url") // Existing image URL
    const imageFile = formData.get("image")

    if (imageFile && imageFile.size > 0) {
      // Upload new image to /api/upload/bin-image
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
    }

    // Parse bins array if it's a string
    const binsString = formData.get("bins")
    if (binsString) {
      binData.bins = typeof binsString === "string" ? JSON.parse(binsString) : binsString
    }

    // Update image_url if we have one
    if (imageUrl) {
      binData.image_url = imageUrl
    }

    const bin = await Bin.findByIdAndUpdate(id, binData, { new: true, runValidators: true })

    if (!bin) {
      return NextResponse.json({ success: false, error: "Bin not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error updating bin:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   DELETE /api/admin/bins/[id]
 * @desc    Delete bin
 * @access  Admin
 */
export async function DELETE(request, context) {
  try {
    await connectDB()

    const { id } = await context.params
    const bin = await Bin.findByIdAndDelete(id)

    if (!bin) {
      return NextResponse.json({ success: false, error: "Bin not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: bin,
    })
  } catch (error) {
    console.error("Error deleting bin:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
