import express, { type Express } from "express";
import cors from "cors";

const app: Express = express();

app.use(express.json());
app.use(cors());

//routes
// app.use("/auth", authRoutes)
// app.use("/task", taskRoutes)

//errorHandler
// app.use(errorHandler)

export default app;
