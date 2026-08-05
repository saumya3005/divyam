"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";
import { useUpdatePayment, PaymentItem } from "../hooks/usePayments";
import { toast } from "sonner";
import dayjs from "dayjs";

const paymentSchema = z.object({
  status: z.enum(["Pending", "Completed", "Failed", "Refunded"]),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentItem | null;
  mode: "edit" | "view";
}

export function PaymentDrawerForm({ isOpen, onClose, item, mode }: PaymentDrawerFormProps) {
  const updateMutation = useUpdatePayment();

  const isReadOnly = mode === "view";
  const isSubmitting = updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      status: "Pending",
    },
  });

  useEffect(() => {
    if (isOpen && item) {
      reset({
        status: item.status,
      });
    }
  }, [isOpen, item, reset]);

  const onSubmit = async (data: PaymentFormValues) => {
    if (isReadOnly) return onClose();
    try {
      if (item) {
        await updateMutation.mutateAsync({ id: item._id, data });
        toast.success("Payment updated successfully");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update payment");
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
                  {mode === "edit" ? "Edit Payment" : "View Payment"}
                </h2>
                <p className="text-xs text-brand-gray mt-1">
                  Transaction ID: {item?.transactionId || "N/A"}
                </p>
              </div>
              <button onClick={onClose} className="p-2 text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Payment Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-brand-gray mb-1">Amount</p>
                      <p className="text-white font-medium text-lg">₹{item?.amount?.toLocaleString("en-IN")}</p>
                    </div>
                    <div>
                      <p className="text-brand-gray mb-1">Method</p>
                      <p className="text-white capitalize">{item?.paymentMethod || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-brand-gray mb-1">Date</p>
                      <p className="text-white">{dayjs(item?.createdAt).format("DD MMM YYYY hh:mm A")}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Related Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Related Information</h3>
                  
                  <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-brand-gray text-xs mb-1">Customer</p>
                      <p className="text-white text-sm">{item?.userId?.name} ({item?.userId?.email})</p>
                    </div>
                    <div>
                      <p className="text-brand-gray text-xs mb-1">Booking Details</p>
                      <p className="text-white text-sm capitalize">{item?.bookingId?.serviceType}</p>
                      <p className="text-brand-gray text-xs">Date: {dayjs(item?.bookingId?.bookingDate).format("DD MMM YYYY")}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                {/* Status Update */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-brand-gold uppercase tracking-wider">Status</h3>
                  <div>
                    <label className="block text-sm text-brand-gray mb-1.5">Payment Status *</label>
                    <select {...register("status")} disabled={isReadOnly} className={`${inputClass} appearance-none`}>
                      <option value="Pending" className="bg-brand-surface">Pending</option>
                      <option value="Completed" className="bg-brand-surface">Completed</option>
                      <option value="Failed" className="bg-brand-surface">Failed</option>
                      <option value="Refunded" className="bg-brand-surface">Refunded</option>
                    </select>
                    {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/20 flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors font-medium">
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button type="submit" form="payment-form" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-brand-gold text-black font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
