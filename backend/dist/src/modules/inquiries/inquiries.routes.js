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
const zod_1 = require("zod");
const auth_1 = require("../../common/middleware/auth");
const validate_request_1 = require("../../common/middleware/validate-request");
const inquiries_schema_1 = require("./inquiries.schema");
const controller = __importStar(require("./inquiries.controller"));
const contactSellerSchema = zod_1.z.object({
    body: zod_1.z.object({
        listingId: zod_1.z.string().min(1),
        message: zod_1.z.string().min(3).max(2000),
    }),
});
const router = (0, express_1.Router)();
router.post("/", auth_1.requireAuth, (0, validate_request_1.validateRequest)(inquiries_schema_1.createInquirySchema), controller.createInquiry);
router.get("/seller", auth_1.requireAuth, controller.listInquiriesForSeller);
router.post("/contact-seller", auth_1.requireAuth, (0, validate_request_1.validateRequest)(contactSellerSchema), controller.contactSeller);
exports.default = router;
