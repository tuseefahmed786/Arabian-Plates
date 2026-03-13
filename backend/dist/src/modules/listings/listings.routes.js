"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("./listings.controller"));
const auth_1 = require("../../common/middleware/auth");
const rbac_1 = require("../../common/middleware/rbac");
const validate_request_1 = require("../../common/middleware/validate-request");
const upload_1 = require("../../common/middleware/upload");
const listings_schema_1 = require("./listings.schema");
const router = (0, express_1.Router)();
router.get("/", (0, validate_request_1.validateRequest)(listings_schema_1.listingQuerySchema), controller.getListings);
router.get("/featured", controller.getFeaturedListings);
router.get("/trending", controller.getTrendingListings);
router.get("/premium", controller.getPremiumListings);
router.get("/latest", controller.getLatestListings);
router.get("/slug/:slug", controller.getListingBySlug);
router.get("/:id/similar", controller.getSimilarListings);
router.get("/:id", controller.getListingById);
router.post("/", auth_1.requireAuth, (0, validate_request_1.validateRequest)(listings_schema_1.createListingSchema), controller.createListing);
router.post("/upload-placeholder", auth_1.requireAuth, upload_1.upload.single("file"), controller.uploadPlaceholder);
router.post("/:id/report", auth_1.requireAuth, controller.reportListing);
router.patch("/:id", auth_1.requireAuth, (0, validate_request_1.validateRequest)(listings_schema_1.updateListingSchema), controller.updateListing);
router.delete("/:id", auth_1.requireAuth, controller.deleteListing);
router.patch("/:id/featured", auth_1.requireAuth, (0, rbac_1.requireRole)("admin"), controller.markFeatured);
router.patch("/:id/verified", auth_1.requireAuth, (0, rbac_1.requireRole)("admin"), controller.markVerified);
router.patch("/:id/status", auth_1.requireAuth, (0, rbac_1.requireRole)("admin"), controller.changeStatus);
exports.default = router;
