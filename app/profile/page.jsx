"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRequireAuth } from "@/utils/authHooks"
import { logout, getUser } from "@/utils/authUtils"
import Navbar from "@/components/Navbar"

// Badge definitions (matching backend)
const BADGE_INFO = {
  first_scan: { name: "First Scan", icon: "🎯", description: "Selesaikan scan pertama" },
  scan_10: { name: "Scanner Novice", icon: "📸", description: "Selesaikan 10 scan" },
  scan_50: { name: "Scanner Expert", icon: "📷", description: "Selesaikan 50 scan" },
  scan_100: { name: "Scanner Master", icon: "🎥", description: "Selesaikan 100 scan" },
  level_5: { name: "Eco Starter", icon: "🌱", description: "Capai Level 5" },
  level_10: { name: "Eco Warrior", icon: "🌿", description: "Capai Level 10" },
  level_20: { name: "Eco Champion", icon: "🌳", description: "Capai Level 20" },
  high_confidence: { name: "Sharp Eye", icon: "👁️", description: "Confidence 95%+" },
  perfect_scan: { name: "Perfect Scanner", icon: "💯", description: "Confidence 100%" },
  waste_explorer: { name: "Waste Explorer", icon: "🗺️", description: "Scan 3 jenis sampah" },
  waste_master: { name: "Waste Master", icon: "🏆", description: "Scan 6 jenis sampah" },
  streak_7: { name: "Week Warrior", icon: "🔥", description: "Streak 7 hari" },
  streak_30: { name: "Month Master", icon: "⚡", description: "Streak 30 hari" },
  eco_hero: { name: "Eco Hero", icon: "🦸", description: "5000 total XP" },
}

export default function Profile() {
  const router = useRouter()
  const { user: authUser, isLoading: authLoading } = useRequireAuth()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([]) // State untuk riwayat
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [loadingLogs, setLoadingLogs] = useState(true)
  const [chartPeriod, setChartPeriod] = useState("year") // 'year' or 'month'
  const [mounted, setMounted] = useState(false)

  // Edit profile state
  const [isEditMode, setIsEditMode] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  // Function untuk generate chart data dari logs
  const generateChartData = logsData => {
    if (!logsData || logsData.length === 0) {
      return { year: [], month: [] }
    }

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    // Data per bulan (tahun ini)
    const monthData = Array.from({ length: 12 }, (_, i) => ({
      label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      value: 0,
    }))

    // Data per hari (bulan ini)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const dayData = Array.from({ length: daysInMonth }, (_, i) => ({
      label: String(i + 1),
      value: 0,
    }))

    // Hitung scan per bulan dan per hari
    logsData.forEach(log => {
      const logDate = new Date(log.timestamp)
      const logYear = logDate.getFullYear()
      const logMonth = logDate.getMonth()
      const logDay = logDate.getDate()

      // Tambahkan ke bulan jika tahun sama
      if (logYear === currentYear) {
        monthData[logMonth].value++
      }

      // Tambahkan ke hari jika bulan dan tahun sama
      if (logYear === currentYear && logMonth === currentMonth) {
        dayData[logDay - 1].value++
      }
    })

    return {
      year: monthData,
      month: dayData,
    }
  }

  // Dummy chart data (fallback)
  const dummyChartData = {
    year: [
      { label: "Jan", value: 5 },
      { label: "Feb", value: 8 },
      { label: "Mar", value: 12 },
      { label: "Apr", value: 7 },
      { label: "May", value: 15 },
      { label: "Jun", value: 10 },
      { label: "Jul", value: 18 },
      { label: "Aug", value: 14 },
      { label: "Sep", value: 20 },
      { label: "Oct", value: 16 },
      { label: "Nov", value: 22 },
      { label: "Dec", value: 24 },
    ],
    month: [
      { label: "1", value: 2 },
      { label: "2", value: 1 },
      { label: "3", value: 3 },
      { label: "4", value: 2 },
      { label: "5", value: 4 },
      { label: "6", value: 3 },
      { label: "7", value: 5 },
      { label: "8", value: 2 },
      { label: "9", value: 3 },
      { label: "10", value: 4 },
      { label: "11", value: 2 },
      { label: "12", value: 3 },
      { label: "13", value: 5 },
      { label: "14", value: 4 },
      { label: "15", value: 6 },
      { label: "16", value: 3 },
      { label: "17", value: 4 },
      { label: "18", value: 5 },
      { label: "19", value: 2 },
      { label: "20", value: 3 },
      { label: "21", value: 4 },
      { label: "22", value: 5 },
      { label: "23", value: 3 },
      { label: "24", value: 4 },
      { label: "25", value: 6 },
      { label: "26", value: 5 },
      { label: "27", value: 4 },
      { label: "28", value: 3 },
      { label: "29", value: 2 },
      { label: "30", value: 4 },
    ],
  }

  // Dummy statistics (will be replaced with API data)
  const dummyStats = {
    totalScans: 24,
    wasteIdentified: 18,
    level: 5,
    currentXP: 45,
    xpToNextLevel: 100,
    lastScan: "2 jam yang lalu",
    scanStats: {
      today: 3,
      thisMonth: 12,
      thisYear: 24,
    },
    chartData: dummyChartData, // Add chart data
    topWasteTypes: [
      { type: "Botol Plastik", count: 8, percentage: 33, color: "#ff9800" },
      { type: "Kertas Bekas", count: 6, percentage: 25, color: "#8d6e63" },
      { type: "Kulit Pisang", count: 4, percentage: 17, color: "#4caf50" },
    ],
    recentScans: [
      { id: 1, type: "Botol Plastik", category: "Plastik", date: "2 jam yang lalu" },
      { id: 2, type: "Kertas Bekas", category: "Kertas", date: "1 hari yang lalu" },
      { id: 3, type: "Kulit Pisang", category: "Organik", date: "2 hari yang lalu" },
      { id: 4, type: "Kaleng Minuman", category: "Anorganik", date: "3 hari yang lalu" },
    ],
  }

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Set user data from auth
  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push("/login")
      return
    }

    // Fetch fresh user data from backend
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/${userData.id}`)
        const data = await res.json()

        if (res.ok && data.user) {
          // Update user state with fresh data from backend
          const freshUserData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            xp: data.user.total_xp,
            level: data.user.level,
            badges: data.user.badges,
            joinDate: data.user.joinDate,
          }
          setUser(freshUserData)

          // Update localStorage with fresh data
          localStorage.setItem("user", JSON.stringify(freshUserData))
        } else {
          // Fallback to localStorage data
          setUser(userData)
        }
      } catch (err) {
        console.error("Gagal fetch user data:", err)
        // Fallback to localStorage data
        setUser(userData)
      }
    }

    fetchUserData()

    // [BARU] Ambil Data History dari Backend
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/waste-logs?userId=${userData.id}`)
        const data = await res.json()
        if (res.ok) {
          setLogs(data.data)
        }
      } catch (err) {
        console.error("Gagal ambil history:", err)
      } finally {
        setLoadingLogs(false)
      }
    }

    fetchHistory()
  }, [router])

  // Fetch user statistics from backend
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!authUser) return

      try {
        setIsLoadingStats(true)

        // Hitung stats dari logs yang sudah di-fetch (bahkan jika kosong)
        const calculatedStats = calculateStatsFromLogs(logs)
        setStats(calculatedStats)
      } catch (error) {
        console.error("Error calculating stats:", error)
        // Fallback: hitung dari logs kosong
        const calculatedStats = calculateStatsFromLogs([])
        setStats(calculatedStats)
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchUserStats()
  }, [logs, authUser])

  const handleLogout = () => {
    // Hapus user data dari localStorage
    logout()
    // Redirect ke welcome page
    router.push("/welcome")
  }

  const handleEditProfile = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
    })
    setIsEditMode(true)
    setEditError("")
    setEditSuccess("")
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditError("")
    setEditSuccess("")
  }

  const handleSaveProfile = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setEditError("Nama dan email tidak boleh kosong")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editForm.email)) {
      setEditError("Format email tidak valid")
      return
    }

    setIsSaving(true)
    setEditError("")

    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        // Update local user state
        const updatedUser = {
          ...user,
          name: editForm.name.trim(),
          email: editForm.email.trim(),
        }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))

        setEditSuccess("Profile berhasil diperbarui!")
        setTimeout(() => {
          setIsEditMode(false)
          setEditSuccess("")
        }, 2000)
      } else {
        setEditError(data.message || "Gagal memperbarui profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setEditError("Terjadi kesalahan saat memperbarui profile")
    } finally {
      setIsSaving(false)
    }
  }

  // Function untuk format tanggal
  const formatJoinDate = dateString => {
    if (!dateString) return "Januari 2026"

    const date = new Date(dateString)
    const options = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString("id-ID", options)
  }

  // Function untuk menghitung statistik dari logs
  const calculateStatsFromLogs = logsData => {
    // Jika logs kosong, kembalikan stats dengan nilai 0, bukan dummy
    if (!logsData || logsData.length === 0) {
      return {
        ...dummyStats,
        totalScans: 0,
        wasteIdentified: 0,
        scanStats: {
          today: 0,
          thisMonth: 0,
          thisYear: 0,
        },
        chartData: generateChartData([]),
        topWasteTypes: [],
      }
    }

    const totalScans = logsData.length

    // Hitung unique waste types (sampling untuk wasteIdentified)
    const uniqueWasteTypes = new Set(logsData.map(log => log.waste_type))
    const wasteIdentified = uniqueWasteTypes.size > 0 ? totalScans : 0

    // Hitung top waste types
    const wasteTypeCount = {}
    logsData.forEach(log => {
      wasteTypeCount[log.waste_type] = (wasteTypeCount[log.waste_type] || 0) + 1
    })

    const topWasteTypesArray = Object.entries(wasteTypeCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type, count], index) => ({
        type,
        count,
        percentage: Math.round((count / totalScans) * 100),
        color: ["#ff9800", "#8d6e63", "#4caf50"][index] || "#2196f3",
      }))

    // Hitung scan stats berdasarkan tanggal
    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const thisYear = new Date(today.getFullYear(), 0, 1)

    let todayCount = 0
    let thisMonthCount = 0
    let thisYearCount = 0

    logsData.forEach(log => {
      const logDate = new Date(log.timestamp)

      if (logDate.toDateString() === today.toDateString()) {
        todayCount++
      }
      if (logDate >= thisMonth) {
        thisMonthCount++
      }
      if (logDate >= thisYear) {
        thisYearCount++
      }
    })

    // Generate chart data
    const generatedChartData = generateChartData(logsData)

    return {
      ...dummyStats,
      totalScans,
      wasteIdentified,
      scanStats: {
        today: todayCount,
        thisMonth: thisMonthCount,
        thisYear: thisYearCount,
      },
      chartData: generatedChartData,
      topWasteTypes: topWasteTypesArray.length > 0 ? topWasteTypesArray : dummyStats.topWasteTypes,
    }
  }

  if (authLoading || isLoadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#10b981]/30 border-t-[#10b981] rounded-full animate-spin"></div>
      </div>
    )
  }

  // Calculate level and XP from user data (matching backend logic)
  const calculateLevelData = totalXP => {
    const level = Math.floor(Math.sqrt(totalXP / 50)) + 1
    const currentLevelXP = (level - 1) ** 2 * 50
    const nextLevelXP = level ** 2 * 50
    const xpInLevel = totalXP - currentLevelXP
    const xpNeeded = nextLevelXP - currentLevelXP

    return {
      level,
      currentXP: xpInLevel,
      xpToNextLevel: xpNeeded,
      totalXP,
    }
  }

  // Use real user data from backend for level/XP
  const userLevelData = user?.xp !== undefined ? calculateLevelData(user.xp) : { level: 1, currentXP: 0, xpToNextLevel: 50, totalXP: 0 }

  // Use stats from API or fallback to dummy
  const displayStats = stats
    ? { ...stats, ...userLevelData } // Merge real level data with scan stats
    : { ...dummyStats, ...userLevelData }

  if (!user || !mounted) return null
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-8">
        {/* Profile Header */}
        <div className="bg-[#1e293b] rounded-[25px] p-8 text-white mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#10b981] text-5xl font-bold shadow-lg">{user?.name?.charAt(0).toUpperCase() || "U"}</div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              {!isEditMode ? (
                <>
                  <h1 className="text-3xl font-bold mb-2">{user?.name || "User"}</h1>
                  <p className="text-white/90 text-lg mb-1">{user?.email || "email@example.com"}</p>
                  <p className="text-white/80 text-sm">Bergabung sejak {formatJoinDate(user?.joinDate)}</p>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Nama</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                      placeholder="email@example.com"
                    />
                  </div>
                  {editError && <p className="text-red-300 text-sm bg-red-500/20 px-3 py-2 rounded-lg">{editError}</p>}
                  {editSuccess && <p className="text-green-300 text-sm bg-green-500/20 px-3 py-2 rounded-lg">{editSuccess}</p>}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {!isEditMode ? (
                <>
                  <button onClick={handleEditProfile} className="bg-white text-[#10b981] px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    Edit Profile
                  </button>
                  <button onClick={handleLogout} className="bg-white/20 border-2 border-white text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-white/30">
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-white text-[#10b981] px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="bg-white/20 border-2 border-white text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Level Container - Separated */}
        <div className="bg-[#1e293b] rounded-2xl p-6 mb-6 shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🏆</div>
              <div>
                <h3 className="text-white font-bold text-xl m-0">Level {displayStats.level}</h3>
                <p className="text-white/90 text-sm m-0">Progress XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-3xl">{displayStats.currentXP} XP</div>
              <div className="text-white/80 text-sm">/ {displayStats.xpToNextLevel} XP</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${(displayStats.currentXP / displayStats.xpToNextLevel) * 100}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-white/90 text-sm">
            <span>Level {displayStats.level}</span>
            <span>Level {displayStats.level + 1}</span>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🏅</span> Koleksi Badge
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(BADGE_INFO).map(([badgeId, badge]) => {
              const isUnlocked = user?.badges?.includes(badgeId)
              return (
                <div
                  key={badgeId}
                  className={`relative rounded-xl p-4 text-center transition-all duration-300 ${
                    isUnlocked ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 hover:shadow-lg hover:-translate-y-1" : "bg-gray-50 border-2 border-gray-200 opacity-50"
                  }`}
                >
                  {/* Badge Icon */}
                  <div className={`text-5xl mb-2 ${isUnlocked ? "animate-bounce" : "grayscale"}`}>{badge.icon}</div>

                  {/* Badge Name */}
                  <h3 className={`font-bold text-sm mb-1 ${isUnlocked ? "text-gray-800" : "text-gray-400"}`}>{badge.name}</h3>

                  {/* Badge Description */}
                  <p className={`text-xs ${isUnlocked ? "text-gray-600" : "text-gray-400"}`}>{badge.description}</p>

                  {/* Lock Icon for locked badges */}
                  {!isUnlocked && <div className="absolute top-2 right-2 text-gray-400">🔒</div>}

                  {/* Shine effect for unlocked badges */}
                  {isUnlocked && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>}
                </div>
              )
            })}
          </div>

          {/* Badge Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              <span className="font-bold text-2xl text-[#10b981]">{user?.badges?.length || 0}</span>
              <span className="text-gray-500"> / {Object.keys(BADGE_INFO).length} </span>
              <span className="text-gray-600">Badge Terkumpul</span>
            </p>
          </div>
        </div>

        {/* Statistics Grid - Total Scan & Sampah Teridentifikasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-3xl font-bold text-[#10b981] mb-1">{displayStats.totalScans}</div>
            <div className="text-gray-600 text-sm font-medium">Total Scan</div>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-300">
            <div className="text-4xl mb-3">♻️</div>
            <div className="text-3xl font-bold text-[#4caf50] mb-1">{displayStats.wasteIdentified}</div>
            <div className="text-gray-600 text-sm font-medium">Sampah Teridentifikasi</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[25px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.1)] mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📜</span> Riwayat Sampah
          </h2>

          {loadingLogs ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-[#10b981]/30 border-t-[#10b981] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Sedang memuat riwayat...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🍃</div>
              <p className="text-gray-600 font-semibold mb-2">Belum ada sampah yang discan.</p>
              <p className="text-sm text-gray-400">Yuk scan sampahmu sekarang!</p>
              <Link href="/scan" className="inline-block mt-6 bg-[#10b981] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-[#059669]">
                Scan Sampah Baru
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {/* Looping data logs untuk ditampilkan */}
                {logs.map(log => (
                  <div key={log._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md hover:border-[#10b981]/30 transition-all">
                    <div className="flex items-center gap-4">
                      {/* Ikon berdasarkan jenis sampah */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm
                        ${log.waste_type === "Plastik" ? "bg-orange-100 text-orange-600" : log.waste_type === "Organik" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {log.waste_type === "Plastik" ? "🥤" : log.waste_type === "Organik" ? "🍂" : "♻️"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{log.waste_type?.includes("Botol Plasti") ? "Botol Plastik" : log.waste_type}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          • {log.fakultas}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#10b981]">{Math.round(log.confidence * 100)}%</span>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Akurasi</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4 border-t border-gray-100">
                <Link href="/scan" className="inline-block bg-[#10b981] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:bg-[#059669]">
                  Scan Sampah Baru
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Scan Statistics per Period */}
          <div className="bg-white rounded-[25px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistik Scan</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#10b981]/10 to-[#1e3a8a]/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white text-lg">📅</div>
                  <span className="font-semibold text-gray-700">Hari Ini</span>
                </div>
                <span className="text-2xl font-bold text-[#10b981]">{displayStats.scanStats.today}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#10b981]/10 to-[#1e3a8a]/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white text-lg">📆</div>
                  <span className="font-semibold text-gray-700">Bulan Ini</span>
                </div>
                <span className="text-2xl font-bold text-[#10b981]">{displayStats.scanStats.thisMonth}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#10b981]/10 to-[#1e3a8a]/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white text-lg">🗓️</div>
                  <span className="font-semibold text-gray-700">Tahun Ini</span>
                </div>
                <span className="text-2xl font-bold text-[#10b981]">{displayStats.scanStats.thisYear}</span>
              </div>
            </div>
          </div>
          {/* Top 3 Waste Types */}
          <div className="bg-white rounded-[25px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 3 Sampah</h2>

            <div className="space-y-4">
              {displayStats.topWasteTypes.map((waste, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: waste.color }}>
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-700">{waste.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-800">{waste.count}x</span>
                      <span className="text-sm text-gray-500 ml-2">({waste.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${waste.percentage}%`,
                        backgroundColor: waste.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line Chart - Separate Container */}
        <div className="bg-white rounded-[25px] p-8 shadow-[0_4px_15px_rgba(0,0,0,0.1)] mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Grafik Scan</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartPeriod("month")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${chartPeriod === "month" ? "bg-[#10b981] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Bulanan
              </button>
              <button
                onClick={() => setChartPeriod("year")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${chartPeriod === "year" ? "bg-[#10b981] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Tahunan
              </button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-64 bg-[#f8f9ff] rounded-xl p-4">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#e5e7eb" strokeWidth="1" />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={(() => {
                  const data = displayStats.chartData[chartPeriod]
                  const maxValue = Math.max(...data.map(d => d.value)) || 1
                  const stepX = 800 / (data.length - 1 || 1)
                  return data
                    .map((point, index) => {
                      const x = index * stepX
                      const y = 200 - (point.value / maxValue) * 170 - 10
                      return `${x},${y}`
                    })
                    .join(" ")
                })()}
              />

              {/* Area fill */}
              <polygon
                fill="url(#areaGradient)"
                points={(() => {
                  const data = displayStats.chartData[chartPeriod]
                  const maxValue = Math.max(...data.map(d => d.value)) || 1
                  const stepX = 800 / (data.length - 1 || 1)
                  const points = data.map((point, index) => {
                    const x = index * stepX
                    const y = 200 - (point.value / maxValue) * 170 - 10
                    return `${x},${y}`
                  })
                  return `0,200 ${points.join(" ")} 800,200`
                })()}
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {displayStats.chartData[chartPeriod]
                .filter((_, index) => {
                  if (chartPeriod === "year") return true
                  return index % 5 === 0 || index === displayStats.chartData[chartPeriod].length - 1
                })
                .map((point, index) => (
                  <span key={index}>{point.label}</span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
