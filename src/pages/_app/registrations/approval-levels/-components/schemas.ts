import { z } from "zod";

export const ApprovalLevelSchema = z.object({
  id: z.string(),
  description: z.string(),
  type: z.string(),
});
