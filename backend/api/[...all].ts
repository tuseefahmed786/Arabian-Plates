import app from "../src/app";
import { connectRedis } from "../src/database/redis";

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    initialized = true;
    await connectRedis();
  }

  return app(req, res);
}
