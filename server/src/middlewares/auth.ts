import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types/express.js";
import { prisma } from "../lib/prisma.js";

export const auth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.split(" ")[1];

  let decoded: AuthUser;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, role: true },
  });
  if (!user) {
    return next(new AppError("Unauthorized", 401));
  }

  req.user = { id: user.id, role: user.role };
  next();
};
