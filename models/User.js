import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    // Data Akun
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email tidak boleh kembar
    },
    password: {
      type: String,
      required: true,
    },

    // Data Gamifikasi (Sesuai Konsep SDGS & Tubes)
    total_xp: {
      type: Number,
      default: 0, // User baru mulai dari 0 XP
    },
    level: {
      type: Number,
      default: 1, // User baru level 1
    },
    badges: {
      type: [String], // Array of strings buat simpan nama badge
      default: [],
    },

    // Metadata
    joined_at: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "users" }
) // Memaksa nama collection jadi 'users'

export default mongoose.models.User || mongoose.model("User", userSchema)
