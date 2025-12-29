"use server";

import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/dbConfig/db";
import User from "@/models/User";
import Budget from "@/models/Budget";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    // Get user's budget
    const budget = await Budget.findOne({ userId: user._id });

    // Current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Sum expenses for the month
    const expensesAgg = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user._id),
          type: "EXPENSE",
          date: { $gte: startOfMonth, $lte: endOfMonth },
          ...(accountId
            ? { accountId: new mongoose.Types.ObjectId(accountId) }
            : {}),
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const currentExpenses = expensesAgg[0]?.total ?? 0;
    return {
      budget: budget
        ? {
            id: budget._id.toString(),
            amount: Number(budget.amount),
          }
        : null,
      currentExpenses: Number(currentExpenses),
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const budgetAmount = Number(amount);

    if (typeof budgetAmount !== "number" || isNaN(budgetAmount)) {
      throw new Error("Invalid budget amount");
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: user._id },
      { amount },
      { new: true, upsert: true }
    );

    revalidatePath("/dashboard");
    return {
      success: true,
      data: {
        id: budget._id.toString(),
        amount: Number(budget.amount),
      },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
