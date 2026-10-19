import express from "express";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import {
  createTaskSchema,
  filterQuerySchema,
  idParamSchema,
  updateTaskSchema,
} from "./task.validation.js";
import * as taskController from "./task.controller.js";

const router = express.Router();

router.use(auth);

router.post("/", validate(createTaskSchema), taskController.createTask);
router.get("/", validate(filterQuerySchema, "query"), taskController.getTasks);
router.get(
  "/:id",
  validate(idParamSchema, "params"),
  taskController.getTaskById,
);
router.patch(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateTaskSchema),
  taskController.updateTask,
);
router.delete(
  "/:id",
  validate(idParamSchema, "params"),
  taskController.deleteTask,
);

export default router;
