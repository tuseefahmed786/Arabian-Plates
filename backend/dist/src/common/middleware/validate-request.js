"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
function validateRequest(schema) {
    return (req, _res, next) => {
        const payload = {
            body: req.body,
            query: req.query,
            params: req.params,
        };
        schema.parse(payload);
        next();
    };
}
