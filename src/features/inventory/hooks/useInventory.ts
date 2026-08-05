import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  maintenanceStatus: "Good" | "Needs Repair" | "In Maintenance";
  createdAt: string;
}

export const useGetInventory = (params?: { search?: string; category?: string; status?: string }) => {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { items: InventoryItem[] } }>("/inventory", { params });
      return data.data.items;
    },
  });
};

export const useGetInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { item: InventoryItem } }>(`/inventory/${id}`);
      return data.data.item;
    },
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemData: Partial<InventoryItem>) => {
      const { data } = await apiClient.post("/inventory", itemData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InventoryItem> }) => {
      const res = await apiClient.patch(`/inventory/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};
