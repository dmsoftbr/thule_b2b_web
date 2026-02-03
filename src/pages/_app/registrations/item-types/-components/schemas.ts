import { z } from "zod";

export const ItemTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});
