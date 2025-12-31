import arcjet, { tokenBucket } from "@arcjet/next";

export const transactionLimiter = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,       // 10 tx/hour
      interval: 3600,       // 1 hour
      capacity: 10,
    }),
  ],
});

export const receiptScanLimiter = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,        // 5 tokens
      interval: 86400,      // 24 hours (in seconds)
      capacity: 5,          // max 5 scans stored
    }),
  ],
});

