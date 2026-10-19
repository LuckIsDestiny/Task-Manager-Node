import { z } from "zod";
import { Priority, TaskStatus } from "../../generated/prisma/enums.js";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500).optional(),
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(Priority).optional(),
  dueDate: z.string().pipe(z.coerce.date()).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(500).nullable().optional(),
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(Priority).optional(),
    dueDate: z.string().pipe(z.coerce.date()).nullable().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Input at least one term for updating",
  );

export const idParamSchema = z.object({
  id: z.uuid(),
});

export const filterQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(Priority).optional(),
  page: z.coerce.number().min(1).default(1).pipe(z.int()),
  limit: z.coerce.number().min(1).max(100).default(10).pipe(z.int()),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type IdParamSchema = z.infer<typeof idParamSchema>;
export type FilterQuerySchema = z.infer<typeof filterQuerySchema>;
