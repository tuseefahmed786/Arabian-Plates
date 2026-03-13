import { Request, Response } from "express";
import { AppError } from "../../common/middleware/error-handler";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import * as service from "./users.service";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const user = await service.getMe(req.user.id);
  res.status(200).json(successResponse("User profile fetched", user));
});

export const getSellerDashboard = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const data = await service.getSellerDashboard(req.user.id);
  res.status(200).json(successResponse("Seller dashboard data fetched", data));
});
