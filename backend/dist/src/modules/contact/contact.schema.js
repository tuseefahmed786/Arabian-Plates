"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactSubmissionSchema = void 0;
const zod_1 = require("zod");
exports.createContactSubmissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().trim().min(2).max(120),
        email: zod_1.z.string().trim().email().max(255),
        department: zod_1.z.enum(["sales", "buyer-support", "seller-operations"]),
        subject: zod_1.z.string().trim().min(3).max(180),
        message: zod_1.z.string().trim().min(10).max(3000),
    }),
});
