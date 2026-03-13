"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const logger_1 = require("../../config/logger");
const api_response_1 = require("../utils/api-response");
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
function notFoundHandler(req, res) {
    res.status(404).json((0, api_response_1.errorResponse)(`Route ${req.originalUrl} not found`));
}
function errorHandler(error, _req, res, next) {
    void next;
    if (error instanceof zod_1.ZodError) {
        return res.status(422).json((0, api_response_1.errorResponse)("Validation failed", error.flatten()));
    }
    if (error instanceof AppError) {
        return res.status(error.statusCode).json((0, api_response_1.errorResponse)(error.message));
    }
    logger_1.logger.error("Unhandled error", error);
    return res.status(500).json((0, api_response_1.errorResponse)("Internal server error"));
}
