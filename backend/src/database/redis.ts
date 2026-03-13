import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "../config/logger";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 2,
  lazyConnect: true,
});

redis.on("error", (error) => {
  logger.error("Redis connection error", error);
});

export async function connectRedis() {
  try {
    if (redis.status === "wait") {
      await redis.connect();
      logger.info("Redis connected");
    }
  } catch (error) {
    logger.warn("Redis unavailable; continuing without cache", error);
  }
}
