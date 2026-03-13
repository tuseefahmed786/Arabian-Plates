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
exports.reportListing = exports.uploadPlaceholder = exports.getLatestListings = exports.getPremiumListings = exports.getFeaturedListings = exports.getTrendingListings = exports.getSimilarListings = exports.changeStatus = exports.markVerified = exports.markFeatured = exports.deleteListing = exports.updateListing = exports.createListing = exports.getListingBySlug = exports.getListingById = exports.getListings = void 0;
const async_handler_1 = require("../../common/utils/async-handler");
const api_response_1 = require("../../common/utils/api-response");
const service = __importStar(require("./listings.service"));
const error_handler_1 = require("../../common/middleware/error-handler");
exports.getListings = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await service.getListings(req.query);
    res.status(200).json((0, api_response_1.successResponse)("Listings fetched successfully", result.rows, {
        page: result.page,
        limit: result.limit,
        total: result.total,
    }));
});
exports.getListingById = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await service.getListingById(String(req.params.id));
    res.status(200).json((0, api_response_1.successResponse)("Listing fetched successfully", result));
});
exports.getListingBySlug = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const result = await service.getListingBySlug(String(req.params.slug));
    res.status(200).json((0, api_response_1.successResponse)("Listing fetched successfully", result));
});
exports.createListing = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new error_handler_1.AppError("Unauthorized", 401);
    }
    const listing = await service.createListing(req.user.id, req.body);
    res.status(201).json((0, api_response_1.successResponse)("Listing created successfully", listing));
});
exports.updateListing = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new error_handler_1.AppError("Unauthorized", 401);
    }
    const listing = await service.updateListing(String(req.params.id), req.body, req.user);
    res.status(200).json((0, api_response_1.successResponse)("Listing updated successfully", listing));
});
exports.deleteListing = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new error_handler_1.AppError("Unauthorized", 401);
    }
    await service.deleteListing(String(req.params.id), req.user);
    res.status(200).json((0, api_response_1.successResponse)("Listing deleted successfully", null));
});
exports.markFeatured = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const listing = await service.markFeatured(String(req.params.id), Boolean(req.body.featured));
    res.status(200).json((0, api_response_1.successResponse)("Featured status updated", listing));
});
exports.markVerified = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const listing = await service.markVerified(String(req.params.id), Boolean(req.body.verified));
    res.status(200).json((0, api_response_1.successResponse)("Verified status updated", listing));
});
exports.changeStatus = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const listing = await service.changeStatus(String(req.params.id), req.body.status);
    res.status(200).json((0, api_response_1.successResponse)("Listing status updated", listing));
});
exports.getSimilarListings = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const rows = await service.getSimilarListings(String(req.params.id));
    res.status(200).json((0, api_response_1.successResponse)("Similar listings fetched", rows));
});
exports.getTrendingListings = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const rows = await service.getTrendingListings();
    res.status(200).json((0, api_response_1.successResponse)("Trending listings fetched", rows));
});
exports.getFeaturedListings = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const rows = await service.getFeaturedListings();
    res.status(200).json((0, api_response_1.successResponse)("Featured listings fetched", rows));
});
exports.getPremiumListings = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const rows = await service.getPremiumListings();
    res.status(200).json((0, api_response_1.successResponse)("Premium listings fetched", rows));
});
exports.getLatestListings = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const rows = await service.getLatestListings();
    res.status(200).json((0, api_response_1.successResponse)("Latest listings fetched", rows));
});
exports.uploadPlaceholder = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    res.status(200).json((0, api_response_1.successResponse)("File received by upload placeholder", {
        originalName: file?.originalname,
        mimeType: file?.mimetype,
        size: file?.size,
        message: "Persist to S3/Cloud storage in production implementation",
    }));
});
exports.reportListing = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new error_handler_1.AppError("Unauthorized", 401);
    }
    const row = await service.reportListing(String(req.params.id), req.user.id, String(req.body.reason || "Unspecified report reason"), req.body.details ? String(req.body.details) : undefined);
    res.status(201).json((0, api_response_1.successResponse)("Listing report submitted", row));
});
