import api, { setStoredToken, removeStoredToken } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "../types/index";

const USER_KEY = "ctf_user";

export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user:", error);
  }
};

export const removeStoredUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Failed to remove user:", error);
  }
};

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/signin", credentials);
    const { token, user } = response.data;

    // Store token and user
    setStoredToken(token);
    setStoredUser(user);

    return response.data;
  },

  async signup(data: SignupRequest): Promise<{ message: string }> {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  logout(): void {
    removeStoredToken();
    removeStoredUser();
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem("ctf_auth_token");
    const user = getStoredUser();
    return !!(token && user);
  },

  getCurrentUser(): User | null {
    return getStoredUser();
  },

  hasRole(role: string): boolean {
    const user = getStoredUser();
    return user?.roles?.includes(role) ?? false;
  },

  isAdmin(): boolean {
    return this.hasRole("ROLE_ADMIN");
  },
};

export default authService;
