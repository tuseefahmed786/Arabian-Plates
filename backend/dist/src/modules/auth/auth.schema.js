"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhoneSchema = exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2),
        email: zod_1.z.email(),
        phone: zod_1.z.string().optional(),
        password: zod_1.z.string().min(8),
        role: zod_1.z.enum(["buyer", "seller", "admin"]).default("buyer"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email(),
        password: zod_1.z.string().min(8),
    }),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().optional(),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email(),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(10),
        password: zod_1.z.string().min(8),
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email(),
    }),
});
exports.verifyPhoneSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string().min(6),
        code: zod_1.z.string().min(4),
    }),
});
