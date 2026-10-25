import { request } from "../lib/api";
import type {
  CreateTaskInput,
  PaginatedTasks,
  Task,
  TaskFilters,
  UpdateTaskInput,
} from "../types/task";

export const getTasks = async (
  filters: TaskFilters,
): Promise<PaginatedTasks> => {
  const params = new URLSearchParams();

  if (filters?.status) params.append("status", filters.status);
  if (filters?.priority) params.append("priority", filters.priority);
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const queryString = params.toString();
  const path = queryString ? `/tasks?${queryString}` : "/tasks/";
  return await request<PaginatedTasks>(path);
};

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  return await request<Task>("/tasks/", { method: "POST", body: data });
};

export const getTaskById = async (id: string): Promise<Task> => {
  return await request<Task>(`/tasks/${id}`);
};

export const updateTask = async (
  id: string,
  data: UpdateTaskInput,
): Promise<Task> => {
  return await request<Task>(`/tasks/${id}`, { method: "PATCH", body: data });
};

export const deleteTask = async (id: string): Promise<Task> => {
  return await request<Task>(`/tasks/${id}`, { method: "DELETE" });
};
