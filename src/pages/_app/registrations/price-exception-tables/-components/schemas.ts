import { z } from "zod";

export const PriceExceptionTableSchema = z.object({
  id: z.string(),
  name: z.string(),
});
