import Budget from "@/models/Budget";
import { inngest } from "./client";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";
import BudgetAlertModern from "../../../emails/email";
import { sendEmail } from "@/actions/sendEmail";
import Account from "@/models/Account";
import User from "@/models/User";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const budgetAlert = inngest.createFunction(
  { name: "budget-alert" },
  { cron: "0 */4 * * *" },
  async ({ step }) => {
    const budgets = await step.run("get-current-budget", async () => {
      return await Budget.find().populate({
        path: "userId",
        populate: {
          path: "accounts",
          match: { isDefault: true },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.userId.accounts[0];

      if (!defaultAccount) {
        continue;
      }

      const expenses = await step.run(
        `check-budget-${budget._id}`,
        async () => {
          const startDate = new Date();
          startDate.setDate(1);

          return await Transaction.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(budget.userId._id),
                accountId: new mongoose.Types.ObjectId(defaultAccount._id),
                type: "EXPENSE",
                date: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ]);
        }
      );

      const totalExpenses = Number(expenses[0].total.$numberDecimal);

      const budgetAmount = Number(budget.amount.$numberDecimal);

      if (budgetAmount <= 0) continue;

      const percentageUsed = Math.round((totalExpenses / budgetAmount) * 100);

      if (
        percentageUsed >= 80 &&
        (!budget.lastAlertSent ||
          isNewMonth(new Date(budget.lastAlertSent), new Date()))
      ) {
        await sendEmail({
          to: budget.userId.email,
          subject: `Budget Alert for ${defaultAccount?.name}`,
          react: (
            <BudgetAlertModern
              name={budget.userId.name}
              type="bugdet-report"
              data={{
                budgetAmount: Number(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                percentageUsed,
              }}
            />
          ),
        });

        await Budget.findOneAndUpdate(
          { _id: budget._id },
          { lastAlertSent: new Date() }
        );
      }
    }
  }
);

const isNewMonth = (lastAlertSent, now) => {
  return (
    lastAlertSent.getFullYear() !== now.getFullYear() ||
    lastAlertSent.getMonth() !== now.getMonth()
  );
};

export const processRecurringTransaction = inngest.createFunction(
  {
    name: "process-recurring-transaction",
    id: "process-recurring-transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "process-recurring-transaction" },

  async ({ event, step }) => {
    const transaction = await step.run("get-transaction", async () =>
      Transaction.findOne({
        _id: event.data.transactionId,
        userId: event.data.userId,
      })
    );

    // Guard 1: no transaction
    if (!transaction) return;

    const amountValue = Number(transaction.amount.$numberDecimal);

    // Guard 2: not due yet
    if (!isTransactionDue(transaction)) return;

    // 1️⃣ Create the actual recurring transaction
    await step.run("create-recurring-instance", async () =>
      Transaction.create({
        type: transaction.type,
        amount: amountValue,
        description: `${transaction.description} (Recurring)`,
        date: new Date(),
        category: transaction.category,
        userId: transaction.userId,
        accountId: transaction.accountId,
        isRecurring: false,
      })
    );

    // 2️⃣ Update parent recurring transaction
    await step.run("update-parent-transaction", async () =>
      Transaction.findByIdAndUpdate(transaction._id, {
        lastProcessed: new Date(),
        nextRecurringDate: calculateNextRecurringDate(
          transaction.date,
          transaction.recurringInterval
        ),
      })
    );

    // 3️⃣ Update account balance
    await step.run("update-account-balance", async () =>
      Account.findByIdAndUpdate(transaction.accountId, {
        $inc: {
          balance: transaction.type === "EXPENSE" ? -amountValue : amountValue,
        },
      })
    );
  }
);

function isTransactionDue(transaction) {
  if (!transaction.nextRecurringDate) return true;
  return new Date(transaction.nextRecurringDate) <= new Date();
}

export const createRecurringTransaction = inngest.createFunction(
  {
    name: "create-recurring-transaction",
    id: "create-recurring-transaction",
  },
  { cron: "0 0 * * *" }, // runs daily

  async ({ step }) => {
    // 1️⃣ Find all due recurring transactions
    const transactions = await step.run("find-due-recurring", async () =>
      Transaction.find({
        isRecurring: true,
        status: "COMPLETED",
        $or: [
          { lastProcessed: null },
          { nextRecurringDate: { $lte: new Date() } },
        ],
      })
    );

    if (!transactions.length) {
      return { triggered: 0 };
    }

    // 2️⃣ BUILD EVENTS (IMPORTANT: return the array)
    const events = await step.run("build-events", async () =>
      transactions.map((transaction) => ({
        name: "process-recurring-transaction",
        data: {
          transactionId: transaction._id,
          userId: transaction.userId,
        },
      }))
    );

    // 3️⃣ Send events to Inngest
    await inngest.send(events);

    return { triggered: transactions.length };
  }
);

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

async function generateFinancialInsights(stats, month) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

export const generateMonthlyReport = inngest.createFunction(
  {
    name: "generate-monthly-report",
    id: "generate-monthly-report",
  },
  { cron: "0 0 1 * *" }, // runs on the first day of the month

  async ({ step }) => {
    const users = await step.run("find-users", async () => {
      return await User.find({
        accounts: { $exists: true, $not: { $size: 0 } },
      });
    });

    for (const user of users) {
      await step.run(`send-monthly-report-${user._id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user._id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        // Generate AI insights
        const insights = await generateFinancialInsights(stats, monthName);

        await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: (
            <BudgetAlertModern
              name={user.name}
              type="monthly-report"
              data={{
                stats,
                month: monthName,
                insights,
              }}
            />
          ),
        });
      });
    }

    return { processed: users.length };
  }
);

async function getMonthlyStats(userId, month) {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await Transaction.find({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = Number(t.amount.toString());
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}
