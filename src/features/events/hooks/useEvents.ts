import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: "conference" | "wedding" | "corporate" | "party" | "other";
  capacity: number;
  basePrice: number;
  amenities: string[];
  status: "draft" | "published" | "archived";
  coverImage?: string;
  createdAt: string;
}

export const useGetEvents = (params?: { search?: string; status?: string; eventType?: string }) => {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { events: Event[] } }>("/events", { params });
      return data.data.events;
    },
  });
};

export const useGetEvent = (id: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { event: Event } }>(`/events/${id}`);
      return data.data.event;
    },
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      const { data } = await apiClient.post("/events", eventData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      const res = await apiClient.patch(`/events/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
