import { rateLimit } from "express-rate-limit";
import { AppError } from "../utils/AppError.js";
import type { NextFunction } from "express";

export const rateLimiter = (limit: number, skipSuccessfulRequests: boolean) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (_req, _res, next: NextFunction) => {
      next(new AppError("Too many attempts, try again later", 429));
    },
  });
