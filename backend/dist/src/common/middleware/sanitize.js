"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = sanitizeInput;
function deepSanitize(value) {
    if (typeof value === "string") {
        return value.replace(/[<>]/g, "");
    }
    if (Array.isArray(value)) {
        return value.map(deepSanitize);
    }
    if (value && typeof value === "object") {
        return Object.entries(value).reduce((acc, [key, val]) => {
            acc[key] = deepSanitize(val);
            return acc;
        }, {});
    }
    return value;
}
function sanitizeInput(req, _res, next) {
    req.body = deepSanitize(req.body);
    // Express 5 exposes req.query with a getter-only property.
    // Mutate its keys in-place instead of reassigning req.query.
    if (req.query && typeof req.query === "object") {
        for (const [key, value] of Object.entries(req.query)) {
            req.query[key] = deepSanitize(value);
        }
    }
    next();
}
