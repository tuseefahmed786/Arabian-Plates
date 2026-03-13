"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const listings_routes_1 = __importDefault(require("./modules/listings/listings.routes"));
const saved_listings_routes_1 = __importDefault(require("./modules/saved-listings/saved-listings.routes"));
const offers_routes_1 = __importDefault(require("./modules/offers/offers.routes"));
const inquiries_routes_1 = __importDefault(require("./modules/inquiries/inquiries.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const messages_routes_1 = __importDefault(require("./modules/messages/messages.routes"));
const notifications_routes_1 = __importDefault(require("./modules/notifications/notifications.routes"));
const contact_routes_1 = __importDefault(require("./modules/contact/contact.routes"));
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is healthy",
        data: { timestamp: new Date().toISOString() },
    });
});
router.use("/auth", auth_routes_1.default);
router.use("/listings", listings_routes_1.default);
router.use("/saved-listings", saved_listings_routes_1.default);
router.use("/offers", offers_routes_1.default);
router.use("/inquiries", inquiries_routes_1.default);
router.use("/users", users_routes_1.default);
router.use("/admin", admin_routes_1.default);
router.use("/analytics", analytics_routes_1.default);
router.use("/messages", messages_routes_1.default);
router.use("/notifications", notifications_routes_1.default);
router.use("/contact", contact_routes_1.default);
exports.default = router;
