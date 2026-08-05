import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  duration: string;
  availability: boolean;
  location: string;
  features: string[];
  maxGuests: number;
  createdAt: string;
}

export const useGetServices = (params?: { category?: string; available?: boolean }) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { services: Service[] } }>("/services", { params });
      return data.data.services;
    },
  });
};

export const useGetService = (id: string) => {
  return useQuery({
    queryKey: ["services", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { service: Service } }>(`/services/${id}`);
      return data.data.service;
    },
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (serviceData: Partial<Service>) => {
      const { data } = await apiClient.post("/services", serviceData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Service> }) => {
      const res = await apiClient.patch(`/services/${id}`, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", id] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
