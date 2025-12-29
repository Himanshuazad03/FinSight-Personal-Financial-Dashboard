import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // Refill 5 tokens per interval
      interval: 3600, // Refill every 10 seconds
      capacity: 10,
    }),
  ],
});

export default aj;
