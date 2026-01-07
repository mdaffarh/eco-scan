"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useLocation } from "@/context/LocationContext"
import { FAKULTAS_OPTIONS, mapWasteTypeToBin, findLocationsWithBin, findLocationsWithFallback, getFallbackBin, binMatches } from "@/utils/locationConfig"
import Navbar from "@/components/Navbar"
import { getUser } from "@/utils/authUtils"

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

export default function Result() {
  const router = useRouter()
  const { selectedFakultas } = useLocation()

  // Get data dari sessionStorage (dari Scan page)
  const [result, setResult] = useState(null)

  // Bins data from backend
  const [binsData, setBinsData] = useState([])
  const [isLoadingBins, setIsLoadingBins] = useState(true)

  // XP & Level state
  const [xpEarned, setXpEarned] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentXP, setCurrentXP] = useState(0)
  const [xpToNextLevel, setXpToNextLevel] = useState(100)
  const [leveledUp, setLeveledUp] = useState(false)
  const [newBadges, setNewBadges] = useState([])
  const [showRewards, setShowRewards] = useState(true)

  // Fetch bins data from backend
  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await fetch("/api/admin/bins")
        if (response.ok) {
          const result = await response.json()
          // API returns { success: true, data: [...], count: ... }
          setBinsData(result.data || [])
        }
      } catch (error) {
        console.error("Error fetching bins:", error)
        setBinsData([]) // Set empty array on error
      } finally {
        setIsLoadingBins(false)
      }
    }

    fetchBins()
  }, [])

  useEffect(() => {
    const storedData = sessionStorage.getItem("scanResult")
    const gamificationData = sessionStorage.getItem("gamificationData")

    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setResult(parsedData)

      // Load gamification data from backend response
      if (gamificationData) {
        const gameData = JSON.parse(gamificationData)

        console.log("✅ Gamification data from backend:", gameData)

        setXpEarned(gameData.xpEarned || 0)
        setCurrentLevel(gameData.newLevel || 1)
        setLeveledUp(gameData.leveledUp || false)
        setNewBadges(gameData.newBadges || [])

        // Calculate XP progress in current level
        const currentLevelXP = (gameData.newLevel - 1) ** 2 * 50
        const nextLevelXP = gameData.newLevel ** 2 * 50
        const xpInLevel = gameData.newTotalXP - currentLevelXP
        const xpNeeded = nextLevelXP - currentLevelXP

        setCurrentXP(xpInLevel)
        setXpToNextLevel(xpNeeded)

        // Clear gamification data after reading
        sessionStorage.removeItem("gamificationData")
      } else {
        // Fallback: Use backend formula based on confidence
        console.warn("⚠️ Gamification data not found, using fallback calculation")

        // Match backend formula: confidence-based XP (10-25 range)
        const confidence = parsedData.confidence / 100 // Convert to 0-1 range
        let calculatedXP

        if (confidence >= 0.9) {
          calculatedXP = Math.floor(Math.random() * 6) + 20 // 20-25 XP
        } else if (confidence >= 0.7) {
          calculatedXP = Math.floor(Math.random() * 6) + 15 // 15-20 XP
        } else if (confidence >= 0.5) {
          calculatedXP = Math.floor(Math.random() * 6) + 10 // 10-15 XP
        } else {
          calculatedXP = 10 // Base 10 XP
        }

        setXpEarned(calculatedXP)
      }
    } else {
      // Redirect ke home jika tidak ada data (refresh page)
      router.push("/home")
    }
  }, [router])

  // State untuk accordion (track which fakultas/location is expanded)
  const [expandedFakultas, setExpandedFakultas] = useState({})
  const [expandedLocationImages, setExpandedLocationImages] = useState({})

  const fakultasLabel = selectedFakultas ? FAKULTAS_OPTIONS.find(f => f.value === selectedFakultas)?.label : ""

  // Helper functions untuk mengolah data dari backend
  const findLocationsFromBackend = (fakultas, targetBin) => {
    if (!binsData || binsData.length === 0) return []

    return binsData.filter(bin => bin.fakultas === fakultas && bin.bins.some(b => binMatches(b, targetBin)))
  }

  const findFallbackLocationsFromBackend = (fakultas, fallbackBin) => {
    if (!binsData || binsData.length === 0 || !fallbackBin) return []

    return binsData.filter(bin => bin.fakultas === fakultas && bin.bins.some(b => binMatches(b, fallbackBin)))
  }

  const getAllLocationsWithBinFromBackend = targetBin => {
    if (!binsData || binsData.length === 0) return {}

    const locationsByFakultas = {}

    binsData.forEach(bin => {
      if (bin.bins.some(b => binMatches(b, targetBin))) {
        if (!locationsByFakultas[bin.fakultas]) {
          locationsByFakultas[bin.fakultas] = []
        }
        locationsByFakultas[bin.fakultas].push(bin)
      }
    })

    return locationsByFakultas
  }

  // Map waste type ke bin category
  const targetBin = result ? mapWasteTypeToBin(result.waste_type) : ""
  const fallbackBin = result ? getFallbackBin(result.waste_type) : null

  // Cari lokasi menggunakan data dari backend
  const primaryLocations = selectedFakultas && targetBin && !isLoadingBins ? findLocationsFromBackend(selectedFakultas, targetBin) : []

  const fallbackLocations = selectedFakultas && fallbackBin && !isLoadingBins && primaryLocations.length === 0 ? findFallbackLocationsFromBackend(selectedFakultas, fallbackBin) : []

  const locationResult = {
    hasPrimary: primaryLocations.length > 0,
    hasFallback: fallbackLocations.length > 0,
    primaryLocations: primaryLocations,
    fallbackLocations: fallbackLocations,
    fallbackBin: fallbackBin,
  }

  // Debug logging
  console.log("Debug Info:", {
    fakultas: selectedFakultas,
    waste_type: result?.waste_type,
    targetBin,
    fallbackBin,
    locationResult,
    binsData,
    isLoadingBins,
  })

  // Cari semua lokasi di fakultas lain yang punya bin spesifik
  const allLocationsWithBin = targetBin && !isLoadingBins ? getAllLocationsWithBinFromBackend(targetBin) : {}

  // Check kondisi
  const hasPrimaryBin = locationResult.hasPrimary
  const hasFallbackOnly = !locationResult.hasPrimary && locationResult.hasFallback
  const hasNoBin = !locationResult.hasPrimary && !locationResult.hasFallback

  // Toggle accordion
  const toggleFakultas = fakultasKey => {
    setExpandedFakultas(prev => ({
      ...prev,
      [fakultasKey]: !prev[fakultasKey],
    }))
  }

  // Toggle location image dropdown
  const toggleLocationImage = locationKey => {
    setExpandedLocationImages(prev => ({
      ...prev,
      [locationKey]: !prev[locationKey],
    }))
  }

  if (!result) {
    return null
  }

  // Show loading state while fetching bins
  if (isLoadingBins) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-5 py-5 min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#10b981] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Memuat data lokasi...</p>
          </div>
        </div>
      </>
    )
  }

  const getColorByCategory = category => {
    const colors = {
      Organik: "#4caf50",
      Anorganik: "#2196f3",
      Plastik: "#ff9800",
      "Botol Plastik": "#ffa726",
      Kertas: "#8d6e63",
      Residu: "#757575",
    }
    return colors[category] || "#10b981"
  }

  const getCategoryIcon = category => {
    const icons = {
      Organik: "🌿",
      "Non Organik": "♻️",
      "Daur Ulang": "♻️",
      Residu: "🗑️",
      "Botol Plastik": "♻️",
      Anorganik: "♻️",
      Kertas: "📄",
      Plastik: "♻️",
    }

    // Jika tidak ditemukan, coba trim whitespace
    const trimmedCategory = category?.trim()
    return icons[category] || icons[trimmedCategory] || "📦"
  }

  const xpPercentage = (currentXP / xpToNextLevel) * 100

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 py-5 min-h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-gray-800 font-bold">Hasil Identifikasi</h1>

          {/* Fakultas Info */}
          {fakultasLabel && (
            <div className="inline-flex items-center gap-2 bg-[#1e293b] text-white py-2.5 px-6 rounded-full text-base font-medium mt-4 shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
              <span className="text-xl">🏛️</span>
              <span className="font-semibold">{fakultasLabel}</span>
            </div>
          )}
        </div>

        {/* XP Notification Card */}
        <div className="bg-[#1e293b] rounded-2xl p-6 mb-6 shadow-[0_8px_20px_rgba(0,0,0,0.3)] animate-[slideInDown_0.5s_ease-out]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl animate-[bounce_1s_ease-in-out_3]">⭐</div>
              <div>
                <h3 className="text-white font-bold text-xl m-0">Scan Berhasil!</h3>
                <p className="text-white/90 text-sm m-0">Kamu mendapatkan XP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-3xl">+{xpEarned} XP</div>
              <div className="text-white/80 text-sm">Level {currentLevel}</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: `${xpPercentage}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-white/90 text-sm">
            <span>{currentXP} XP</span>
            <span>{xpToNextLevel} XP</span>
          </div>
        </div>

        {/* Rewards Section - Level Up & New Badges */}
        {showRewards && (leveledUp || (newBadges && newBadges.length > 0)) && (
          <div className="mb-6 space-y-4">
            {/* Level Up Celebration */}
            {leveledUp && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-xl animate-[bounceIn_0.6s_ease-out] relative overflow-hidden">
                <div className="absolute top-0 right-0 text-9xl opacity-10">🎉</div>
                <div className="relative z-10">
                  <div className="text-center">
                    <div className="text-6xl mb-3 animate-[spin_2s_ease-in-out]">⬆️</div>
                    <h2 className="text-white font-bold text-3xl mb-2">LEVEL UP!</h2>
                    <p className="text-white/90 text-xl">Selamat! Kamu naik ke Level {currentLevel}</p>
                  </div>
                </div>
              </div>
            )}

            {/* New Badges Earned */}
            {newBadges && newBadges.length > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl animate-[slideInRight_0.6s_ease-out]">
                <h3 className="text-white font-bold text-2xl mb-4 text-center">🏅 Badge Baru Didapat!</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newBadges.map((badgeId, index) => {
                    const badge = BADGE_INFO[badgeId]
                    if (!badge) return null
                    return (
                      <div key={badgeId} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 animate-[bounceIn_0.5s_ease-out]" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="text-4xl">{badge.icon}</div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{badge.name}</h4>
                          <p className="text-white/80 text-sm">{badge.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button onClick={() => setShowRewards(false)} className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                  Tutup
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-[20px] p-10 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          {/* Image Section */}
          <div className="w-full max-h-[400px] rounded-2xl overflow-hidden mb-8 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
            <img src={result.image} alt="Scanned waste" className="w-full h-full object-contain block" />
          </div>

          {/* Result Info */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2.5 py-3 px-8 rounded-full text-white font-semibold text-lg mb-5 shadow-[0_4px_10px_rgba(0,0,0,0.2)]" style={{ backgroundColor: getColorByCategory(result.category) }}>
              <span className="text-2xl">{getCategoryIcon(result.category)}</span>
              <span>{result.category}</span>
            </div>

            <h2 className="text-3xl md:text-4xl text-gray-800 mb-8 font-bold break-words px-2">
              {/* Normalize waste_type untuk handle label yang terpotong */}
              {result.waste_type?.includes("Botol Plasti") ? "Botol Plastik" : result.waste_type}
            </h2>

            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between mb-2.5 text-base text-gray-600">
                <span>Tingkat Kepercayaan</span>
                <span className="font-bold text-[#10b981] text-xl">{result.confidence}%</span>
              </div>
              <div className="w-full h-8 bg-gray-300 rounded-2xl overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#10b981] to-[#1e3a8a] transition-all duration-1000 flex items-center justify-end pr-2.5 text-white font-bold" style={{ width: `${result.confidence}%` }}></div>
              </div>
            </div>
          </div>

          {/* Kondisi 1: Fakultas user PUNYA tempat sampah SPESIFIK */}
          {hasPrimaryBin && (
            <div className="bg-[#e8f5e9] border-l-[5px] border-[#4caf50] py-6 px-6 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✅</span>
                <h3 className="text-2xl text-gray-800 m-0">Tempat Pembuangan Tersedia di {fakultasLabel}</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed m-0 font-medium mb-4">
                Buang sampah <strong>{result.waste_type?.includes("Botol Plasti") ? "Botol Plastik" : result.waste_type}</strong> ke tempat sampah <strong>{targetBin}</strong> yang tersedia di lokasi berikut:
              </p>

              <div className="mt-5 flex flex-col gap-4">
                {locationResult.primaryLocations.map((lokasi, index) => {
                  const locationKey = `primary-${index}`
                  const isImageExpanded = expandedLocationImages[locationKey]

                  return (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-5 transition-all duration-300 hover:border-[#10b981] hover:shadow-[0_4px_12px_rgba(16,185,129,0.15)]">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl mt-0.5">📍</span>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 my-0 mb-1">{lokasi.label}</h4>
                          <p className="text-sm text-gray-600 m-0">{lokasi.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Tempat sampah:</span>
                        <div className="flex flex-wrap gap-2">
                          {lokasi.bins.map((bin, binIndex) => (
                            <span
                              key={binIndex}
                              className={`py-1.5 px-3.5 rounded-2xl text-sm font-medium border ${
                                binMatches(bin, targetBin) ? "bg-[#4caf50] text-white border-[#4caf50] font-semibold shadow-[0_2px_8px_rgba(76,175,80,0.3)]" : "bg-[#e3f2fd] text-[#1976d2] border-[#bbdefb]"
                              }`}
                            >
                              {bin}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Image Dropdown */}
                      {lokasi.image_url && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button onClick={() => toggleLocationImage(locationKey)} className="flex items-center justify-between w-full py-2 px-3 bg-[#f8f9ff] rounded-lg hover:bg-[#e8eaf6] transition-colors duration-200">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <span>📷</span>
                              Lihat Foto Lokasi
                            </span>
                            <span className={`text-xs text-[#10b981] transition-transform duration-300 ${isImageExpanded ? "rotate-180" : ""}`}>▼</span>
                          </button>
                          {isImageExpanded && (
                            <div className="mt-3 rounded-lg overflow-hidden animate-[slideDown_0.3s_ease]">
                              <img
                                src={lokasi.image_url}
                                alt={`Foto lokasi ${lokasi.label}`}
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                                onError={e => {
                                  e.target.style.display = "none"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Kondisi 1.5: Fakultas user TIDAK PUNYA tempat spesifik tapi PUNYA FALLBACK */}
          {hasFallbackOnly && (
            <>
              {/* Tampilkan Fallback Option */}
              <div className="bg-[#e3f2fd] border-l-[5px] border-[#2196f3] py-6 px-6 rounded-xl mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">ℹ️</span>
                  <h3 className="text-2xl text-gray-800 m-0">Alternatif Pembuangan di {fakultasLabel}</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed m-0 font-medium">
                  Tempat sampah khusus <strong>{targetBin}</strong> tidak tersedia di {fakultasLabel}, tetapi Anda dapat membuang sampah <strong>{result.waste_type?.includes("Botol Plasti") ? "Botol Plastik" : result.waste_type}</strong> ke
                  tempat sampah <strong>{locationResult.fallbackBin}</strong> sebagai alternatif.
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {locationResult.fallbackLocations.map((lokasi, index) => {
                  const locationKey = `fallback-${index}`
                  const isImageExpanded = expandedLocationImages[locationKey]

                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:border-[#2196f3] hover:shadow-md">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-xl mt-0.5">📍</span>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-800 my-0 mb-1">{lokasi.label}</h4>
                          <p className="text-sm text-gray-600 m-0">{lokasi.description}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Tempat sampah:</span>
                        <div className="flex flex-wrap gap-2">
                          {lokasi.bins.map((bin, binIndex) => (
                            <span
                              key={binIndex}
                              className={`py-1.5 px-3.5 rounded-2xl text-sm font-medium border ${
                                binMatches(bin, locationResult.fallbackBin) ? "bg-[#2196f3] text-white border-[#2196f3] font-semibold shadow-[0_2px_8px_rgba(33,150,243,0.3)]" : "bg-[#e3f2fd] text-[#1976d2] border-[#bbdefb]"
                              }`}
                            >
                              {bin}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Image Dropdown */}
                      {lokasi.image_url && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button onClick={() => toggleLocationImage(locationKey)} className="flex items-center justify-between w-full py-2 px-3 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <span>📷</span>
                              Lihat Foto Lokasi
                            </span>
                            <span className={`text-xs text-[#2196f3] transition-transform duration-300 ${isImageExpanded ? "rotate-180" : ""}`}>▼</span>
                          </button>
                          {isImageExpanded && (
                            <div className="mt-3 rounded-lg overflow-hidden animate-[slideDown_0.3s_ease]">
                              <img
                                src={lokasi.image_url}
                                alt={`Foto lokasi ${lokasi.label}`}
                                className="w-full h-auto object-cover rounded-lg shadow-md"
                                onError={e => {
                                  e.target.style.display = "none"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Tampilkan Rekomendasi Lokasi dengan Tempat Sampah Spesifik */}
              {Object.keys(allLocationsWithBin).length > 0 && (
                <>
                  <div className="bg-[#f3e5f5] border-l-[5px] border-[#9c27b0] py-6 px-6 rounded-xl mt-5 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">⭐</span>
                      <h3 className="text-2xl text-gray-800 m-0">Rekomendasi Tempat Sampah Khusus {targetBin}</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed m-0">
                      Untuk hasil yang lebih optimal, berikut lokasi yang menyediakan tempat sampah khusus <strong>{targetBin}</strong>:
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 mb-6">
                    {Object.keys(allLocationsWithBin).map(fakultasKey => {
                      const fakultasInfo = FAKULTAS_OPTIONS.find(f => f.value === fakultasKey)
                      const locations = allLocationsWithBin[fakultasKey]
                      const isExpanded = expandedFakultas[fakultasKey]

                      return (
                        <div key={fakultasKey} className="border-none">
                          {/* Header Fakultas */}
                          <div className="flex justify-between items-center py-3 px-4 cursor-pointer bg-[#f3e5f5] rounded-lg transition-colors duration-300 hover:bg-[#e1bee7] mb-3" onClick={() => toggleFakultas(fakultasKey)}>
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">🏛️</span>
                              <span className="font-semibold text-base text-gray-800">{fakultasInfo?.label || fakultasKey}</span>
                              <span className="text-sm text-gray-600 font-medium">({locations.length} lokasi)</span>
                            </div>
                            <span className={`text-sm text-[#9c27b0] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                          </div>

                          {/* Location Cards - No nested cards */}
                          {isExpanded && (
                            <div className="flex flex-col gap-3 animate-[slideDown_0.3s_ease] pl-2">
                              {locations.map((lokasi, index) => {
                                const locationKey = `recom-${fakultasKey}-${index}`
                                const isImageExpanded = expandedLocationImages[locationKey]

                                return (
                                  <div key={index} className="bg-white/80 border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:border-[#9c27b0] hover:shadow-md">
                                    <div className="flex items-start gap-3 mb-3">
                                      <span className="text-xl mt-0.5">📍</span>
                                      <div className="flex-1">
                                        <h4 className="text-base font-semibold text-gray-800 my-0 mb-1">{lokasi.label}</h4>
                                        <p className="text-sm text-gray-600 m-0">{lokasi.description}</p>
                                      </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <span className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Tempat sampah:</span>
                                      <div className="flex flex-wrap gap-2">
                                        {lokasi.bins.map((bin, binIndex) => (
                                          <span
                                            key={binIndex}
                                            className={`py-1.5 px-3.5 rounded-2xl text-sm font-medium border ${
                                              binMatches(bin, targetBin) ? "bg-[#4caf50] text-white border-[#4caf50] font-semibold shadow-[0_2px_8px_rgba(76,175,80,0.3)]" : "bg-[#e3f2fd] text-[#1976d2] border-[#bbdefb]"
                                            }`}
                                          >
                                            {bin}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Image Dropdown */}
                                    {lokasi.image_url && (
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <button onClick={() => toggleLocationImage(locationKey)} className="flex items-center justify-between w-full py-2 px-3 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <span>📷</span>
                                            Lihat Foto Lokasi
                                          </span>
                                          <span className={`text-xs text-[#9c27b0] transition-transform duration-300 ${isImageExpanded ? "rotate-180" : ""}`}>▼</span>
                                        </button>
                                        {isImageExpanded && (
                                          <div className="mt-3 rounded-lg overflow-hidden animate-[slideDown_0.3s_ease]">
                                            <img
                                              src={lokasi.image_url}
                                              alt={`Foto lokasi ${lokasi.label}`}
                                              className="w-full h-auto object-cover rounded-lg shadow-md"
                                              onError={e => {
                                                e.target.style.display = "none"
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* Kondisi 2: Fakultas user TIDAK PUNYA tempat sampah sama sekali */}
          {hasNoBin && Object.keys(allLocationsWithBin).length > 0 && (
            <>
              <div className="bg-[#fff3e0] border-l-[5px] border-[#ff9800] py-6 px-6 rounded-xl mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚠️</span>
                  <h3 className="text-2xl text-gray-800 m-0">Tempat Sampah Tidak Tersedia di {fakultasLabel}</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed m-0 font-medium">
                  Tempat sampah <strong>{targetBin}</strong> untuk sampah <strong>{result.waste_type}</strong> tidak tersedia di {fakultasLabel}. Berikut rekomendasi lokasi terdekat yang menyediakan tempat sampah ini:
                </p>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {Object.keys(allLocationsWithBin).map(fakultasKey => {
                  const fakultasInfo = FAKULTAS_OPTIONS.find(f => f.value === fakultasKey)
                  const locations = allLocationsWithBin[fakultasKey]
                  const isExpanded = expandedFakultas[fakultasKey]

                  return (
                    <div key={fakultasKey} className="border-none">
                      {/* Header Fakultas */}
                      <div className="flex justify-between items-center py-3 px-4 cursor-pointer bg-[#fff3e0] rounded-lg transition-colors duration-300 hover:bg-[#ffe0b2] mb-3" onClick={() => toggleFakultas(fakultasKey)}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">🏛️</span>
                          <span className="font-semibold text-base text-gray-800">{fakultasInfo?.label || fakultasKey}</span>
                          <span className="text-sm text-gray-600 font-medium">({locations.length} lokasi)</span>
                        </div>
                        <span className={`text-sm text-[#ff9800] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                      </div>

                      {/* Location Cards - No nested cards */}
                      {isExpanded && (
                        <div className="flex flex-col gap-3 animate-[slideDown_0.3s_ease] pl-2">
                          {locations.map((lokasi, index) => {
                            const locationKey = `nobin-${fakultasKey}-${index}`
                            const isImageExpanded = expandedLocationImages[locationKey]

                            return (
                              <div key={index} className="bg-white/80 border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:border-[#ff9800] hover:shadow-md">
                                <div className="flex items-start gap-3 mb-3">
                                  <span className="text-xl mt-0.5">📍</span>
                                  <div className="flex-1">
                                    <h4 className="text-base font-semibold text-gray-800 my-0 mb-1">{lokasi.label}</h4>
                                    <p className="text-sm text-gray-600 m-0">{lokasi.description}</p>
                                  </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <span className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Tempat sampah:</span>
                                  <div className="flex flex-wrap gap-2">
                                    {lokasi.bins.map((bin, binIndex) => (
                                      <span
                                        key={binIndex}
                                        className={`py-1.5 px-3.5 rounded-2xl text-sm font-medium border ${
                                          bin.includes(targetBin) ? "bg-[#4caf50] text-white border-[#4caf50] font-semibold shadow-[0_2px_8px_rgba(76,175,80,0.3)]" : "bg-[#e3f2fd] text-[#1976d2] border-[#bbdefb]"
                                        }`}
                                      >
                                        {bin}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Image Dropdown */}
                                {lokasi.image_url && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <button onClick={() => toggleLocationImage(locationKey)} className="flex items-center justify-between w-full py-2 px-3 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                      <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <span>📷</span>
                                        Lihat Foto Lokasi
                                      </span>
                                      <span className={`text-xs text-[#ff9800] transition-transform duration-300 ${isImageExpanded ? "rotate-180" : ""}`}>▼</span>
                                    </button>
                                    {isImageExpanded && (
                                      <div className="mt-3 rounded-lg overflow-hidden animate-[slideDown_0.3s_ease]">
                                        <img
                                          src={lokasi.image_url}
                                          alt={`Foto lokasi ${lokasi.label}`}
                                          className="w-full h-auto object-cover rounded-lg shadow-md"
                                          onError={e => {
                                            e.target.style.display = "none"
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Jika tidak ada tempat sampah sama sekali */}
          {hasNoBin && Object.keys(allLocationsWithBin).length === 0 && (
            <div className="bg-[#fff3e0] border-l-[5px] border-[#ff9800] py-6 px-6 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <h3 className="text-2xl text-gray-800 m-0">Tempat Sampah Tidak Ditemukan</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed m-0 font-medium">
                Maaf, tempat sampah untuk <strong>{result.waste_type?.includes("Botol Plasti") ? "Botol Plastik" : result.waste_type}</strong> belum tersedia di sistem kami. Silakan hubungi pengelola kampus untuk informasi lebih lanjut.
              </p>
            </div>
          )}

          {/* All Predictions (confidence breakdown) */}
          {result.allPredictions && result.allPredictions.length > 0 && (
            <div className="bg-[#f8f9ff] border-l-[4px] border-[#1e293b] py-6 px-6 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📊</span>
                <h3 className="text-2xl text-gray-800 m-0 font-bold">Detail Prediksi</h3>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                {result.allPredictions.map((pred, index) => (
                  <div key={index} className="grid grid-cols-[180px_1fr_60px] items-center gap-4">
                    <span className="font-medium text-gray-800 text-sm">{pred.label}</span>
                    <div className="h-6 bg-gray-300 rounded-xl overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#10b981] to-[#1e3a8a] transition-all duration-500 rounded-xl" style={{ width: `${pred.confidence}%` }}></div>
                    </div>
                    <span className="font-semibold text-[#10b981] text-right text-sm">{pred.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              className="flex-1 py-4 px-8 text-lg font-semibold border-none rounded-full cursor-pointer transition-all duration-300 bg-white text-[#10b981] border-2 border-[#10b981] hover:bg-[#f8f9ff] hover:-translate-y-0.5"
              onClick={() => router.push("/home")}
            >
              Kembali ke Home
            </button>
            <button
              className="flex-1 py-4 px-8 text-lg font-semibold border-none rounded-full cursor-pointer transition-all duration-300 bg-[#1e293b] text-white hover:-translate-y-0.5 hover:shadow-md hover:bg-[#334155]"
              onClick={() => router.push("/scan")}
            >
              Scan Lagi
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
