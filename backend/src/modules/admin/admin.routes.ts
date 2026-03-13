import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth";
import { requireRole } from "../../common/middleware/rbac";
import * as controller from "./admin.controller";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", controller.getAdminDashboard);
router.get("/users", controller.manageUsers);
router.get("/reports", controller.manageReports);
router.patch("/listings/:listingId/approve", controller.approveListing);
router.patch("/listings/:listingId/reject", controller.rejectListing);
router.delete("/listings/:listingId", controller.removeListing);
router.patch("/listings/:listingId/featured", controller.setFeatured);
router.post("/listings/:listingId/moderate", controller.moderateSuspiciousListing);

export default router;
