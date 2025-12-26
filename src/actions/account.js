"use server";

import Account from "@/models/Account";
import serializeTransaction from "@/app/lib/serializeTransaction";
import { connectDB } from "@/dbConfig/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import Transaction from "@/models/Transaction";

export const updateDefaultAccount = async (accountId) => {
  try {
    await connectDB();
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
    const user = await User.findOne({ clerkUserId: userId });
    if (!user) throw new Error("User not found");
    await Account.updateMany({ userId: user._id }, { isDefault: false });
    const account = await Account.updateOne(
      { userId: user._id, _id: accountId },
      { isDefault: true }
    );

    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function getAccount(accountId) {
  await connectDB();

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await User.findOne({ clerkUserId: userId });
  if (!user) throw new Error("User not found");

  const account = await Account.findOne({
    _id: accountId,
    userId: user._id,
  }).lean();

  if (!account) return null;

  const transactionCount = await Transaction.countDocuments({
    accountId: account._id,
  });

  return {
    ...serializeTransaction(account),
    _count: { transactions: transactionCount },
  };
}
