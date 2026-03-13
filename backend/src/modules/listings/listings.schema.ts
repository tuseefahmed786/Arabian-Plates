import { z } from "zod";

export const listingQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    q: z.string().optional(),
    emirate: z.string().optional(),
    city: z.string().optional(),
    plateCode: z.string().optional(),
    plateNumber: z.string().optional(),
    digitCount: z.coerce.number().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    featured: z.coerce.boolean().optional(),
    verified: z.coerce.boolean().optional(),
    negotiable: z.coerce.boolean().optional(),
    sellerType: z.enum(["owner", "broker", "dealer"]).optional(),
    plateType: z.enum(["standard", "premium", "vip"]).optional(),
    status: z.enum(["active", "pending", "sold", "rejected", "archived"]).optional(),
    sort: z.enum(["newest", "price-low-high", "price-high-low", "most-viewed", "most-favorited"]).optional(),
  }),
});

export const createListingSchema = z.object({
  body: z.object({
    emirate: z.string().min(2),
    city: z.string().min(2),
    plateCode: z.string().min(1),
    plateNumber: z.string().min(1),
    priceAED: z.number().int().positive(),
    negotiable: z.boolean().default(false),
    sellerType: z.enum(["owner", "broker", "dealer"]),
    plateType: z.enum(["standard", "premium", "vip"]),
    description: z.string().max(2000).optional(),
    ownershipStatus: z.string().optional(),
    expiresAt: z.coerce.date().optional(),
  }),
});

export const updateListingSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z
    .object({
      priceAED: z.number().int().positive().optional(),
      negotiable: z.boolean().optional(),
      featured: z.boolean().optional(),
      verified: z.boolean().optional(),
      status: z.enum(["active", "pending", "sold", "rejected", "archived"]).optional(),
      approvalStatus: z.enum(["pending", "approved", "rejected"]).optional(),
      description: z.string().max(2000).optional(),
      isPublished: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field must be provided"),
});
