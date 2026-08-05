"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useCreateService, useUpdateService, Service } from "../hooks/useServices";
import { toast } from "sonner";

const CATEGORIES = [
  "Wedding",
  "Corporate",
  "Birthday",
  "Photography",
  "Decoration",
  "Catering",
  "Concert",
  "Exhibition",
] as const;

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(CATEGORIES, { required_error: "Category is required" }),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(0, "Price cannot be negative"),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().min(1, "Location is required"),
  maxGuests: z.number().min(1, "Capacity must be at least 1"),
  availability: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  mode: "create" | "edit" | "view";
}

export function ServiceDrawerForm({ isOpen, onClose, service, mode }: ServiceDrawerFormProps) {
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const isReadOnly = mode === "view";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Wedding",
      price: 0,
      duration: "Full Day",
      location: "",
      maxGuests: 100,
      availability: true,
    },
  });

  useEffect(() => {
    if (isOpen && service && (mode === "edit" || mode === "view")) {
      reset({
        title: service.title || "",
        description: service.description || "",
        category: (service.category as any) || "Wedding",
        price: service.price || 0,
        duration: service.duration || "Full Day",
        location: service.location || "",
        maxGuests: service.maxGuests || 100,
        availability: service.availability ?? true,
      });
    } else if (isOpen && mode === "create") {
      reset({
        title: "",
        description: "",
        category: "Wedding",
        price: 0,
        duration: "Full Day",
        location: "",
        maxGuests: 100,
        availability: true,
      });
    }
  }, [isOpen, service, mode, reset]);

  const onSubmit = async (data: ServiceFormValues) => {
    if (isReadOnly) return onClose();

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Service created successfully");
      } else if (mode === "edit" && service) {
        await updateMutation.mutateAsync({ id: service._id, data });
        toast.success("Service updated successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save service");
    }
  };

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
                  {mode === "create" ? "Add New Service" : mode === "edit" ? "Edit Service" : "View Service"}
                </h2>
                <p className="text-xs text-brand-gray mt-1">
                  {mode === "create" ? "Create a new package or service offering" : service?._id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Basic Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Basic Details</h3>
                  
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Service Title *</label>
                    <input
                      {...register("title")}
                      disabled={isReadOnly}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                      placeholder="e.g. Premium Wedding Package"
                    />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Description *</label>
                    <textarea
                      {...register("description")}
                      disabled={isReadOnly}
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 resize-none"
                      placeholder="Describe what this service includes..."
                    />
                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Category *</label>
                      <select
                        {...register("category")}
                        disabled={isReadOnly}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 appearance-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-brand-surface">{c}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Availability</label>
                      <div className="flex items-center h-10.5">
                        <label className="flex items-center cursor-pointer relative">
                          <input type="checkbox" className="sr-only peer" {...register("availability")} disabled={isReadOnly} />
                          <div className="w-10 h-6 bg-black/40 rounded-full border border-white/10 peer-checked:bg-brand-gold/20 peer-checked:border-brand-gold/50 transition-colors"></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
                        </label>
                        <div className="ml-3 text-sm text-brand-gray">Active</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Operations & Pricing */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Operations & Pricing</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Price (₹) *</label>
                      <input
                        {...register("price", { valueAsNumber: true })}
                        disabled={isReadOnly}
                        type="number"
                        min="0"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                      />
                      {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Capacity (Guests) *</label>
                      <input
                        {...register("maxGuests", { valueAsNumber: true })}
                        disabled={isReadOnly}
                        type="number"
                        min="1"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                      />
                      {errors.maxGuests && <p className="text-red-400 text-xs mt-1">{errors.maxGuests.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Duration *</label>
                      <input
                        {...register("duration")}
                        disabled={isReadOnly}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                        placeholder="e.g. 4 Hours, Full Day"
                      />
                      {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Location/Venue *</label>
                      <input
                        {...register("location")}
                        disabled={isReadOnly}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                        placeholder="e.g. Grand Hall, Outdoor"
                      />
                      {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors font-medium"
              >
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button
                  type="submit"
                  form="service-form"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-brand-gold text-black font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {mode === "create" ? "Create Service" : "Save Changes"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
