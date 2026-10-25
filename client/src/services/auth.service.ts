import { request } from "../lib/api";
import type {
  AuthResult,
  LoginInput,
  RegisterInput,
  User,
} from "../types/auth";

export const register = async (data: RegisterInput) => {
  return await request<User>("/auth/register", {
    method: "POST",
    body: data,
    skipAuthHandling: true,
  });
};

export const login = async (data: LoginInput) => {
  return await request<AuthResult>("/auth/login", {
    method: "POST",
    body: data,
    skipAuthHandling: true,
  });
};

export const getMe = async () => {
  return await request<User>("/auth/me");
};
