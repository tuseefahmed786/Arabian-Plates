import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import { saveListingSchema } from "./saved-listings.schema";
import * as controller from "./saved-listings.controller";

const router = Router();

router.post("/", requireAuth, validateRequest(saveListingSchema), controller.saveListing);
router.delete("/:listingId", requireAuth, controller.unsaveListing);
router.get("/", requireAuth, controller.getSavedListings);

export default router;
