import { z } from "zod";

export const createInquirySchema = z.object({
  body: z.object({
    listingId: z.string().min(1),
    subject: z.string().min(3),
    message: z.string().min(3).max(2000),
  }),
});
