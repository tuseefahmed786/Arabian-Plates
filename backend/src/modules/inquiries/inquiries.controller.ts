import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import { AppError } from "../../common/middleware/error-handler";
import * as service from "./inquiries.service";

export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const row = await service.createInquiry(req.user.id, req.body);
  res.status(201).json(successResponse("Inquiry submitted", row));
});

export const listInquiriesForSeller = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const rows = await service.listInquiriesForSeller(req.user.id);
  res.status(200).json(successResponse("Seller inquiries fetched", rows));
});

export const contactSeller = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const row = await service.contactSeller(req.user.id, req.body);
  res.status(201).json(successResponse("Message sent to seller", row));
});
