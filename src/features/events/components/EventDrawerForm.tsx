"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useCreateEvent, useUpdateEvent, Event } from "../hooks/useEvents";
import { toast } from "sonner";

const EVENT_TYPES = ["conference", "wedding", "corporate", "party", "other"] as const;

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  eventType: z.enum(EVENT_TYPES),
  capacity: z.number({ invalid_type_error: "Capacity must be a number" }).min(1, "Minimum 1 guest"),
  basePrice: z.number({ invalid_type_error: "Price must be a number" }).min(0, "Price cannot be negative"),
  amenities: z.string().transform(str => str.split(",").map(s => s.trim()).filter(Boolean)),
  status: z.enum(["draft", "published", "archived"]),
  coverImage: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  mode: "create" | "edit" | "view";
}

export function EventDrawerForm({ isOpen, onClose, event, mode }: EventDrawerFormProps) {
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  const isReadOnly = mode === "view";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<EventFormValues, 'amenities'> & { amenities: string }>({
    resolver: zodResolver(eventSchema as any),
    defaultValues: {
      title: "",
      description: "",
      eventType: "corporate",
      capacity: 50,
      basePrice: 0,
      amenities: "",
      status: "draft",
      coverImage: "",
    },
  });

  useEffect(() => {
    if (isOpen && event && (mode === "edit" || mode === "view")) {
      reset({
        title: event.title || "",
        description: event.description || "",
        eventType: event.eventType || "corporate",
        capacity: event.capacity || 50,
        basePrice: event.basePrice || 0,
        amenities: event.amenities?.join(", ") || "",
        status: event.status || "draft",
        coverImage: event.coverImage || "",
      });
    } else if (isOpen && mode === "create") {
      reset({
        title: "",
        description: "",
        eventType: "corporate",
        capacity: 50,
        basePrice: 0,
        amenities: "",
        status: "draft",
        coverImage: "",
      });
    }
  }, [isOpen, event, mode, reset]);

  const onSubmit = async (data: any) => {
    if (isReadOnly) return onClose();
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Event created successfully");
      } else if (mode === "edit" && event) {
        await updateMutation.mutateAsync({ id: event._id, data });
        toast.success("Event updated successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save event");
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
                  {mode === "create" ? "Add New Event" : mode === "edit" ? "Edit Event" : "View Event"}
                </h2>
                <p className="text-xs text-brand-gray mt-1">
                  {mode === "create" ? "Create a new event plan" : event?.title}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="event-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Basic Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Event Details</h3>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Event Title *</label>
                    <input {...register("title")} disabled={isReadOnly} className={inputClass} placeholder="Annual Corporate Gala" />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Description *</label>
                    <textarea {...register("description")} disabled={isReadOnly} rows={4} className={`${inputClass} resize-none`} placeholder="Details about the event..." />
                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Event Type *</label>
                      <select {...register("eventType")} disabled={isReadOnly} className={`${inputClass} appearance-none capitalize`}>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t} className="bg-brand-surface capitalize">{t}</option>
                        ))}
                      </select>
                      {errors.eventType && <p className="text-red-400 text-xs mt-1">{errors.eventType.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Status *</label>
                      <select {...register("status")} disabled={isReadOnly} className={`${inputClass} appearance-none capitalize`}>
                        <option value="draft" className="bg-brand-surface">Draft</option>
                        <option value="published" className="bg-brand-surface">Published</option>
                        <option value="archived" className="bg-brand-surface">Archived</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Max Capacity *</label>
                      <input {...register("capacity", { valueAsNumber: true })} disabled={isReadOnly} type="number" min="1" className={inputClass} />
                      {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Base Price (₹) *</label>
                      <input {...register("basePrice", { valueAsNumber: true })} disabled={isReadOnly} type="number" min="0" className={inputClass} />
                      {errors.basePrice && <p className="text-red-400 text-xs mt-1">{errors.basePrice.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Amenities (Comma separated)</label>
                    <input {...register("amenities")} disabled={isReadOnly} className={inputClass} placeholder="WiFi, Projector, Stage..." />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors font-medium">
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button type="submit" form="event-form" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-brand-gold text-black font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {mode === "create" ? "Create Event" : "Save Changes"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
