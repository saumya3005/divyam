import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface EventType {
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
  updatedAt: string;
}

export const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; count: number; data: { events: EventType[] } }>("/events");
      return data.data.events;
    },
  });
};

export const useGetPublishedEvents = () => {
  return useQuery({
    queryKey: ["events", "published"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; count: number; data: { events: EventType[] } }>("/events/published");
      return data.data.events;
    },
  });
};

export const useGetEvent = (id: string) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { event: EventType } }>(`/events/${id}`);
      return data.data.event;
    },
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventData: Partial<EventType>) => {
      const { data } = await apiClient.post<{ success: boolean; data: { event: EventType } }>("/events", eventData);
      return data.data.event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EventType> }) => {
      const response = await apiClient.patch<{ success: boolean; data: { event: EventType } }>(`/events/${id}`, data);
      return response.data.data.event;
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
