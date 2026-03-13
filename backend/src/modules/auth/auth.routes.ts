import { Router } from "express";
import * as controller from "./auth.controller";
import { validateRequest } from "../../common/middleware/validate-request";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
} from "./auth.schema";
import { requireAuth } from "../../common/middleware/auth";

const router = Router();

router.post("/register", validateRequest(registerSchema), controller.register);
router.post("/login", validateRequest(loginSchema), controller.login);
router.post("/logout", requireAuth, controller.logout);
router.post("/refresh-token", validateRequest(refreshSchema), controller.refreshToken);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), controller.forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), controller.resetPassword);
router.post("/verify-email", validateRequest(verifyEmailSchema), controller.verifyEmail);
router.post("/verify-phone", requireAuth, validateRequest(verifyPhoneSchema), controller.verifyPhone);

export default router;
