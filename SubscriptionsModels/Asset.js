import mongoose from "mongoose";

const assetHistorySchema = new mongoose.Schema(
  {
    date: String,
    action: String,
    extendedForMonths: Number,
    cost: Number,
    nextWarrantyEnd: String,
    performedBy: String
  },
  { _id: false }
);


const fileSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: String,
    assignedTo: String,
    warrantyEnd: String,
    status: String,

    notes: String,

    description: String,
    history: [assetHistorySchema],
    files: [fileSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Asset", assetSchema);

