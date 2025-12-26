import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    lastAlertSent: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one budget per user
      index: true,
    },
  },
  { timestamps: true }
);

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
export default Budget;