import mongoose from "mongoose"

const wasteLogSchema = new mongoose.Schema({
  // Jenis sampah hasil scan AI (misal: Plastik, Organik)

  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Tipe data ID MongoDB
    ref: "User", // Nyambung ke model 'User'
    required: true, // Wajib ada pemiliknya
  },

  xp_earned: {
    type: Number,
    required: true,
    min: 10,
    max: 25,
    default: 10,
  },

  waste_type: {
    type: String,
    required: true,
  },
  // Skor akurasi dari model AI (0-1, contoh: 0.75 untuk 75%)
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  // Data lokasi berdasarkan locationConfig.js
  fakultas: {
    type: String,
    required: true,
  },
  lokasi_id: {
    type: String,
    required: true,
  },
  // Waktu penyimpanan otomatis
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.WasteLog || mongoose.model("WasteLog", wasteLogSchema, "waste_logs")
