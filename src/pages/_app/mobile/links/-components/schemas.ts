import { z } from "zod";

export const MobileLinkSchema = z.object({
  id: z.string(),
  title: z.string(),
  linkUrl: z.string(),
  isActive: z.boolean(),
});
