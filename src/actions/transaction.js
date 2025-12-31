"use server";

import Transaction from "@/models/Transaction";
import { connectDB } from "@/dbConfig/db";
import User from "@/models/User";
import Account from "@/models/Account";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import serializeTransaction from "@/app/lib/serializeTransaction";
import { transactionLimiter, receiptScanLimiter } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const accountBalanceChange = transactions.reduce((acc, t) => {
      const amount = Number(t.amount.toString());
      const change = t.type === "EXPENSE" ? amount : -amount;
      const accountId = t.accountId.toString();

      acc[accountId] = (acc[accountId] || 0) + change;
      return acc;
    }, {});

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const [accountId, amount] of Object.entries(accountBalanceChange)) {
        await Account.findOneAndUpdate(
          { _id: accountId, userId: user._id },
          { $inc: { balance: amount } },
          { session }
        );
      }

      await Transaction.deleteMany(
        { userId: user._id, _id: { $in: transactionIds } },
        { session }
      );

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    revalidatePath("/dashboard");
    for (const accountId of Object.keys(accountBalanceChange)) {
      revalidatePath(`/account/${accountId}`);
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function createTransaction(data) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("User not found");

    const req = await request();

    const decision = await transactionLimiter.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaning, reset } = decision.reason;
        console.log({
          code: "RATE LIMIT EXCEED",
          details: {
            remaning,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too Many Requests, Please try again later.");
      }
      throw new Error("Unauthorized");
    }

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const account = await Account.findOne({
      _id: data.accountId,
      userId: user._id,
    });
    if (!account) throw new Error("Account not found");

    const transaction = await Transaction.create({
      ...data,
      userId: user._id,
      nextRecurringDate:
        data.isRecurring && data.recurringInterval
          ? calculateNextRecurringDate(data.date, data.recurringInterval)
          : null,
    });

    await Account.findByIdAndUpdate(data.accountId, {
      $inc: {
        balance:
          data.type === "EXPENSE" ? -Number(data.amount) : Number(data.amount),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);
    return { success: true, data: serializeTransaction(transaction) };
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
}

function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}

export async function ReceiptScanning(file) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("User not found");
    const req = await request();

    const decision = await receiptScanLimiter.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaning, reset } = decision.reason;
        console.log({
          code: "RATE LIMIT EXCEED",
          details: {
            remaning,
            resetInSeconds: reset,
          },
        });

        throw new Error("Daily Limit Exceeded, Try again Tomorrow.");
      }
      throw new Error("Unauthorized");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased Starts with Paid for (Very brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);

      const Finaldata = {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        description: data.description || "",
        category: data.category || "other-expense",
        merchantName: data.merchantName || "",
      };

      return {
        success: true,
        data: Finaldata,
      };
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error(error);
  }
}

export async function getTransaction(id) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");
    const transaction = await Transaction.findOne({
      _id: id,
      userId: user._id,
    });
    return { success: true, data: serializeTransaction(transaction) };
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateTransaction(id, data) {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const transaction = await Transaction.findOne({
      _id: id,
      userId: user._id,
    });

    if (!transaction) throw new Error("Transaction not found");

    const amtVal = transaction.amount;

    const oldBalance = transaction.type === "EXPENSE" ? -amtVal : amtVal;
    const newBalance =
      data.type === "EXPENSE" ? -Number(data.amount) : Number(data.amount);

    const netChange = newBalance - oldBalance;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: user._id }, // filter
      {
        ...data,
        userId: user._id,
        nextRecurringDate:
          data.isRecurring && data.recurringInterval
            ? calculateNextRecurringDate(data.date, data.recurringInterval)
            : null,
      },
      { new: true }
    );

    await Account.findOneAndUpdate(
      { _id: transaction.accountId, userId: user._id },
      {
        $inc: {
          balance: netChange,
        },
      }
    );

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);
    return { success: true, data: serializeTransaction(updated) };
  } catch (error) {
    throw new Error(error);
  }
}

export async function dashboardTransaction() {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");
    const transactions = await Transaction.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return { success: true, data: transactions.map(serializeTransaction) };
  } catch (error) {
    throw new Error(error);
  }
}
