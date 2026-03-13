import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../common/middleware/auth";
import { validateRequest } from "../../common/middleware/validate-request";
import { createInquirySchema } from "./inquiries.schema";
import * as controller from "./inquiries.controller";

const contactSellerSchema = z.object({
  body: z.object({
    listingId: z.string().min(1),
    message: z.string().min(3).max(2000),
  }),
});

const router = Router();

router.post("/", requireAuth, validateRequest(createInquirySchema), controller.createInquiry);
router.get("/seller", requireAuth, controller.listInquiriesForSeller);
router.post("/contact-seller", requireAuth, validateRequest(contactSellerSchema), controller.contactSeller);

export default router;
