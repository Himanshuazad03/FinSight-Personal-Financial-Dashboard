import { NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/db";
import Transaction from "@/models/Transaction";
import serializeTransaction from "@/app/lib/serializeTransaction";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";


export async function GET(req, { params }) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { id: accountId } = await params;
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const recurring = searchParams.get("recurring") || "";
    const sortField = searchParams.get("sortField") || "date";
    const sortDirection = searchParams.get("sortDirection") || "desc";

    const skip = (page - 1) * limit;

    /** ---------------- FILTER ---------------- */
    const filter = {
      accountId,
      userId: user._id,
    };

    if (search) {
      filter.description = { $regex: search, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    if (recurring === "recurring") {
      filter.isRecurring = true;
    }

    if (recurring === "non-recurring") {
      filter.isRecurring = false;
    }

    /** ---------------- SORT ---------------- */
    const sort = {
      [sortField]: sortDirection === "asc" ? 1 : -1,
    };

    /** ---------------- QUERY ---------------- */
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Transaction.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: transactions.map(serializeTransaction),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    throw new Error(error);
  }
}