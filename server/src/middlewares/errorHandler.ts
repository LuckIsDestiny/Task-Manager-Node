import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (
    err instanceof SyntaxError &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid JSON Body" });
  }

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ success: false, message: "Record Already Exists" });
    }

    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Record Not Found" });
    }
  }

  console.error(err);

  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
};
