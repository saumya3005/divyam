"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useCreateCustomer, useUpdateCustomer, Customer } from "../hooks/useCustomers";
import { toast } from "sonner";

const customerSchema = z.object({
  companyName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  industry: z.string().optional(),
  status: z.enum(["active", "inactive", "lead"]),
  notes: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  mode: "create" | "edit" | "view";
}

export function CustomerDrawerForm({ isOpen, onClose, customer, mode }: CustomerDrawerFormProps) {
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const isReadOnly = mode === "view";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      companyName: "",
      email: "",
      phone: "",
      industry: "",
      status: "lead",
      notes: "",
      address: { street: "", city: "", state: "", zipCode: "", country: "" },
    },
  });

  useEffect(() => {
    if (isOpen && customer && (mode === "edit" || mode === "view")) {
      reset({
        companyName: customer.companyName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        industry: customer.industry || "",
        status: customer.status || "lead",
        notes: customer.notes || "",
        address: {
          street: customer.address?.street || "",
          city: customer.address?.city || "",
          state: customer.address?.state || "",
          zipCode: customer.address?.zipCode || "",
          country: customer.address?.country || "",
        },
      });
    } else if (isOpen && mode === "create") {
      reset({
        companyName: "",
        email: "",
        phone: "",
        industry: "",
        status: "lead",
        notes: "",
        address: { street: "", city: "", state: "", zipCode: "", country: "" },
      });
    }
  }, [isOpen, customer, mode, reset]);

  const onSubmit = async (data: CustomerFormValues) => {
    if (isReadOnly) return onClose();
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Customer created successfully");
      } else if (mode === "edit" && customer) {
        await updateMutation.mutateAsync({ id: customer._id, data });
        toast.success("Customer updated successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save customer");
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
                  {mode === "create" ? "Add New Customer" : mode === "edit" ? "Edit Customer" : "View Customer"}
                </h2>
                <p className="text-xs text-brand-gray mt-1">
                  {mode === "create" ? "Add a new client to the system" : customer?.email}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Basic Information</h3>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Company / Client Name *</label>
                    <input {...register("companyName")} disabled={isReadOnly} className={inputClass} placeholder="e.g. Sharma Family" />
                    {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Email *</label>
                      <input {...register("email")} disabled={isReadOnly} type="email" className={inputClass} placeholder="client@email.com" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Phone *</label>
                      <input {...register("phone")} disabled={isReadOnly} className={inputClass} placeholder="+91 98765 43210" />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Industry</label>
                      <input {...register("industry")} disabled={isReadOnly} className={inputClass} placeholder="e.g. IT, Healthcare" />
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Status</label>
                      <select {...register("status")} disabled={isReadOnly} className={`${inputClass} appearance-none`}>
                        <option value="lead" className="bg-brand-surface">Lead</option>
                        <option value="active" className="bg-brand-surface">Active</option>
                        <option value="inactive" className="bg-brand-surface">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Address</h3>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Street</label>
                    <input {...register("address.street")} disabled={isReadOnly} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">City</label>
                      <input {...register("address.city")} disabled={isReadOnly} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">State</label>
                      <input {...register("address.state")} disabled={isReadOnly} className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Zip Code</label>
                      <input {...register("address.zipCode")} disabled={isReadOnly} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Country</label>
                      <input {...register("address.country")} disabled={isReadOnly} className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Notes</h3>
                  <textarea {...register("notes")} disabled={isReadOnly} rows={3} className={`${inputClass} resize-none`} placeholder="Internal notes about this customer..." />
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors font-medium">
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button type="submit" form="customer-form" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-brand-gold text-black font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {mode === "create" ? "Create Customer" : "Save Changes"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
