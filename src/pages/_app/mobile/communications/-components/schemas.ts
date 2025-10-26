import { z } from "zod";

export const MobileCommunicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  contentUrl: z.optional(z.string()),
});
