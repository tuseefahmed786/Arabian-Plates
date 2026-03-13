import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import apiRoutes from "./routes";
import { errorHandler, notFoundHandler } from "./common/middleware/error-handler";
import { sanitizeInput } from "./common/middleware/sanitize";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(hpp());
app.use(compression());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(env.API_PREFIX, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
