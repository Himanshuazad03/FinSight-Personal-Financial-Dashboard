import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

export async function connectDB() {
  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState >= 1) {
    console.log("🎉 Already connected to MongoDB");
    return;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🎉 MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}