import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth";
import { successResponse } from "../../common/utils/api-response";
import { asyncHandler } from "../../common/utils/async-handler";
import { prisma } from "../../database/prisma";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await prisma.message.findMany({
      where: {
        OR: [{ senderId: req.user!.id }, { receiverId: req.user!.id }],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.status(200).json(successResponse("Messages fetched", rows));
  }),
);

export default router;
