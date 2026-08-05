"use client";

import { motion } from "framer-motion";
import { Ticket, Search, Filter, Plus } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
  completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Booking Management</h1>
          <p className="text-brand-gray text-sm mt-1">Manage and track all event bookings</p>
        </div>
        <button className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          New Booking
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-brand-surface border border-white/5 rounded-lg px-3 py-2 focus-within:border-brand-gold/50 transition-colors">
          <Search size={16} className="text-brand-gray mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray"
          />
        </div>
        <button className="flex items-center gap-2 bg-brand-surface border border-white/5 rounded-lg px-4 py-2 text-sm text-brand-gray hover:border-white/10 transition-colors">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Status Badges Row */}
      <div className="flex gap-2 flex-wrap">
        {Object.keys(STATUS_COLORS).map((status) => (
          <span
            key={status}
            className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${STATUS_COLORS[status]}`}
          >
            {status}
          </span>
        ))}
      </div>

      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border border-white/5 rounded-xl p-12 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Ticket size={28} className="text-brand-gray" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">No Bookings Yet</h3>
        <p className="text-brand-gray text-sm max-w-md mb-6">
          Start creating bookings to manage your events. All bookings with their statuses, dates, and customer details will appear here.
        </p>
        <button className="bg-brand-gold text-brand-dark px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors">
          Create First Booking
        </button>
      </motion.div>
    </div>
  );
}
