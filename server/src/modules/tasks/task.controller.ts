import type { Request, Response } from "express";
import * as taskService from "./task.service.js";
import type {
  CreateTaskSchema,
  FilterQuerySchema,
  IdParamSchema,
  UpdateTaskSchema,
} from "./task.validation.js";
import { getAuthUser } from "../../utils/getAuthUser.js";

export const createTask = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const data: CreateTaskSchema = req.body;
  const task = await taskService.createTask(user.id, data);
  res.status(201).json({ success: true, data: task });
};

export const getTasks = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const filters: FilterQuerySchema = res.locals.query;
  const task = await taskService.getTasks(user, filters);
  res.status(200).json({ success: true, data: task });
};

export const getTaskById = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { id } = req.params as IdParamSchema;
  const result = await taskService.getTaskById(user, id);
  res.status(200).json({ success: true, data: result });
};

export const updateTask = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { id } = req.params as IdParamSchema;
  const data: UpdateTaskSchema = req.body;
  const task = await taskService.updateTask(user, id, data);
  res.status(200).json({ success: true, data: task });
};

export const deleteTask = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { id } = req.params as IdParamSchema;
  const task = await taskService.deleteTask(user, id);
  res.status(200).json({ success: true, data: task });
};
