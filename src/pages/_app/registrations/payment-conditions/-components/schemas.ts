import { z } from "zod";

export const PaymentConditionSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
  additionalDiscountPercent: z.number(),
});
