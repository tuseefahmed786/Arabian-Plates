import { z } from "zod";

export const createContactSubmissionSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    department: z.enum(["sales", "buyer-support", "seller-operations"]),
    subject: z.string().trim().min(3).max(180),
    message: z.string().trim().min(10).max(3000),
  }),
});

export type CreateContactSubmissionBody = z.infer<typeof createContactSubmissionSchema>["body"];
