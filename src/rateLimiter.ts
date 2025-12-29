import { RateLimiterRedis } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";
import { redis } from "./lib/redis";

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rl",
  points: 100,
  duration: 60,
  blockDuration: 60,
});

export async function rateLimiterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const key =
      req.ip ??
      req.socket.remoteAddress ??
      "unknown";

    await rateLimiter.consume(key);
    next();
  } catch {
    return res.status(429).json({
      message: "Muitas requisições. Tente novamente em instantes.",
    });
  }
}
