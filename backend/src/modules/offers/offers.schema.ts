import { z } from "zod";

export const createOfferSchema = z.object({
  body: z.object({
    listingId: z.string().min(1),
    amountAED: z.number().int().positive(),
    note: z.string().max(1000).optional(),
  }),
});

export const updateOfferStatusSchema = z.object({
  body: z.object({
    status: z.enum(["accepted", "rejected"]),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
