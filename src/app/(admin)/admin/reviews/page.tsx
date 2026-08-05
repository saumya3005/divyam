"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Plus, Loader2, Search, Edit2, Trash2, Eye } from "lucide-react";
import { useGetReviews, useDeleteReview, ReviewItem } from "@/features/reviews/hooks/useReviews";
import { ReviewDrawerForm } from "@/features/reviews/components/ReviewDrawerForm";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function AdminReviewsPage() {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const deleteMutation = useDeleteReview();

  const { data: reviewsData, isLoading, isError } = useGetReviews(debouncedFilters);
  const reviews = reviewsData || [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("create");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setTimeout(() => {
      setDebouncedFilters(prev => ({ ...prev, search: e.target.value }));
    }, 500);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setDebouncedFilters(prev => ({ ...prev, [key]: value }));
  };

  const openDrawer = (mode: "create" | "edit" | "view", review?: ReviewItem) => {
    setDrawerMode(mode);
    setSelectedReview(review || null);
    setDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteMutation.mutateAsync(reviewToDelete);
      toast.success("Review Deleted Successfully");
      setDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reviews</h1>
          <p className="text-brand-gray text-sm mt-1">Manage customer feedback and ratings</p>
        </div>
        <button 
          onClick={() => openDrawer("create")}
          className="flex items-center gap-2 bg-brand-gold text-black px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-gold/90 transition-colors"
        >
          <Plus size={18} />
          Add Review
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-surface border border-white/5 p-4 rounded-xl">
        <div className="relative md:col-span-3">
          <Search size={18} className="absolute left-3 top-2.5 text-brand-gray" />
          <input
            type="text"
            placeholder="Search by customer name or comment..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 appearance-none"
        >
          <option value="" className="bg-brand-surface">All Statuses</option>
          <option value="Published" className="bg-brand-surface">Published</option>
          <option value="Hidden" className="bg-brand-surface">Hidden</option>
        </select>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
      ) : isError ? (
        <div className="p-12 text-center text-red-400">Failed to load reviews.</div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {reviews.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="bg-brand-surface border border-white/5 rounded-xl p-5 group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openDrawer("view", review)} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-lg text-brand-gray hover:text-white transition-colors" title="View"><Eye size={16} /></button>
                  <button onClick={() => openDrawer("edit", review)} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-lg text-blue-400 transition-colors" title="Edit"><Edit2 size={16} /></button>
                  <button onClick={() => { setReviewToDelete(review._id); setDeleteModalOpen(true); }} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-lg text-red-400 transition-colors" title="Delete"><Trash2 size={16} /></button>
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{review.customerName}</h3>
                      <div className="flex items-center gap-1 text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-white/20"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs rounded-full border ${
                    review.status === "Published" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                  }`}>
                    {review.status}
                  </span>
                </div>
                
                {review.serviceId && (
                  <div className="mb-3 text-xs text-brand-gold bg-brand-gold/5 w-fit px-2.5 py-1 rounded-md border border-brand-gold/10">
                    Service: {review.serviceId.title}
                  </div>
                )}
                
                <p className="text-brand-gray text-sm mb-4 line-clamp-3">
                  "{review.comment}"
                </p>
                
                <div className="flex items-center justify-between text-xs text-brand-gray pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare size={14} />
                    Verified Review
                  </span>
                  <span>{dayjs(review.createdAt).format("MMM DD, YYYY")}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Star size={28} className="text-brand-gray" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No Reviews Found</h3>
          <p className="text-brand-gray text-sm max-w-md">There are no reviews matching your criteria.</p>
        </motion.div>
      )}

      <ReviewDrawerForm isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} mode={drawerMode} item={selectedReview} />

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-brand-surface border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Review?</h3>
              <p className="text-brand-gray text-sm mb-6">Are you sure you want to remove this review? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={deleteMutation.isPending} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2">
                  {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
