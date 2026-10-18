import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";

export type ParamFormat = "body" | "query" | "params";

export const validate = (
  schema: z.ZodType,
  format: ParamFormat = "body",
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (format === "query") {
        res.locals[format] = schema.parse(req[format]);
      } else {
        req[format] = schema.parse(req[format]);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
