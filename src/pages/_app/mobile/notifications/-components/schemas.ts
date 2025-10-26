import { z } from "zod";

export const MobileNotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  imageUrl: z.optional(z.string()),
});
