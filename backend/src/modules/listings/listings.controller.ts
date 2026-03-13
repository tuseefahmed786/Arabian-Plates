import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import * as service from "./listings.service";
import { AppError } from "../../common/middleware/error-handler";

export const getListings = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getListings(req.query as Record<string, unknown>);
  res.status(200).json(
    successResponse("Listings fetched successfully", result.rows, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    }),
  );
});

export const getListingById = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getListingById(String(req.params.id));
  res.status(200).json(successResponse("Listing fetched successfully", result));
});

export const getListingBySlug = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getListingBySlug(String(req.params.slug));
  res.status(200).json(successResponse("Listing fetched successfully", result));
});

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const listing = await service.createListing(req.user.id, req.body);
  res.status(201).json(successResponse("Listing created successfully", listing));
});

export const updateListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const listing = await service.updateListing(String(req.params.id), req.body, req.user);
  res.status(200).json(successResponse("Listing updated successfully", listing));
});

export const deleteListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await service.deleteListing(String(req.params.id), req.user);
  res.status(200).json(successResponse("Listing deleted successfully", null));
});

export const markFeatured = asyncHandler(async (req: Request, res: Response) => {
  const listing = await service.markFeatured(String(req.params.id), Boolean(req.body.featured));
  res.status(200).json(successResponse("Featured status updated", listing));
});

export const markVerified = asyncHandler(async (req: Request, res: Response) => {
  const listing = await service.markVerified(String(req.params.id), Boolean(req.body.verified));
  res.status(200).json(successResponse("Verified status updated", listing));
});

export const changeStatus = asyncHandler(async (req: Request, res: Response) => {
  const listing = await service.changeStatus(
    String(req.params.id),
    req.body.status as "active" | "pending" | "sold" | "rejected" | "archived",
  );
  res.status(200).json(successResponse("Listing status updated", listing));
});

export const getSimilarListings = asyncHandler(async (req: Request, res: Response) => {
  const rows = await service.getSimilarListings(String(req.params.id));
  res.status(200).json(successResponse("Similar listings fetched", rows));
});

export const getTrendingListings = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await service.getTrendingListings();
  res.status(200).json(successResponse("Trending listings fetched", rows));
});

export const getFeaturedListings = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await service.getFeaturedListings();
  res.status(200).json(successResponse("Featured listings fetched", rows));
});

export const getPremiumListings = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await service.getPremiumListings();
  res.status(200).json(successResponse("Premium listings fetched", rows));
});

export const getLatestListings = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await service.getLatestListings();
  res.status(200).json(successResponse("Latest listings fetched", rows));
});

export const uploadPlaceholder = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;

  res.status(200).json(
    successResponse("File received by upload placeholder", {
      originalName: file?.originalname,
      mimeType: file?.mimetype,
      size: file?.size,
      message: "Persist to S3/Cloud storage in production implementation",
    }),
  );
});

export const reportListing = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const row = await service.reportListing(
    String(req.params.id),
    req.user.id,
    String(req.body.reason || "Unspecified report reason"),
    req.body.details ? String(req.body.details) : undefined,
  );

  res.status(201).json(successResponse("Listing report submitted", row));
});
