"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

const PLACEHOLDER_REVIEWS = [
  { name: "Priya Sharma", rating: 5, comment: "Absolutely stunning wedding arrangement! Every detail was perfect.", date: "2 days ago" },
  { name: "Raj Patel", rating: 4, comment: "Great corporate event management. Would recommend for large-scale conferences.", date: "5 days ago" },
  { name: "Anita Desai", rating: 5, comment: "The birthday decoration was beyond our expectations. Kids loved it!", date: "1 week ago" },
  { name: "Vikram Singh", rating: 4, comment: "Professional photography service. Got our shots within a week.", date: "2 weeks ago" },
  { name: "Meena Krishnan", rating: 5, comment: "Best catering we've ever had. Guests couldn't stop complimenting the food.", date: "3 weeks ago" },
];

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reviews</h1>
        <p className="text-brand-gray text-sm mt-1">Customer feedback and ratings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-brand-gold/10 w-fit mb-3"><Star className="w-5 h-5 text-brand-gold" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Average Rating</h3>
          <div className="text-2xl font-semibold text-white">4.6 / 5</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-green-400/10 w-fit mb-3"><MessageSquare className="w-5 h-5 text-green-400" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Total Reviews</h3>
          <div className="text-2xl font-semibold text-white">{PLACEHOLDER_REVIEWS.length}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-blue-400/10 w-fit mb-3"><Star className="w-5 h-5 text-blue-400" /></div>
          <h3 className="text-brand-gray text-sm mb-1">5-Star Reviews</h3>
          <div className="text-2xl font-semibold text-white">{PLACEHOLDER_REVIEWS.filter((r) => r.rating === 5).length}</div>
        </motion.div>
      </div>

      <div className="space-y-4">
        {PLACEHOLDER_REVIEWS.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="bg-brand-surface border border-white/5 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-semibold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{review.name}</div>
                  <div className="text-xs text-brand-gray">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? "text-brand-gold fill-brand-gold" : "text-white/10"} />
                ))}
              </div>
            </div>
            <p className="text-brand-gray text-sm">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
