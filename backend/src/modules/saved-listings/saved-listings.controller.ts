import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import { AppError } from "../../common/middleware/error-handler";
import * as service from "./saved-listings.service";

export const saveListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  await service.saveListing(req.user.id, req.body.listingId);
  res.status(200).json(successResponse("Listing saved", null));
});

export const unsaveListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  await service.unsaveListing(req.user.id, String(req.params.listingId));
  res.status(200).json(successResponse("Listing removed from saved", null));
});

export const getSavedListings = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const rows = await service.getSavedListings(req.user.id);
  res.status(200).json(successResponse("Saved listings fetched", rows));
});
