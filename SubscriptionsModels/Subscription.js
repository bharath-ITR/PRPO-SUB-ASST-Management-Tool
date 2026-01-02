import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    action: String,
    date: { type: Date, default: Date.now },
    renewedForMonths: Number,
    cost: Number,
    previousCost: Number,
    newCost: Number,
    costCurrency: String,
    nextDueDate: String,
    previousDueDate: String,
    renewedBy: String
  },
  { _id: false }
);


// models/Subscription.js
const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  url: String,
  description: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}); // ✅ REMOVE _id: false


const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vendor: String,
    billingCycle: String,
    cost: Number,
    costCurrency: {
      type: String,
      default: "₹"
    },
    dueDate: String,
    status: String,
    owner: {
      email: String,
      name: String
    },
    notes: String,

    description: String,

    history: [historySchema],
    files: [fileSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);

