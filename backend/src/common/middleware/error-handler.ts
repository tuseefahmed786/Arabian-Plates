import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../../config/logger";
import { errorResponse } from "../utils/api-response";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(errorResponse(`Route ${req.originalUrl} not found`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, next: NextFunction) {
  void next;

  if (error instanceof ZodError) {
    return res.status(422).json(errorResponse("Validation failed", error.flatten()));
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json(errorResponse(error.message));
  }

  logger.error("Unhandled error", error);
  return res.status(500).json(errorResponse("Internal server error"));
}
