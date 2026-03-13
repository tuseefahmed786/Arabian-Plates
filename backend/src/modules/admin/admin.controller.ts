import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import * as service from "./admin.service";

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const data = await service.getDashboard();
  res.status(200).json(successResponse("Admin dashboard data fetched", data));
});

export const approveListing = asyncHandler(async (req: Request, res: Response) => {
  const row = await service.approveListing(String(req.params.listingId));
  res.status(200).json(successResponse("Listing approved", row));
});

export const rejectListing = asyncHandler(async (req: Request, res: Response) => {
  const row = await service.rejectListing(String(req.params.listingId));
  res.status(200).json(successResponse("Listing rejected", row));
});

export const removeListing = asyncHandler(async (req: Request, res: Response) => {
  await service.removeListing(String(req.params.listingId));
  res.status(200).json(successResponse("Listing removed", null));
});

export const manageUsers = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await service.manageUsers();
  res.status(200).json(successResponse("Users fetched", rows));
});

export const manageReports = asyncHandler(async (_req: Request, res: Response) => {
  const rows = await service.manageReports();
  res.status(200).json(successResponse("Reports fetched", rows));
});

export const setFeatured = asyncHandler(async (req: Request, res: Response) => {
  const row = await service.setFeatured(String(req.params.listingId), Boolean(req.body.featured));
  res.status(200).json(successResponse("Featured status updated", row));
});

export const moderateSuspiciousListing = asyncHandler(async (req: Request, res: Response) => {
  const row = await service.moderateSuspiciousListing(
    String(req.params.listingId),
    req.body.reason || "Suspicious activity",
  );
  res.status(201).json(successResponse("Listing flagged", row));
});
