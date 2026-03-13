"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const prisma_1 = require("./database/prisma");
const redis_1 = require("./database/redis");
async function bootstrap() {
    await (0, redis_1.connectRedis)();
    const server = app_1.default.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Server running on port ${env_1.env.PORT}`);
        logger_1.logger.info(`API base path: ${env_1.env.API_PREFIX}`);
        logger_1.logger.info(`Swagger docs: http://localhost:${env_1.env.PORT}/docs`);
    });
    const shutdown = async () => {
        logger_1.logger.info("Shutting down gracefully...");
        server.close(async () => {
            await prisma_1.prisma.$disconnect();
            process.exit(0);
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
bootstrap().catch((error) => {
    logger_1.logger.error("Failed to bootstrap server", error);
    process.exit(1);
});
