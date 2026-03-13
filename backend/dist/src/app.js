"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const swagger_1 = require("./config/swagger");
const routes_1 = __importDefault(require("./routes"));
const error_handler_1 = require("./common/middleware/error-handler");
const sanitize_1 = require("./common/middleware/sanitize");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_ORIGIN,
    credentials: true,
}));
app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use((0, hpp_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(sanitize_1.sanitizeInput);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use(env_1.env.API_PREFIX, routes_1.default);
app.use(error_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
exports.default = app;
