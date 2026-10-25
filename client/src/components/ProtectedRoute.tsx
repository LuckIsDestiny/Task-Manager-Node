import type React from "react";
import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        {/* Tailwind CSS animated spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-sm text-muted-foreground font-medium tracking-tight">
          Loading your workspace...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
};
