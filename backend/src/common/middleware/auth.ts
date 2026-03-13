import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "./error-handler";

interface TokenPayload {
  sub: string;
  role: "buyer" | "seller" | "admin";
  email: string;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const bearer = req.headers.authorization;
  const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : undefined;

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}
