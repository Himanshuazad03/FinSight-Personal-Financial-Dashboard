"use server";

import mongoose from "mongoose";
import { subDays } from "date-fns";
import { connectDB } from "@/dbConfig/db";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";

const ACCOUNT_ID = new mongoose.Types.ObjectId("694c48db56d46267b504871e");
const USER_ID = new mongoose.Types.ObjectId("694bef3d903e4a7c0dfa2b40");

// Categories with typical amount ranges
const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

// Helpers
function getRandomAmount(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    await connectDB();

    const transactions = [];
    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);

      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        transactions.push({
          type,
          amount: mongoose.Types.Decimal128.fromString(amount),
          description:
            type === "INCOME"
              ? `Received ${category}`
              : `Paid for ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        });

        totalBalance += type === "INCOME"
          ? Number(amount)
          : -Number(amount);
      }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete existing transactions
      await Transaction.deleteMany(
        { accountId: ACCOUNT_ID },
        { session }
      );

      // Insert new transactions
      await Transaction.insertMany(transactions, { session });

      // Update account balance
      await Account.updateOne(
        { _id: ACCOUNT_ID },
        {
          balance: mongoose.Types.Decimal128.fromString(
            totalBalance.toFixed(2)
          ),
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: `Created ${transactions.length} transactions`,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}
