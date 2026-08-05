import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface BookingType {
  _id: string;
  bookingId?: string;
  customerName: string;
  email: string;
  phone: string;
  serviceType: string;
  serviceId?: string | { _id: string, title: string };
  eventId?: string | { _id: string, title: string };
  bookingDate: string;
  bookingTime: string;
  guests: number;
  address: string;
  notes?: string;
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
  paymentStatus: "Payment Pending" | "Payment Successful" | "Refunded";
  paymentId?: string;
  amount: number;
  advanceAmount?: number;
  remainingAmount?: number;
  createdAt: string;
};

// GET My Bookings (User)
export const useGetMyBookings = () => {
  return useQuery({
    queryKey: ["bookings", "my"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { bookings: BookingType[] } }>("/bookings/my");
      return response.data.data.bookings;
    },
  });
};

// GET All Bookings (Admin)
export const useGetAllBookings = (filters?: Record<string, string>) => {
  return useQuery({
    queryKey: ["bookings", "all", filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters).toString();
      const response = await apiClient.get<{ data: { bookings: BookingType[] } }>(`/bookings?${params}`);
      return response.data.data.bookings;
    },
  });
};

// POST Create Booking (Customer)
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<BookingType, "_id" | "bookingStatus" | "paymentStatus" | "createdAt" | "paymentId">) => {
      const response = await apiClient.post<{ data: { booking: BookingType } }>("/bookings", data);
      return response.data.data.booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

// POST Create Booking (Admin)
export const useCreateBookingAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BookingType>) => {
      const response = await apiClient.post<{ data: { booking: BookingType } }>("/bookings", data);
      return response.data.data.booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "all"] });
    },
  });
};

// PATCH Update Booking Status (Admin)
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingType["bookingStatus"] }) => {
      const response = await apiClient.patch(`/bookings/${id}/status`, { bookingStatus: status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "all"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

// PUT Update Full Booking (Admin)
export const useUpdateBookingAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BookingType> }) => {
      const response = await apiClient.put<{ data: { booking: BookingType } }>(`/bookings/${id}`, data);
      return response.data.data.booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "all"] });
    },
  });
};

// DELETE Booking (Admin)
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/bookings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "all"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
};

// Payment Flow hooks
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async ({ amount, bookingId }: { amount: number; bookingId: string }) => {
      const response = await apiClient.post<{ data: { order: any; mock?: boolean } }>("/payment/create-order", { amount, bookingId });
      return response.data.data;
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/payment/verify", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useGetBookingStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["bookings", "stats"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { stats: any } }>("/bookings/stats");
      return response.data.data.stats;
    },
    enabled,
  });
};
