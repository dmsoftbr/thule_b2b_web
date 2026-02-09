import { z } from "zod";

export const SkuMessageSchema = z.object({
  productId: z.string(),
  message: z.string(),
});
