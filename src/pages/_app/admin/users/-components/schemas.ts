import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
  groupId: z.string(),
  networkDomain: z.string(),
  customerId: z.number(),
  representativeId: z.number(),
  isActive: z.boolean(),
});
