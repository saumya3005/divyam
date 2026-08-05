import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleAuthSuccess = (data: any, message: string) => {
    // 1. Store the token for Axios Interceptor
    localStorage.setItem("auth_token", data.token);
    
    // 2. Update Zustand global state
    setAuth(data.data.user);
    
    // 3. Show success toast
    toast.success(message);
    
    // 4. Redirect to appropriate dashboard based on role
    if (data.data.user.role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/customer/dashboard");
    }
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => handleAuthSuccess(data, "Welcome back!"),
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => handleAuthSuccess(data, "Account created successfully!"),
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Registration failed");
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
};
