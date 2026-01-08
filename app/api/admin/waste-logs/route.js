import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import WasteLog from "@/models/WasteLog"

/**
 * @route   GET /api/admin/waste-logs
 * @desc    Get all waste logs with filters
 * @query   search, waste_type, fakultas, user_id
 * @access  Admin
 */
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const waste_type = searchParams.get("waste_type")
    const fakultas = searchParams.get("fakultas")
    const user_id = searchParams.get("user_id")

    let query = {}

    // Search filter
    if (search) {
      query.$or = [{ waste_type: { $regex: search, $options: "i" } }, { fakultas: { $regex: search, $options: "i" } }, { lokasi_id: { $regex: search, $options: "i" } }]
    }

    // Waste type filter
    if (waste_type) {
      query.waste_type = waste_type
    }

    // Fakultas filter
    if (fakultas) {
      query.fakultas = fakultas
    }

    // User filter
    if (user_id) {
      query.user_id = user_id
    }

    const wasteLogs = await WasteLog.find(query).sort({ timestamp: -1 })

    return NextResponse.json({
      success: true,
      data: wasteLogs,
      count: wasteLogs.length,
    })
  } catch (error) {
    console.error("Error fetching waste logs:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * @route   POST /api/admin/waste-logs
 * @desc    Create new waste log
 * @access  Admin
 */
export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const confidence = body.confidence != null ? Number(body.confidence) : undefined
    body.confidence = confidence

    // Normalize waste_type untuk handle label yang terpotong
    if (body.waste_type && body.waste_type.includes("Botol Plasti")) {
      body.waste_type = "Botol Plastik"
    }

    // Calculate XP based on confidence if not provided
    if (!body.xp_earned) {
      if (confidence != null && !Number.isNaN(confidence)) {
        body.xp_earned = Math.round(body.confidence * 10)
      } else {
        body.xp_earned = 0
      }
    } else {
      body.xp_earned = Number(body.xp_earned)
    }

    const wasteLog = await WasteLog.create(body)

    // Update user XP, level, and badges if user_id is provided
    if (body.user_id) {
      const User = require("@/models/User").default
      const { calculateLevel, checkNewBadges } = require("@/lib/gamification")

      const user = await User.findById(body.user_id)
      if (user) {
        // Update XP and level
        user.total_xp += body.xp_earned
        const newLevel = calculateLevel(user.total_xp)
        user.level = newLevel

        // Check for new badges
        const scanCount = await WasteLog.countDocuments({ user_id: body.user_id })
        const uniqueTypes = await WasteLog.distinct("waste_type", { user_id: body.user_id })
        
        // Build user stats object for badge checking
        const userStats = {
          totalScans: scanCount,
          level: newLevel,
          highestConfidence: body.confidence || 0,
          wasteTypesScanned: uniqueTypes.length,
          streak: user.streak || 0,
          totalXP: user.total_xp,
        }
        
        // Get current badges array, default to empty array if not set
        const currentBadges = Array.isArray(user.badges) ? user.badges : []
        const newBadges = checkNewBadges(userStats, currentBadges)

        // Add new badges
        if (newBadges.length > 0) {
          newBadges.forEach(badge => {
            if (!user.badges.includes(badge)) {
              user.badges.push(badge)
            }
          })
        }

        await user.save()
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: wasteLog,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating waste log:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
