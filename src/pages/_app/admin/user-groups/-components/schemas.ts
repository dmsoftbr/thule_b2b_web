import { z } from "zod";
export const UserGroupSchema = z.object({
  id: z.optional(z.string()),
  name: z.optional(z.string()),
});
