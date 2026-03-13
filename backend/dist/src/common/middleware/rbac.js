"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const error_handler_1 = require("./error-handler");
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new error_handler_1.AppError("Unauthorized", 401);
        }
        if (!roles.includes(req.user.role)) {
            throw new error_handler_1.AppError("Forbidden", 403);
        }
        next();
    };
}
