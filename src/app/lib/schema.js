import { z } from "zod";

export const AccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z
    .number({
      required_error: "Initial Balance is required",
      invalid_type_error: "Initial Balance must be a number",
    })
    .min(1, "Initial balance is required"),
  isDefault: z.boolean().default(false),
});
