import express from "express";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import * as authController from "./auth.controller.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import { auth } from "../../middlewares/auth.js";

const router = express.Router();

router.post(
  "/register",
  rateLimiter(25, false),
  validate(registerSchema),
  authController.register,
);

router.post(
  "/login",
  rateLimiter(10, true),
  validate(loginSchema),
  authController.login,
);

router.get("/me", auth, authController.getMe);

export default router;
