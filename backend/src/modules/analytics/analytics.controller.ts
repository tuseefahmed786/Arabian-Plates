import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import * as service from "./analytics.service";

export const trackView = asyncHandler(async (req: Request, res: Response) => {
  await service.trackListingView(String(req.params.listingId), req.user?.id, req.ip, req.get("user-agent"));
  res.status(200).json(successResponse("Listing view tracked", null));
});

export const getListingAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getListingAnalytics(String(req.params.listingId));
  res.status(200).json(successResponse("Listing analytics fetched", data));
});

export const getPopularListings = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await service.getPopularListings();
  res.status(200).json(successResponse("Popular listings fetched", rows));
});
