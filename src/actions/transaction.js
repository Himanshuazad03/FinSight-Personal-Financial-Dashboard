"use server";

import Transaction from "@/models/Transaction";
import { connectDB } from "@/dbConfig/db";
import User from "@/models/User";
import Account from "@/models/Account";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function getAllTransaction(search) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) throw new Error("User not found");

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    if (!search) {
      const transactions = await Transaction.find();
      return transactions;
    }
    const transactions = await Transaction.find({
      userId: user._id, // 🔐 IMPORTANT
      $or: [
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    })
      .sort({ date: -1 })
      .lean();
    return {
      success: true,
      data: transactions,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function BulkDeleteTransaction(transactionIds) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) throw new Error("User not found");

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const transactions = await Transaction.find({
      userId: user._id,
      _id: { $in: transactionIds },
    });

    const accountBalanceChange = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount
          : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    for (const [accountId, amount] of Object.entries(accountBalanceChange)) {
      await Account.findOneAndUpdate(
        {
          _id: accountId,
          userId: user._id,
        },
        {
          $inc: { balance: amount },
        }
      );
    }

    await Transaction.deleteMany({
      userId: user._id,
      _id: { $in: transactionIds },
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
}
