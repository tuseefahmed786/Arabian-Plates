"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveListingSchema = void 0;
const zod_1 = require("zod");
exports.saveListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        listingId: zod_1.z.string().min(1),
    }),
});
