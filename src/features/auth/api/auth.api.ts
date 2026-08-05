import apiClient from "@/core/lib/api";
import { User } from "../store/authStore";

interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
}

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", userData);
    return data;
  },

  getMe: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },
};
