import mongoose from "mongoose";

const serializeTransaction = (obj) => {
  if (!obj) return null;

  const toNumber = (val) =>
    val instanceof mongoose.Types.Decimal128 ? Number(val.toString()) : val;

  return {
    _id: obj._id?.toString(),

    type: obj.type,
    name: obj.name,
    description: obj.description,
    category: obj.category,
    status: obj.status,

    amount: toNumber(obj.amount), // number ✅
    balance: toNumber(obj.balance), // number ✅

    isRecurring: Boolean(obj.isRecurring),
    isDefault: Boolean(obj.isDefault),

    userId: obj.userId?.toString(),
    accountId: obj.accountId?.toString(), // 🔥 FIXED

    recurringInterval: obj.recurringInterval ?? null,
    nextRecurringDate: obj.nextRecurringDate
      ? obj.nextRecurringDate.toISOString()
      : null,

    date: obj.date instanceof Date ? obj.date.toISOString() : obj.date,

    createdAt:
      obj.createdAt instanceof Date
        ? obj.createdAt.toISOString()
        : obj.createdAt,

    updatedAt:
      obj.updatedAt instanceof Date
        ? obj.updatedAt.toISOString()
        : obj.updatedAt,
  };
};

export default serializeTransaction;
