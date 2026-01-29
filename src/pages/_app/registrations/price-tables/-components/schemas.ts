import { z } from "zod";

export const PriceTableSchema = z.object({
  id: z.string(),
  name: z.string(),
  validFrom: z.date(),
  validTo: z.date(),
  zeroDiscount: z.boolean(),
  isActive: z.boolean(),
  portalName: z.optional(z.string()),
});
