import { z } from "zod";

export const saveListingSchema = z.object({
  body: z.object({
    listingId: z.string().min(1),
  }),
});
