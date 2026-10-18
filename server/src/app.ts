import express, {
  NextFunction,
  Request,
  Response,
  type Express,
} from "express";
import cors from "cors";
import { AppError } from "./utils/AppError.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { prisma } from "./lib/prisma.js";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get("/db-test", async (_req: Request, res: Response) => {
  const count = await prisma.user.count();
  res.status(200).json({ success: true, count });
});

//routes
// app.use("/auth", authRoutes)
// app.use("/task", taskRoutes)

app.use((req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(`Route not found: ${req.originalUrl}`, 404);
});

app.use(errorHandler);

export default app;
