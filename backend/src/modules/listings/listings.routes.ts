import { Router } from "express";
import * as controller from "./listings.controller";
import { requireAuth } from "../../common/middleware/auth";
import { requireRole } from "../../common/middleware/rbac";
import { validateRequest } from "../../common/middleware/validate-request";
import { upload } from "../../common/middleware/upload";
import { createListingSchema, listingQuerySchema, updateListingSchema } from "./listings.schema";

const router = Router();

router.get("/", validateRequest(listingQuerySchema), controller.getListings);
router.get("/featured", controller.getFeaturedListings);
router.get("/trending", controller.getTrendingListings);
router.get("/premium", controller.getPremiumListings);
router.get("/latest", controller.getLatestListings);
router.get("/slug/:slug", controller.getListingBySlug);
router.get("/:id/similar", controller.getSimilarListings);
router.get("/:id", controller.getListingById);

router.post("/", requireAuth, validateRequest(createListingSchema), controller.createListing);
router.post("/upload-placeholder", requireAuth, upload.single("file"), controller.uploadPlaceholder);
router.post("/:id/report", requireAuth, controller.reportListing);
router.patch("/:id", requireAuth, validateRequest(updateListingSchema), controller.updateListing);
router.delete("/:id", requireAuth, controller.deleteListing);

router.patch("/:id/featured", requireAuth, requireRole("admin"), controller.markFeatured);
router.patch("/:id/verified", requireAuth, requireRole("admin"), controller.markVerified);
router.patch("/:id/status", requireAuth, requireRole("admin"), controller.changeStatus);

export default router;
