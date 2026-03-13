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
exports.getPopularListings = exports.getListingAnalytics = exports.trackView = void 0;
const async_handler_1 = require("../../common/utils/async-handler");
const api_response_1 = require("../../common/utils/api-response");
const service = __importStar(require("./analytics.service"));
exports.trackView = (0, async_handler_1.asyncHandler)(async (req, res) => {
    await service.trackListingView(String(req.params.listingId), req.user?.id, req.ip, req.get("user-agent"));
    res.status(200).json((0, api_response_1.successResponse)("Listing view tracked", null));
});
exports.getListingAnalytics = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await service.getListingAnalytics(String(req.params.listingId));
    res.status(200).json((0, api_response_1.successResponse)("Listing analytics fetched", data));
});
exports.getPopularListings = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const rows = await service.getPopularListings();
    res.status(200).json((0, api_response_1.successResponse)("Popular listings fetched", rows));
});
