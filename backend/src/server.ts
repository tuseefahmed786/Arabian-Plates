import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./database/prisma";
import { connectRedis } from "./database/redis";

async function bootstrap() {
  await connectRedis();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
    logger.info(`API base path: ${env.API_PREFIX}`);
    logger.info(`Swagger docs: http://localhost:${env.PORT}/docs`);
  });

  const shutdown = async () => {
    logger.info("Shutting down gracefully...");
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  logger.error("Failed to bootstrap server", error);
  process.exit(1);
});
