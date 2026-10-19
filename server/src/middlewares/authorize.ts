import { NextFunction, Request, Response } from "express";
import type { Role } from "../generated/prisma/enums.js";
import { AppError } from "../utils/AppError.js";

export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return next(new AppError("Unauthorized", 401));
    }
    if (!roles.includes(userRole)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};
