import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/core/lib/api";

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  department: string;
  phone: string;
  email: string;
  salary: number;
  role: string;
  joiningDate: string;
  status: "Active" | "On Leave" | "Terminated";
  emergencyContact?: string;
  address?: string;
  createdAt: string;
}

export const useGetEmployees = (params?: { search?: string; status?: string; department?: string }) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { employees: Employee[] } }>("/employees", { params });
      return data.data.employees;
    },
  });
};

export const useGetEmployee = (id: string) => {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { employee: Employee } }>(`/employees/${id}`);
      return data.data.employee;
    },
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeData: Partial<Employee>) => {
      const { data } = await apiClient.post("/employees", employeeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Employee> }) => {
      const res = await apiClient.patch(`/employees/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
