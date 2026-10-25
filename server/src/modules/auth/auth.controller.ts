import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import type { LoginSchema, RegisterSchema } from "./auth.validation.js";
import { getAuthUser } from "../../utils/getAuthUser.js";

export const register = async (req: Request, res: Response) => {
  const data: RegisterSchema = req.body;
  const user = await authService.register(data);
  res.status(201).json({ success: true, data: user });
};

export const login = async (req: Request, res: Response) => {
  const data: LoginSchema = req.body;
  const result = await authService.login(data);
  res.status(200).json({ success: true, data: result });
};

export const getMe = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  res.status(200).json({ success: true, data: user });
};
