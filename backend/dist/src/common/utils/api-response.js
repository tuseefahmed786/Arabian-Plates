"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(message, data, meta) {
    return {
        success: true,
        message,
        data,
        ...(meta ? { meta } : {}),
    };
}
function errorResponse(message, details) {
    return {
        success: false,
        message,
        ...(details ? { details } : {}),
    };
}
