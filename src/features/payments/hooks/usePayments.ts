import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface PaymentItem {
  _id: string;
  bookingId: {
    _id: string;
    serviceType: string;
    bookingDate: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
}

export const useGetPayments = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { payments: PaymentItem[] } }>("/payment", { params });
      return data.data.payments;
    },
  });
};

export const useGetPayment = (id: string) => {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { payment: PaymentItem } }>(`/payment/${id}`);
      return data.data.payment;
    },
    enabled: !!id,
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PaymentItem> }) => {
      const res = await apiClient.patch(`/payment/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/payment/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};
