import mongoose from "mongoose"

const binSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    bins: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    fakultas: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
)

const Bin = mongoose.models.Bin || mongoose.model("Bin", binSchema, "bins")

export default Bin
