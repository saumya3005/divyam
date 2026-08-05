"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useCreateEmployee, useUpdateEmployee, Employee } from "../hooks/useEmployees";
import { toast } from "sonner";

const DEPARTMENTS = ["Management", "Operations", "Decoration", "Catering", "Photography", "Logistics", "Finance", "Marketing", "Support"] as const;

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  department: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
  salary: z.number({ invalid_type_error: "Salary must be a number" }).min(0),
  joiningDate: z.string().min(1, "Joining date is required"),
  status: z.enum(["Active", "On Leave", "Terminated"]),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  mode: "create" | "edit" | "view";
}

export function EmployeeDrawerForm({ isOpen, onClose, employee, mode }: EmployeeDrawerFormProps) {
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  const isReadOnly = mode === "view";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      department: "Operations", role: "", salary: 0,
      joiningDate: new Date().toISOString().split("T")[0],
      status: "Active", emergencyContact: "", address: "",
    },
  });

  useEffect(() => {
    if (isOpen && employee && (mode === "edit" || mode === "view")) {
      reset({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "Operations",
        role: employee.role || "",
        salary: employee.salary || 0,
        joiningDate: employee.joiningDate?.split("T")[0] || "",
        status: employee.status || "Active",
        emergencyContact: employee.emergencyContact || "",
        address: employee.address || "",
      });
    } else if (isOpen && mode === "create") {
      reset({
        firstName: "", lastName: "", email: "", phone: "",
        department: "Operations", role: "", salary: 0,
        joiningDate: new Date().toISOString().split("T")[0],
        status: "Active", emergencyContact: "", address: "",
      });
    }
  }, [isOpen, employee, mode, reset]);

  const onSubmit = async (data: EmployeeFormValues) => {
    if (isReadOnly) return onClose();
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Employee added successfully");
      } else if (mode === "edit" && employee) {
        await updateMutation.mutateAsync({ id: employee._id, data });
        toast.success("Employee updated successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save employee");
    }
  };

  const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-brand-surface border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {mode === "create" ? "Add New Employee" : mode === "edit" ? "Edit Employee" : "View Employee"}
                </h2>
                <p className="text-xs text-brand-gray mt-1">
                  {mode === "create" ? "Add a new team member" : `${employee?.firstName} ${employee?.lastName}`}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="employee-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">First Name *</label>
                      <input {...register("firstName")} disabled={isReadOnly} className={inputClass} placeholder="John" />
                      {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Last Name *</label>
                      <input {...register("lastName")} disabled={isReadOnly} className={inputClass} placeholder="Doe" />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Email *</label>
                      <input {...register("email")} disabled={isReadOnly} type="email" className={inputClass} placeholder="john@company.com" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Phone *</label>
                      <input {...register("phone")} disabled={isReadOnly} className={inputClass} placeholder="+91 98765 43210" />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Address</label>
                    <input {...register("address")} disabled={isReadOnly} className={inputClass} placeholder="Full address" />
                  </div>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Emergency Contact</label>
                    <input {...register("emergencyContact")} disabled={isReadOnly} className={inputClass} placeholder="+91 98765 00000" />
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Work Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Work Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Department *</label>
                      <select {...register("department")} disabled={isReadOnly} className={`${inputClass} appearance-none`}>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d} className="bg-brand-surface">{d}</option>
                        ))}
                      </select>
                      {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Role *</label>
                      <input {...register("role")} disabled={isReadOnly} className={inputClass} placeholder="e.g. Event Coordinator" />
                      {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Salary (₹) *</label>
                      <input {...register("salary", { valueAsNumber: true })} disabled={isReadOnly} type="number" min="0" className={inputClass} />
                      {errors.salary && <p className="text-red-400 text-xs mt-1">{errors.salary.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Status</label>
                      <select {...register("status")} disabled={isReadOnly} className={`${inputClass} appearance-none`}>
                        <option value="Active" className="bg-brand-surface">Active</option>
                        <option value="On Leave" className="bg-brand-surface">On Leave</option>
                        <option value="Terminated" className="bg-brand-surface">Terminated</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Joining Date *</label>
                    <input {...register("joiningDate")} disabled={isReadOnly} type="date" className={`${inputClass} scheme-dark`} />
                    {errors.joiningDate && <p className="text-red-400 text-xs mt-1">{errors.joiningDate.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors font-medium">
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button type="submit" form="employee-form" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-brand-gold text-black font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {mode === "create" ? "Add Employee" : "Save Changes"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
