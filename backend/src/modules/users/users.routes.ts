import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth";
import * as controller from "./users.controller";

const router = Router();

router.get("/me", requireAuth, controller.getMe);
router.get("/dashboard/seller", requireAuth, controller.getSellerDashboard);

export default router;
