import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import listingRoutes from "./modules/listings/listings.routes";
import savedListingRoutes from "./modules/saved-listings/saved-listings.routes";
import offerRoutes from "./modules/offers/offers.routes";
import inquiryRoutes from "./modules/inquiries/inquiries.routes";
import userRoutes from "./modules/users/users.routes";
import adminRoutes from "./modules/admin/admin.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import messagesRoutes from "./modules/messages/messages.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import contactRoutes from "./modules/contact/contact.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    data: { timestamp: new Date().toISOString() },
  });
});

router.use("/auth", authRoutes);
router.use("/listings", listingRoutes);
router.use("/saved-listings", savedListingRoutes);
router.use("/offers", offerRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/messages", messagesRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/contact", contactRoutes);

export default router;
