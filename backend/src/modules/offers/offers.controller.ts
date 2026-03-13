import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import { AppError } from "../../common/middleware/error-handler";
import * as service from "./offers.service";

export const makeOffer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const row = await service.makeOffer(req.user.id, req.body);
  res.status(201).json(successResponse("Offer submitted", row));
});

export const getOffersReceived = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const rows = await service.getOffersReceived(req.user.id);
  res.status(200).json(successResponse("Offers received fetched", rows));
});

export const getOffersSent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const rows = await service.getOffersSent(req.user.id);
  res.status(200).json(successResponse("Offers sent fetched", rows));
});

export const updateOfferStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const row = await service.updateOfferStatus(req.user.id, String(req.params.id), req.body.status);
  res.status(200).json(successResponse("Offer status updated", row));
});
