"use client";

import { motion } from "framer-motion";
import { Briefcase, Plus, Search, Filter } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Event Management</h1>
          <p className="text-brand-gray text-sm mt-1">Create and manage your event catalog</p>
        </div>
        <button className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          Create Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-brand-surface border border-white/5 rounded-lg px-3 py-2 focus-within:border-brand-gold/50 transition-colors">
          <Search size={16} className="text-brand-gray mr-2 shrink-0" />
          <input type="text" placeholder="Search events..." className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray" />
        </div>
        <button className="flex items-center gap-2 bg-brand-surface border border-white/5 rounded-lg px-4 py-2 text-sm text-brand-gray hover:border-white/10 transition-colors">
          <Filter size={16} />
          Filter by Type
        </button>
      </div>

      {/* Event Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Conference", "Wedding", "Corporate", "Party"].map((type) => (
          <button
            key={type}
            className={`text-xs font-medium px-4 py-1.5 rounded-full transition-colors ${
              type === "All"
                ? "bg-brand-gold text-brand-dark"
                : "bg-white/5 text-brand-gray hover:text-white border border-white/5"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border border-white/5 rounded-xl p-12 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Briefcase size={28} className="text-brand-gray" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">No Events Created</h3>
        <p className="text-brand-gray text-sm max-w-md mb-6">
          Define the types of events your business offers. Each event can have its own pricing, capacity, and amenities.
        </p>
        <button className="bg-brand-gold text-brand-dark px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors">
          Create First Event
        </button>
      </motion.div>
    </div>
  );
}
