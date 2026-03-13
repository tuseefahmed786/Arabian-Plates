"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfferStatusSchema = exports.createOfferSchema = void 0;
const zod_1 = require("zod");
exports.createOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        listingId: zod_1.z.string().min(1),
        amountAED: zod_1.z.number().int().positive(),
        note: zod_1.z.string().max(1000).optional(),
    }),
});
exports.updateOfferStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["accepted", "rejected"]),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
