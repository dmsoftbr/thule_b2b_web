import { z } from "zod";

export const SalesGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
});
