import { NextFunction, Request, Response } from "express";

const requestTimestamps = new Map<string, number>();
const WINDOW_MS = 60 * 1000;

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = req.ip ?? forwardedIp ?? req.socket.remoteAddress ?? "unknown";

  const now = Date.now();
  const lastRequestTime = requestTimestamps.get(ip);

  if (lastRequestTime && now - lastRequestTime < WINDOW_MS) {
    const waitTime = Math.ceil((WINDOW_MS - (now - lastRequestTime)) / 1000);
    res.status(429).json({
      RC: "88",
      RD: `Rate limit exceeded. Try again in ${waitTime} seconds.`,
    });
    return;
  }

  requestTimestamps.set(ip, now);
  next();
}
