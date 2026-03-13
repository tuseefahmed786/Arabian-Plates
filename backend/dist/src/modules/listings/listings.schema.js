"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateListingSchema = exports.createListingSchema = exports.listingQuerySchema = void 0;
const zod_1 = require("zod");
exports.listingQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().optional(),
        limit: zod_1.z.coerce.number().optional(),
        q: zod_1.z.string().optional(),
        emirate: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        plateCode: zod_1.z.string().optional(),
        plateNumber: zod_1.z.string().optional(),
        digitCount: zod_1.z.coerce.number().optional(),
        minPrice: zod_1.z.coerce.number().optional(),
        maxPrice: zod_1.z.coerce.number().optional(),
        featured: zod_1.z.coerce.boolean().optional(),
        verified: zod_1.z.coerce.boolean().optional(),
        negotiable: zod_1.z.coerce.boolean().optional(),
        sellerType: zod_1.z.enum(["owner", "broker", "dealer"]).optional(),
        plateType: zod_1.z.enum(["standard", "premium", "vip"]).optional(),
        status: zod_1.z.enum(["active", "pending", "sold", "rejected", "archived"]).optional(),
        sort: zod_1.z.enum(["newest", "price-low-high", "price-high-low", "most-viewed", "most-favorited"]).optional(),
    }),
});
exports.createListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        emirate: zod_1.z.string().min(2),
        city: zod_1.z.string().min(2),
        plateCode: zod_1.z.string().min(1),
        plateNumber: zod_1.z.string().min(1),
        priceAED: zod_1.z.number().int().positive(),
        negotiable: zod_1.z.boolean().default(false),
        sellerType: zod_1.z.enum(["owner", "broker", "dealer"]),
        plateType: zod_1.z.enum(["standard", "premium", "vip"]),
        description: zod_1.z.string().max(2000).optional(),
        ownershipStatus: zod_1.z.string().optional(),
        expiresAt: zod_1.z.coerce.date().optional(),
    }),
});
exports.updateListingSchema = zod_1.z.object({
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
    body: zod_1.z
        .object({
        priceAED: zod_1.z.number().int().positive().optional(),
        negotiable: zod_1.z.boolean().optional(),
        featured: zod_1.z.boolean().optional(),
        verified: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(["active", "pending", "sold", "rejected", "archived"]).optional(),
        approvalStatus: zod_1.z.enum(["pending", "approved", "rejected"]).optional(),
        description: zod_1.z.string().max(2000).optional(),
        isPublished: zod_1.z.boolean().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, "At least one field must be provided"),
});
