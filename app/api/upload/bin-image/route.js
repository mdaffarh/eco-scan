import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

/**
 * @route   POST /api/upload/bin-image
 * @desc    Upload bin image
 * @access  Admin
 */
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image")

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only image files are allowed (jpeg, jpg, png, gif, webp)" }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.name)
    const filename = "bin-" + uniqueSuffix + ext

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "bins")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Write file
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return URL path (relative to public directory)
    const imageUrl = `/uploads/bins/${filename}`

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      filename: filename,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
