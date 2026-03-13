import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.email(),
    phone: z.string().optional(),
    password: z.string().min(8),
    role: z.enum(["buyer", "seller", "admin"]).default("buyer"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    password: z.string().min(8),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.email(),
  }),
});

export const verifyPhoneSchema = z.object({
  body: z.object({
    phone: z.string().min(6),
    code: z.string().min(4),
  }),
});
