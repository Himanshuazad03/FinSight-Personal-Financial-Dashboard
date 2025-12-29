import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "FinSight",
  name: "FinSight",
  retryFunction: async (attempt) => {
    delay: Max.pow(2, attempt) * 1000;
    MaxAttempts: 2;
  },
});
