import { useCallback, useState, type ReactNode } from "react";
import type { LoginRequest, SignupRequest, User } from "../types";
import { authService, getStoredUser } from "../services";
import { AuthContext, type AuthContextType } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  }, []);

  const signup = useCallback(async (data: SignupRequest) => {
    return await authService.signup(data);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.includes("ROLE_ADMIN") ?? false;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
