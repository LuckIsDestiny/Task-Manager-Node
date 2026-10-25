import type { LoginInput, RegisterInput, User } from "../types/auth";
import { createContext } from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
