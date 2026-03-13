"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.refreshTokens = refreshTokens;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.verifyEmail = verifyEmail;
exports.verifyPhone = verifyPhone;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const prisma_1 = require("../../database/prisma");
const error_handler_1 = require("../../common/middleware/error-handler");
function signAccessToken(user) {
    const options = {
        subject: user.id,
        expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign({ role: user.role, email: user.email }, env_1.env.JWT_ACCESS_SECRET, options);
}
function signRefreshToken(user) {
    const options = {
        subject: user.id,
        expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign({ role: user.role, email: user.email }, env_1.env.JWT_REFRESH_SECRET, options);
}
async function register(input) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
        throw new error_handler_1.AppError("Email already in use", 409);
    }
    const passwordHash = await bcryptjs_1.default.hash(input.password, env_1.env.BCRYPT_ROUNDS);
    const user = await prisma_1.prisma.user.create({
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
    const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, env_1.env.BCRYPT_ROUNDS);
    await prisma_1.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    return {
        user,
        accessToken,
        refreshToken,
    };
}
async function login(email, password) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new error_handler_1.AppError("Invalid credentials", 401);
    }
    const passwordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!passwordValid) {
        throw new error_handler_1.AppError("Invalid credentials", 401);
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, env_1.env.BCRYPT_ROUNDS);
    await prisma_1.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    return {
        user,
        accessToken,
        refreshToken,
    };
}
async function logout(userId) {
    await prisma_1.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
}
async function refreshTokens(token) {
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
    const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.refreshTokenHash) {
        throw new error_handler_1.AppError("Unauthorized", 401);
    }
    const valid = await bcryptjs_1.default.compare(token, user.refreshTokenHash);
    if (!valid) {
        throw new error_handler_1.AppError("Invalid refresh token", 401);
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, env_1.env.BCRYPT_ROUNDS);
    await prisma_1.prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
    return { accessToken, refreshToken };
}
async function forgotPassword(email) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { resetToken: "" };
    }
    const resetToken = node_crypto_1.default.randomBytes(24).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken,
            resetTokenExpires,
        },
    });
    return { resetToken };
}
async function resetPassword(token, password) {
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpires: { gt: new Date() },
        },
    });
    if (!user) {
        throw new error_handler_1.AppError("Invalid or expired reset token", 400);
    }
    const passwordHash = await bcryptjs_1.default.hash(password, env_1.env.BCRYPT_ROUNDS);
    await prisma_1.prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            resetToken: null,
            resetTokenExpires: null,
        },
    });
}
async function verifyEmail(email) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new error_handler_1.AppError("User not found", 404);
    }
    await prisma_1.prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } });
}
async function verifyPhone(userId) {
    await prisma_1.prisma.user.update({ where: { id: userId }, data: { isPhoneVerified: true } });
}
