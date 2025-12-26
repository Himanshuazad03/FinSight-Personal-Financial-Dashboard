import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["CURRENT", "SAVINGS"],
      required: true,
    },
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.models.Account || mongoose.model("Account", accountSchema);
export default Account;