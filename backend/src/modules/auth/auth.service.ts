import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../../config/env";
import { prisma } from "../../database/prisma";
import { AppError } from "../../common/middleware/error-handler";

function signAccessToken(user: { id: string; role: UserRole; email: string }) {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ role: user.role, email: user.email }, env.JWT_ACCESS_SECRET, options);
}

function signRefreshToken(user: { id: string; role: UserRole; email: string }) {
  const options: SignOptions = {
    subject: user.id,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign({ role: user.role, email: user.email }, env.JWT_REFRESH_SECRET, options);
}

export async function register(input: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: input.role,
      sellerProfile: input.role === "seller" ? { create: { verified: false } } : undefined,
      adminProfile: input.role === "admin" ? { create: { permissions: ["all"] } } : undefined,
    },
  });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenHash = await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS);

  await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenHash = await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS);

  await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export async function logout(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
}

export async function refreshTokens(token: string) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; role: UserRole; email: string };
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user || !user.refreshTokenHash) {
    throw new AppError("Unauthorized", 401);
  }

  const valid = await bcrypt.compare(token, user.refreshTokenHash);
  if (!valid) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshTokenHash = await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS);

  await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });

  return { accessToken, refreshToken };
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { resetToken: "" };
  }

  const resetToken = crypto.randomBytes(24).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpires,
    },
  });

  return { resetToken };
}

export async function resetPassword(token: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpires: null,
    },
  });
}

export async function verifyEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } });
}

export async function verifyPhone(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { isPhoneVerified: true } });
}
