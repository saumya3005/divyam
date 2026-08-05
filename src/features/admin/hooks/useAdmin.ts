import { useQuery } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";
import { BookingType } from "@/features/bookings/hooks/useBookings";

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  rejectedBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalServices: number;
  revenueChart: any[];
  statusChart: any[];
  topServices?: any[];
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentBookings: BookingType[];
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export const useGetAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: AdminDashboardData }>("/admin/stats");
      return data.data;
    },
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; count: number; data: { users: User[] } }>("/admin/users");
      return data.data.users;
    },
  });
};

export const useGetAllBookingsAdmin = () => {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; count: number; data: { bookings: BookingType[] } }>("/admin/bookings");
      return data.data.bookings;
    },
  });
};

export const useGetEmployees = () => {
  return useQuery({
    queryKey: ["admin", "employees"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: any[] }>("/extra/employees");
      return data.data;
    },
  });
};

export const useGetInventory = () => {
  return useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: any[] }>("/extra/inventory");
      return data.data;
    },
  });
};

export const useGetApprovals = () => {
  return useQuery({
    queryKey: ["admin", "approvals"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: any[] }>("/extra/approvals");
      return data.data;
    },
  });
};

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; count: number; data: { notifications: any[] } }>("/admin/notifications");
      return data.data.notifications;
    },
  });
};
