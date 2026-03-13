"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../common/middleware/auth");
const api_response_1 = require("../../common/utils/api-response");
const async_handler_1 = require("../../common/utils/async-handler");
const prisma_1 = require("../../database/prisma");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, (0, async_handler_1.asyncHandler)(async (req, res) => {
    const rows = await prisma_1.prisma.message.findMany({
        where: {
            OR: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
    res.status(200).json((0, api_response_1.successResponse)("Messages fetched", rows));
}));
exports.default = router;
