"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInquirySchema = void 0;
const zod_1 = require("zod");
exports.createInquirySchema = zod_1.z.object({
    body: zod_1.z.object({
        listingId: zod_1.z.string().min(1),
        subject: zod_1.z.string().min(3),
        message: zod_1.z.string().min(3).max(2000),
    }),
});
