import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface Customer {
  _id: string;
  companyName: string;
  email: string;
  phone: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  industry?: string;
  status: "active" | "inactive" | "lead";
  notes?: string;
  createdAt: string;
}

export const useGetCustomers = (params?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { customers: Customer[] } }>("/customers", { params });
      return data.data.customers;
    },
  });
};

export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { customer: Customer } }>(`/customers/${id}`);
      return data.data.customer;
    },
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerData: Partial<Customer>) => {
      const { data } = await apiClient.post("/customers", customerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const res = await apiClient.patch(`/customers/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
