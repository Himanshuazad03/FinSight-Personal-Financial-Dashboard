"use server";

import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import Account from "@/models/Account";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/dbConfig/db";
import serializeTransaction from "@/app/lib/serializeTransaction";

export const createAccount = async (data) => {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const balanceFloat = parseFloat(data.balance);

    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    const existingAccount = await Account.find({
      userId: user._id,
    });

    const shouldDefault = existingAccount.length === 0 ? true : data.isDefault;

    if (shouldDefault) {
      await Account.updateMany({ userId: user._id }, { isDefault: false });
    }

    const newAccount = await Account.create({
      name: data.name,
      type: data.type,
      balance: balanceFloat,
      isDefault: shouldDefault,
      userId: user._id,
    });

    const serializedAccount = serializeTransaction(newAccount);

    revalidatePath("/dashboard");
    return {
      success: true,
      data: serializedAccount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllAccounts = async () => {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");

    const accounts = await Account.find({
      userId: user._id,
      createdAt: { $lt: new Date() },
    }).sort({ createdAt: -1 });

    const serializedAccounts = accounts.map(serializeTransaction);

    return {
      success: true,
      data: serializedAccounts,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
