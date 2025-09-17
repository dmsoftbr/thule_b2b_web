import { z } from "zod";

export const UserGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
});
