import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { LoginInput, RegisterInput, User } from "../types/auth";
import * as authService from "../services/auth.service";
import { clearToken, getToken, setToken } from "../lib/token";
import { setUnauthorizedHandler } from "../lib/api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (data: LoginInput) => {
    const result = await authService.login(data);
    setToken(result.token);
    setUser(result.user);
  };
  const register = async (data: RegisterInput) => {
    await authService.register(data);
  };
  const logout = async () => {
    clearToken();
    setUser(null);
  };

  useEffect(() => {
    const refreshSession = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const user = await authService.getMe();
        setUser(user);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    setUnauthorizedHandler(logout);
    refreshSession();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading],
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
