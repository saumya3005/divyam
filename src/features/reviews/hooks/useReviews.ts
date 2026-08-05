import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface ReviewItem {
  _id: string;
  serviceId?: {
    _id: string;
    title: string;
    category: string;
  };
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  customerName: string;
  rating: number;
  comment: string;
  status: "Published" | "Hidden";
  createdAt: string;
}

export const useGetReviews = (filters?: { search?: string; status?: string }) => {
  return useQuery({
    queryKey: ["admin", "reviews", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.status) params.append("status", filters.status);
      
      const { data } = await apiClient.get<{ success: boolean; data: { reviews: ReviewItem[] } }>(`/reviews?${params.toString()}`);
      return data.data.reviews;
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewData: Partial<ReviewItem>) => {
      const { data } = await apiClient.post("/reviews", reviewData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<ReviewItem> & { id: string }) => {
      const { data } = await apiClient.patch(`/reviews/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
};
