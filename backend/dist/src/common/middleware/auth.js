"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const error_handler_1 = require("./error-handler");
function requireAuth(req, _res, next) {
    const bearer = req.headers.authorization;
    const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : undefined;
    if (!token) {
        throw new error_handler_1.AppError("Unauthorized", 401);
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        req.user = {
            id: payload.sub,
            role: payload.role,
            email: payload.email,
        };
        next();
    }
    catch {
        throw new error_handler_1.AppError("Invalid or expired token", 401);
    }
}
