import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { AuthUser } from "../../types/express.js";
import { AppError } from "../../utils/AppError.js";
import type {
  CreateTaskSchema,
  FilterQuerySchema,
  UpdateTaskSchema,
} from "./task.validation.js";

export const createTask = async (userId: string, data: CreateTaskSchema) => {
  return prisma.task.create({ data: { ...data, userId } });
};

export const getTasks = async (user: AuthUser, filters: FilterQuerySchema) => {
  const where: Prisma.TaskWhereInput = {
    status: filters.status,
    priority: filters.priority,
    ...(user.role !== "ADMIN" && { userId: user.id }),
  };
  const [total, tasks] = await Promise.all([
    prisma.task.count({
      where,
    }),
    prisma.task.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
  ]);

  return {
    tasks,
    total,
    page: filters.page,
    limit: filters.limit,
  };
};

export const getTaskById = async (user: AuthUser, id: string) => {
  const task = await prisma.task.findUnique({
    where: {
      id,
      ...(user.role !== "ADMIN" && { userId: user.id }),
    },
  });
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  return task;
};

export const updateTask = async (
  user: AuthUser,
  id: string,
  data: UpdateTaskSchema,
) => {
  await getTaskById(user, id);
  return prisma.task.update({ where: { id }, data });
};

export const deleteTask = async (user: AuthUser, id: string) => {
  const task = await getTaskById(user, id);
  await prisma.task.delete({ where: { id } });
  return task;
};
