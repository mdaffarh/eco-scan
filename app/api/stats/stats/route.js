import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import WasteLog from "@/models/WasteLog"
import User from "@/models/User"
import Bin from "@/models/Bin"

/**
 * @route   GET /api/stats/stats
 * @desc    Get comprehensive dashboard statistics
 * @query   timeFilter - 'today' | 'week' | 'month' | 'all'
 * @access  Admin
 */
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const timeFilter = searchParams.get("timeFilter")

    // Calculate date range based on filter
    let dateFilter = {}
    const now = new Date()

    if (timeFilter === "today") {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      dateFilter = { timestamp: { $gte: startOfDay } }
    } else if (timeFilter === "week") {
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - 7)
      dateFilter = { timestamp: { $gte: startOfWeek } }
    } else if (timeFilter === "month") {
      const startOfMonth = new Date()
      startOfMonth.setDate(startOfMonth.getDate() - 30)
      dateFilter = { timestamp: { $gte: startOfMonth } }
    }
    // 'all' or no filter = no date restriction

    // Get counts with date filter
    const totalScans = await WasteLog.countDocuments(dateFilter)
    const totalUsers = await User.countDocuments()

    // Get total XP using aggregation
    const xpResult = await User.aggregate([
      {
        $group: {
          _id: null,
          totalXP: { $sum: "$total_xp" },
        },
      },
    ])
    const totalXP = xpResult.length > 0 ? xpResult[0].totalXP : 0

    // Get average level using aggregation
    const avgLevelResult = await User.aggregate([
      {
        $group: {
          _id: null,
          avgLevel: { $avg: "$level" },
        },
      },
    ])
    const avgLevel = avgLevelResult.length > 0 ? avgLevelResult[0].avgLevel : 0

    // Get waste type distribution using aggregation with date filter
    const wasteTypeDistribution = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      {
        $group: {
          _id: "$waste_type",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get fakultas distribution using aggregation with date filter
    const fakultasDistribution = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      {
        $group: {
          _id: "$fakultas",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get daily scans for the last 7 days using aggregation
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)

    const dailyScans = await WasteLog.aggregate([
      {
        $match: {
          timestamp: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get top users by total XP using aggregation
    const topUsers = await User.aggregate([
      {
        $sort: { total_xp: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          username: 1,
          total_xp: 1,
          level: 1,
          _id: 0,
        },
      },
    ])

    // Get average confidence score using aggregation with date filter
    const avgConfidenceResult = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$confidence" },
        },
      },
    ])
    const avgConfidence = avgConfidenceResult.length > 0 ? avgConfidenceResult[0].avgConfidence : 0

    // Get scans by hour (24-hour distribution) using aggregation
    const scansByHour = await WasteLog.aggregate([
      ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Get recent activities (last 10 logs with user info)
    const recentLogs = await WasteLog.find(dateFilter).sort({ timestamp: -1 }).limit(10)

    // Get user info for recent logs
    const userIds = [...new Set(recentLogs.map(log => log.user_id))]
    const users = await User.find({ _id: { $in: userIds } })
    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]))

    const recentActivities = recentLogs.map(log => ({
      ...log.toObject(),
      username: userMap[log.user_id]?.username || "Unknown User",
    }))

    // ========== BIN DISTRIBUTION ANALYTICS ==========

    // Get total bins count
    const totalBins = await Bin.countDocuments()

    // Get bin locations by faculty using aggregation
    const binsByFakultas = await Bin.aggregate([
      {
        $group: {
          _id: "$fakultas",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get bin types distribution (unwind bins array and count each type)
    const binTypesDistribution = await Bin.aggregate([
      {
        $unwind: "$bins",
      },
      {
        $group: {
          _id: "$bins",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Get bin types per faculty (fakultas vs bin types matrix)
    const binTypesPerFakultas = await Bin.aggregate([
      {
        $unwind: "$bins",
      },
      {
        $group: {
          _id: {
            fakultas: "$fakultas",
            binType: "$bins",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.fakultas",
          binTypes: {
            $push: {
              type: "$_id.binType",
              count: "$count",
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    return NextResponse.json(
      {
        success: true,
        data: {
          stats: {
            totalScans,
            totalUsers,
            totalXP,
            avgLevel,
            avgConfidence,
            totalBins,
          },
          wasteTypeDistribution,
          fakultasDistribution,
          dailyScans,
          topUsers,
          scansByHour,
          recentActivities,
          binsByFakultas,
          binTypesDistribution,
          binTypesPerFakultas,
          timeFilter: timeFilter || "all",
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    )
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
