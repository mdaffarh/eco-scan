"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocation } from "@/context/LocationContext"
import { FAKULTAS_OPTIONS } from "@/utils/locationConfig"
import { useRequireAuth } from "@/utils/authHooks"
import Navbar from "@/components/Navbar"
import { loadModel, predictImage, getWasteInfo, isModelLoaded } from "@/utils/modelUtils"
import { getUser } from "@/utils/authUtils"
import { LoadingOverlay } from "@/components/ui/loading"
import { Skeleton } from "@/components/ui/skeleton"

// Helper function to compress image for sessionStorage
const compressImageForStorage = async (imageElement, maxWidth = 800, quality = 0.7) => {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Calculate new dimensions while maintaining aspect ratio
    let width = imageElement.naturalWidth
    let height = imageElement.naturalHeight

    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }

    canvas.width = width
    canvas.height = height

    // Draw and compress
    ctx.drawImage(imageElement, 0, 0, width, height)

    // Convert to compressed base64 (JPEG with quality setting)
    const compressedBase64 = canvas.toDataURL("image/jpeg", quality)
    resolve(compressedBase64)
  })
}

export default function Scan() {
  const { user, isLoading: authLoading } = useRequireAuth()
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [modelError, setModelError] = useState(null)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef(null)
  const imageRef = useRef(null)
  const router = useRouter()
  const { selectedFakultas, isLocationSet } = useLocation()

  // Set mounted untuk prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cek apakah user sudah pilih fakultas
  useEffect(() => {
    if (!authLoading && !selectedFakultas && mounted) {
      alert("Silakan pilih fakultas terlebih dahulu!")
      router.push("/home")
    }
  }, [selectedFakultas, router, authLoading, mounted])

  // Load model saat component mount
  useEffect(() => {
    const initModel = async () => {
      if (!isModelLoaded()) {
        setIsModelLoading(true)
        const result = await loadModel()
        if (!result.success) {
          setModelError("Gagal memuat model AI. " + result.error)
        }
        setIsModelLoading(false)
      } else {
        setIsModelLoading(false)
      }
    }

    initModel()
  }, [])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-[#10b981]/30 border-t-[#10b981] rounded-full animate-spin"></div>
      </div>
    )
  }

  const handleFileSelect = event => {
    const file = event.target.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)

      // Revoke previous object URL to avoid memory leak
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      // Create object URL (much lighter than base64)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleScan = async () => {
    // Get current user dari localStorage, dengan fallback ke user dari hook
    let currentUser = getUser()

    // Jika localStorage kosong, gunakan user dari useRequireAuth hook
    if (!currentUser && user) {
      currentUser = user
    }

    console.log("Current User:", currentUser) // DEBUG

    if (!currentUser || !currentUser.id) {
      alert("Sesi habis. Silakan login ulang.")
      router.push("/login")
      return
    }

    if (!selectedImage) {
      alert("Pilih gambar terlebih dahulu!")
      return
    }

    if (modelError) {
      alert("Model AI belum siap. " + modelError)
      return
    }

    setIsProcessing(true)

    try {
      // Tunggu image element selesai load
      await new Promise(resolve => {
        if (imageRef.current && imageRef.current.complete) {
          resolve()
        } else {
          imageRef.current.onload = resolve
        }
      })

      // Run prediction menggunakan model TFLite
      const prediction = await predictImage(imageRef.current)

      // Get waste info berdasarkan label
      const wasteInfo = getWasteInfo(prediction.label)

      // Normalize waste_type untuk handle label terpotong
      const normalizedWasteType = prediction.label?.includes("Botol Plasti") ? "Botol Plastik" : prediction.label

      // --- KIRIM KE BACKEND API ---
      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser.id, // [PENTING] Kirim ID User
            waste_type: normalizedWasteType, // Gunakan normalized waste type
            confidence: prediction.confidence / 100, // Convert percentage to decimal (90% → 0.9)
            fakultas: selectedFakultas,
            lokasi_id: selectedFakultas,
          }),
        })

        const responseJson = await response.json()

        if (response.ok) {
          console.log("✅ SUKSES: Data masuk ke MongoDB!", responseJson)

          // Store gamification data for result page
          if (responseJson.gamification) {
            console.log("📊 Storing gamification data:", responseJson.gamification)
            sessionStorage.setItem("gamificationData", JSON.stringify(responseJson.gamification))
          } else {
            console.warn("⚠️ Backend tidak mengirim gamification data")
          }
        } else {
          console.error("❌ GAGAL: Backend menolak.", responseJson)
        }
      } catch (err) {
        console.error("⚠️ ERROR KONEKSI:", err)
        // Kita tidak 'throw' error di sini agar user tetap bisa lanjut
        // melihat hasil scan meskipun database sedang mati.
      }

      setIsProcessing(false)

      // Compress image to smaller base64 for sessionStorage
      const compressedImage = await compressImageForStorage(imageRef.current)

      // Store data di sessionStorage dengan gambar yang sudah dikompres
      const resultData = {
        image: compressedImage, // Compressed version
        waste_type: normalizedWasteType,
        category: wasteInfo.category,
        confidence: Math.round(prediction.confidence),
        disposal: wasteInfo.disposal,
        additionalInfo: wasteInfo.additionalInfo,
        allPredictions: prediction.allPredictions,
        fakultas: selectedFakultas,
      }
      sessionStorage.setItem("scanResult", JSON.stringify(resultData))

      // Navigate ke result page
      router.push("/scan/result")
    } catch (error) {
      setIsProcessing(false)
      console.error("Error during scanning:", error)
      alert("Terjadi kesalahan saat memproses gambar: " + error.message)
    }
  }

  const handleReset = () => {
    // Revoke object URL to free memory
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedImage(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleChangeLocation = () => {
    router.push("/home")
  }

  const fakultasLabel = FAKULTAS_OPTIONS.find(f => f.value === selectedFakultas)?.label || ""

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-5 py-4 sm:py-5 min-h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-gray-800 mb-2">Scan Sampah</h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">Ambil atau upload foto sampah untuk identifikasi</p>

          {/* Fakultas Info */}
          {selectedFakultas && (
            <div className="bg-[#1e293b] rounded-xl sm:rounded-2xl py-4 px-4 sm:py-5 sm:px-6 my-4 sm:my-6 mx-auto max-w-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 sm:gap-3 text-white">
                <span className="text-2xl sm:text-3xl">🏛️</span>
                <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                  <span className="text-xs sm:text-sm opacity-90 font-medium text-white">Fakultas:</span>
                  <span className="text-base sm:text-lg font-semibold text-white text-left">{fakultasLabel}</span>
                </div>
              </div>
              <button
                className="bg-[#10b981] text-white border-none py-2 px-4 sm:py-2.5 sm:px-5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap hover:bg-[#059669] hover:-translate-y-0.5 hover:shadow-md w-full sm:w-auto"
                onClick={handleChangeLocation}
              >
                Ganti Fakultas
              </button>
            </div>
          )}

          {isModelLoading && (
            <div className="mt-4 flex items-center justify-center gap-3 py-3 px-6 rounded-full bg-[#e3f2fd] text-[#1976d2]">
              <Skeleton className="h-4 w-4 rounded-full" />
              <span className="text-sm font-medium">Memuat model AI...</span>
            </div>
          )}
          {modelError && <div className="mt-4 py-2.5 px-5 rounded-full text-sm inline-flex items-center gap-2 bg-[#ffebee] text-[#c62828]">⚠️ {modelError}</div>}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl sm:rounded-[20px] p-4 sm:p-6 md:p-10 shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          {!previewUrl ? (
            <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
              <div
                className="w-full max-w-2xl h-[300px] sm:h-[400px] border-[2px] sm:border-[3px] border-dashed border-[#1e293b] rounded-xl sm:rounded-2xl flex flex-col justify-center items-center cursor-pointer transition-all duration-300 bg-[#f8f9ff] hover:border-[#10b981] hover:bg-[#f0f2ff] hover:scale-[1.02]"
                onClick={handleCameraClick}
              >
                <span className="text-6xl sm:text-8xl mb-3 sm:mb-5">📷</span>
                <p className="text-base sm:text-lg md:text-xl text-[#1e293b] font-medium my-1 px-4 text-center">Klik untuk ambil/upload foto</p>
                <p className="text-xs sm:text-sm text-gray-400 my-1">Format: JPG, PNG, JPEG</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} capture="environment" />
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-8">
              <div className="w-full max-h-[350px] sm:max-h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                <img ref={imageRef} src={previewUrl} alt="Preview" crossOrigin="anonymous" className="w-full h-full object-contain block" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  className="py-3 px-8 sm:py-4 sm:px-10 text-base sm:text-lg font-semibold rounded-full cursor-pointer inline-flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-300 bg-white text-[#1e293b] border-2 border-[#1e293b] hover:enabled:bg-gray-50 hover:enabled:-translate-y-0.5 flex-1 sm:flex-initial"
                  onClick={handleReset}
                  disabled={isProcessing}
                >
                  Ganti Foto
                </button>
                <button
                  className="py-3 px-8 sm:py-4 sm:px-10 text-base sm:text-lg font-semibold border-none rounded-full cursor-pointer inline-flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-300 bg-[#10b981] text-white hover:enabled:-translate-y-0.5 hover:enabled:shadow-md hover:enabled:bg-[#059669] disabled:opacity-70 disabled:cursor-not-allowed flex-1 sm:flex-initial"
                  onClick={handleScan}
                  disabled={isProcessing || isModelLoading}
                >
                  {isProcessing ? (
                    <>
                      <span className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></span>
                      Memproses...
                    </>
                  ) : (
                    <>Scan Sekarang</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {isProcessing && <LoadingOverlay message="Mengidentifikasi sampah..." />}
      </div>
    </>
  )
}
