import { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/async-handler";
import { successResponse } from "../../common/utils/api-response";
import * as authService from "./auth.service";
import { AppError } from "../../common/middleware/error-handler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json(successResponse("Registered successfully", result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.status(200).json(successResponse("Logged in successfully", result));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await authService.logout(req.user.id);
  res.status(200).json(successResponse("Logged out successfully", null));
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.body.refreshToken;
  if (!token) {
    throw new AppError("Refresh token is required", 400);
  }

  const result = await authService.refreshTokens(token);
  res.status(200).json(successResponse("Token refreshed successfully", result));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json(successResponse("If account exists, reset instructions generated", result));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(200).json(successResponse("Password reset successfully", null));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.body.email);
  res.status(200).json(successResponse("Email verified", null));
});

export const verifyPhone = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await authService.verifyPhone(req.user.id);
  res.status(200).json(successResponse("Phone verified (placeholder)", null));
});
