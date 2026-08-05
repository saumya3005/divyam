"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calendar, Plus, Eye, Edit2, Trash2, Search } from "lucide-react";
import { useGetEvents, useDeleteEvent, Event } from "@/features/events/hooks/useEvents";
import { EventDrawerForm } from "@/features/events/components/EventDrawerForm";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  published: "bg-green-400/10 text-green-400 border-green-400/20",
  draft: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  archived: "bg-red-400/10 text-red-400 border-red-400/20",
};

const EVENT_TYPES = ["conference", "wedding", "corporate", "party", "other"];

export default function AdminEventsPage() {
  const [filters, setFilters] = useState({ search: "", status: "", eventType: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const deleteMutation = useDeleteEvent();

  const { data: eventsData, isLoading, isError } = useGetEvents(debouncedFilters);
  const events = eventsData || [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("create");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

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

  const openDrawer = (mode: "create" | "edit" | "view", event: Event | null = null) => {
    setDrawerMode(mode);
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteMutation.mutateAsync(eventToDelete);
      toast.success("Event Deleted Successfully");
      setDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Manage Events</h1>
          <p className="text-brand-gray text-sm mt-1">View, add, or update events</p>
        </div>
        <button
          onClick={() => openDrawer("create")}
          className="flex items-center gap-2 bg-brand-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-brand-surface border border-white/5 p-4 rounded-xl">
        <div className="relative md:col-span-3">
          <Search size={18} className="absolute left-3 top-2.5 text-brand-gray" />
          <input
            type="text"
            placeholder="Search events by title or description..."
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
          <option value="draft" className="bg-brand-surface">Draft</option>
          <option value="published" className="bg-brand-surface">Published</option>
          <option value="archived" className="bg-brand-surface">Archived</option>
        </select>
        <select
          value={filters.eventType}
          onChange={(e) => handleFilterChange("eventType", e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 appearance-none capitalize"
        >
          <option value="" className="bg-brand-surface">All Types</option>
          {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-brand-surface capitalize">{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden relative min-h-100">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-brand-surface/50 backdrop-blur-sm z-10">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        )}
        {isError ? (
          <div className="p-12 text-center text-red-400">Failed to load events.</div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-brand-gray whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Event</th>
                  <th className="px-6 py-4 font-medium text-white">Type</th>
                  <th className="px-6 py-4 font-medium text-white">Capacity</th>
                  <th className="px-6 py-4 font-medium text-white">Price</th>
                  <th className="px-6 py-4 font-medium text-white">Status</th>
                  <th className="px-6 py-4 font-medium text-white text-right sticky right-0 bg-brand-surface">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{evt.title}</span>
                        <span className="text-xs text-brand-gray truncate max-w-50">{evt.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{evt.eventType}</td>
                    <td className="px-6 py-4">{evt.capacity} pax</td>
                    <td className="px-6 py-4 font-medium text-brand-gold">₹{evt.basePrice?.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_COLORS[evt.status] || STATUS_COLORS.draft}`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 sticky right-0 bg-brand-surface group-hover:bg-[#1a1a1a] transition-colors">
                      <button onClick={() => openDrawer("view", evt)} className="text-brand-gray hover:text-white transition-colors" title="View"><Eye size={18} /></button>
                      <button onClick={() => openDrawer("edit", evt)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => { setEventToDelete(evt._id); setDeleteModalOpen(true); }} className="text-red-400 hover:text-red-300 transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !isLoading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Events Found</h3>
            <p className="text-brand-gray text-sm max-w-md mb-6">Adjust your filters or add a new event to get started.</p>
          </motion.div>
        ) : null}
      </div>

      <EventDrawerForm isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} mode={drawerMode} event={selectedEvent} />

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-brand-surface border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Event?</h3>
              <p className="text-brand-gray text-sm mb-6">Are you sure you want to remove this event? This action cannot be undone.</p>
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
