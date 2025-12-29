import { inngest } from "@/lib/inngest/client";
import {
  budgetAlert,
  createRecurringTransaction,
  processRecurringTransaction,
  generateMonthlyReport,
} from "@/lib/inngest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    budgetAlert,
    createRecurringTransaction,
    processRecurringTransaction,
    generateMonthlyReport,
  ],
});
