"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateReview, useUpdateReview, ReviewItem } from "../hooks/useReviews";
import { toast } from "sonner";

const reviewSchema = z.object({
  customerName: z.string().min(1, "Customer Name is required"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
  status: z.enum(["Published", "Hidden"]),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewDrawerFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: ReviewItem | null;
  mode: "create" | "edit" | "view";
}

export function ReviewDrawerForm({ isOpen, onClose, item, mode }: ReviewDrawerFormProps) {
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();

  const isReadOnly = mode === "view";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      customerName: "",
      rating: 5,
      comment: "",
      status: "Published",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (item && mode !== "create") {
        reset({
          customerName: item.customerName || "",
          rating: item.rating || 5,
          comment: item.comment || "",
          status: item.status || "Published",
        });
      } else {
        reset({
          customerName: "",
          rating: 5,
          comment: "",
          status: "Published",
        });
      }
    }
  }, [isOpen, item, mode, reset]);

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(data);
        toast.success("Review created successfully!");
      } else if (mode === "edit" && item) {
        await updateMutation.mutateAsync({ id: item._id, ...data });
        toast.success("Review updated successfully!");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-surface border-l border-white/10 z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">
                  {mode} Review
                </h2>
                <p className="text-sm text-brand-gray mt-1">
                  {mode === "create" ? "Add a new customer review." : mode === "edit" ? "Update review details." : "View review details."}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-brand-gray hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="review-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-1.5">
                    Customer Name
                  </label>
                  <input
                    {...register("customerName")}
                    disabled={isReadOnly}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-1.5">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    {...register("rating")}
                    disabled={isReadOnly}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                  />
                  {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-1.5">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    disabled={isReadOnly}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50 appearance-none"
                  >
                    <option value="Published" className="bg-brand-surface">Published</option>
                    <option value="Hidden" className="bg-brand-surface">Hidden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-1.5">
                    Comment
                  </label>
                  <textarea
                    {...register("comment")}
                    disabled={isReadOnly}
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold/50 transition-colors disabled:opacity-50"
                    placeholder="Enter review text..."
                  />
                  {errors.comment && <p className="text-red-400 text-xs mt-1">{errors.comment.message}</p>}
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-white/5 bg-brand-surface">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  {isReadOnly ? "Close" : "Cancel"}
                </button>
                {!isReadOnly && (
                  <button
                    type="submit"
                    form="review-form"
                    disabled={isSubmitting}
                    className="flex-1 bg-brand-gold text-black px-4 py-2.5 rounded-xl font-semibold hover:bg-brand-gold/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    {mode === "create" ? "Create Review" : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
