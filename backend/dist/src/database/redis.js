"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.connectRedis = connectRedis;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
exports.redis = new ioredis_1.default(env_1.env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
});
exports.redis.on("error", (error) => {
    logger_1.logger.error("Redis connection error", error);
});
async function connectRedis() {
    try {
        if (exports.redis.status === "wait") {
            await exports.redis.connect();
            logger_1.logger.info("Redis connected");
        }
    }
    catch (error) {
        logger_1.logger.warn("Redis unavailable; continuing without cache", error);
    }
}
