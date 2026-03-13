import { Router } from "express";
import * as controller from "./analytics.controller";

const router = Router();

router.post("/views/:listingId", controller.trackView);
router.get("/listings/:listingId", controller.getListingAnalytics);
router.get("/popular", controller.getPopularListings);

export default router;
