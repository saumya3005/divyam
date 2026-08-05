"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useCreateInventoryItem, useUpdateInventoryItem, InventoryItem } from "../hooks/useInventory";
import { toast } from "sonner";

const INVENTORY_CATEGORIES = ["Electronics", "Furniture", "Decor", "Catering", "Lighting", "Audio", "Miscellaneous"] as const;

const inventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(INVENTORY_CATEGORIES),
  quantity: z.number({ invalid_type_error: "Quantity must be a number" }).min(0, "Quantity cannot be negative"),
  availableQuantity: z.number({ invalid_type_error: "Available quantity must be a number" }).min(0, "Cannot be negative"),
  maintenanceStatus: z.enum(["Good", "Needs Repair", "In Maintenance"]),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  mode: "create" | "edit" | "view";
}

export function InventoryDrawerForm({ isOpen, onClose, item, mode }: InventoryDrawerFormProps) {
  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();

  const isReadOnly = mode === "view";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      category: "Furniture",
      quantity: 1,
      availableQuantity: 1,
      maintenanceStatus: "Good",
    },
  });

  useEffect(() => {
    if (isOpen && item && (mode === "edit" || mode === "view")) {
      reset({
        name: item.name || "",
        category: item.category as any || "Furniture",
        quantity: item.quantity || 0,
        availableQuantity: item.availableQuantity || 0,
        maintenanceStatus: item.maintenanceStatus || "Good",
      });
    } else if (isOpen && mode === "create") {
      reset({
        name: "",
        category: "Furniture",
        quantity: 1,
        availableQuantity: 1,
        maintenanceStatus: "Good",
      });
    }
  }, [isOpen, item, mode, reset]);

  const onSubmit = async (data: InventoryFormValues) => {
    if (isReadOnly) return onClose();
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Inventory item added successfully");
      } else if (mode === "edit" && item) {
        await updateMutation.mutateAsync({ id: item._id, data });
        toast.success("Inventory item updated successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save inventory item");
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
                  {mode === "create" ? "Add Inventory Item" : mode === "edit" ? "Edit Inventory Item" : "View Inventory Item"}
                </h2>
                <p className="text-xs text-brand-gray mt-1">
                  {mode === "create" ? "Add new equipment/assets" : item?.name}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="inventory-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Item Details</h3>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Item Name *</label>
                    <input {...register("name")} disabled={isReadOnly} className={inputClass} placeholder="e.g. DJ Speakers Set" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Category *</label>
                    <select {...register("category")} disabled={isReadOnly} className={`${inputClass} appearance-none`}>
                      {INVENTORY_CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-brand-surface">{c}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Stock & Status */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Stock & Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Total Quantity *</label>
                      <input {...register("quantity", { valueAsNumber: true })} disabled={isReadOnly} type="number" min="0" className={inputClass} />
                      {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-brand-gray mb-1.5">Available Quantity *</label>
                      <input {...register("availableQuantity", { valueAsNumber: true })} disabled={isReadOnly} type="number" min="0" className={inputClass} />
                      {errors.availableQuantity && <p className="text-red-400 text-xs mt-1">{errors.availableQuantity.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Maintenance Status *</label>
                    <select {...register("maintenanceStatus")} disabled={isReadOnly} className={`${inputClass} appearance-none`}>
                      <option value="Good" className="bg-brand-surface">Good</option>
                      <option value="Needs Repair" className="bg-brand-surface">Needs Repair</option>
                      <option value="In Maintenance" className="bg-brand-surface">In Maintenance</option>
                    </select>
                    {errors.maintenanceStatus && <p className="text-red-400 text-xs mt-1">{errors.maintenanceStatus.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors font-medium">
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button type="submit" form="inventory-form" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-brand-gold text-black font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {mode === "create" ? "Add Item" : "Save Changes"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
