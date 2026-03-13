import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import { createOfferSchema, updateOfferStatusSchema } from "./offers.schema";
import * as controller from "./offers.controller";

const router = Router();

router.post("/", requireAuth, validateRequest(createOfferSchema), controller.makeOffer);
router.get("/received", requireAuth, controller.getOffersReceived);
router.get("/sent", requireAuth, controller.getOffersSent);
router.patch("/:id/status", requireAuth, validateRequest(updateOfferStatusSchema), controller.updateOfferStatus);

export default router;
