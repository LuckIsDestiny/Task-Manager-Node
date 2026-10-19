import type { NextFunction, Request, Response, Express } from "express";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes.js";
import taskRouter from "./modules/tasks/task.routes.js";
import { AppError } from "./utils/AppError.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";

const app: Express = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

if (env.IS_PROD) {
  app.set("trust proxy", 1);
}

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

export default app;
