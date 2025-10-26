import { z } from "zod";
export const SettingSchema = z.object({
  id: z.optional(z.string()),
  name: z.optional(z.string()),
  content: z.optional(z.string()),
});
