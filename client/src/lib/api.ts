import { ApiError } from "../utils/ApiError";
import { getToken, clearToken } from "./token";

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL not set");
}

export const Methods = ["GET", "POST", "PATCH", "DELETE"] as const;
export type Method = (typeof Methods)[number];

export type Options = {
  method?: Method;
  body?: unknown;
  skipAuthHandling?: boolean;
};

export type ErrorResponse = {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
};

export const request = async <T>(
  path: string,
  options: Options = {},
): Promise<T> => {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {};
  if (options.body !== undefined) {
    headers["Content-Type"] = `application/json`;
  }
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server", 0);
  }
  if (!response.ok) {
    const statusCode = response.status;
    if (statusCode === 401 && !options.skipAuthHandling) {
      clearToken();
      onUnauthorized?.();
    }
    let data: ErrorResponse | null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    if (typeof data?.message !== "string") {
      throw new ApiError(`Request failed (${statusCode})`, statusCode);
    }
    throw new ApiError(data.message, statusCode, data?.errors);
  }
  if (response.status === 204) {
    return null as T;
  }
  const responseBody = await response.json();
  return responseBody.data;
};
