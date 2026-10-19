import type { Request } from "express";
import type { AuthUser } from "../types/express.js";
import { AppError } from "./AppError.js";

export const getAuthUser = (req: Request): AuthUser => {
  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }
  return user;
};
