"use client";

import { useGetEvents, useCreateEvent, useDeleteEvent, EventType } from "@/features/admin/hooks/useEvents";
import { Loader2, Calendar, Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const EVENT_TYPES = ["conference", "wedding", "corporate", "party", "other"];

export default function AdminEventsPage() {
  const { data: events, isLoading, error } = useGetEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "conference" as EventType["eventType"],
    capacity: "100",
    basePrice: "",
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent.mutateAsync(id);
      toast.success("Event deleted successfully");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.basePrice || !form.capacity) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await createEvent.mutateAsync({
        title: form.title,
        description: form.description,
        eventType: form.eventType,
        basePrice: Number(form.basePrice),
        capacity: Number(form.capacity),
        status: "published",
        amenities: [],
      });
      toast.success("Event created successfully");
      setShowModal(false);
      setForm({ title: "", description: "", eventType: "conference", capacity: "100", basePrice: "" });
    } catch {
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Manage Events</h1>
          <p className="text-brand-gray text-sm mt-1">
            {events ? `${events.length} events available` : "Loading..."}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load events.</div>
        ) : events && events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-gray">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Event Name</th>
                  <th className="px-6 py-4 font-medium text-white">Type</th>
                  <th className="px-6 py-4 font-medium text-white">Base Price</th>
                  <th className="px-6 py-4 font-medium text-white">Capacity</th>
                  <th className="px-6 py-4 font-medium text-white">Status</th>
                  <th className="px-6 py-4 font-medium text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((e) => (
                  <tr key={e._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white truncate max-w-62.5">{e.title}</div>
                      <div className="text-xs text-brand-gray mt-0.5 truncate max-w-62.5">{e.description}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">{e.eventType}</td>
                    <td className="px-6 py-4 font-medium text-brand-gold">₹{e.basePrice.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">{e.capacity} guests</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border capitalize ${
                        e.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        e.status === 'archived' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleDelete(e._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Events Found</h3>
            <p className="text-brand-gray text-sm max-w-md mb-6">
              Create your first event to get started.
            </p>
          </motion.div>
        )}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-brand-dark border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Add New Event</h2>
                  <button onClick={() => setShowModal(false)} className="text-brand-gray hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-sm text-brand-gray block mb-1.5">Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                      placeholder="Tech Conference 2024"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-brand-gray block mb-1.5">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50 resize-none"
                      placeholder="Describe the event..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-brand-gray block mb-1.5">Type *</label>
                      <select
                        value={form.eventType}
                        onChange={(e) => setForm({ ...form, eventType: e.target.value as EventType["eventType"] })}
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50 capitalize"
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-brand-gray block mb-1.5">Base Price (₹) *</label>
                      <input
                        type="number"
                        value={form.basePrice}
                        onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-brand-gray block mb-1.5">Capacity *</label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                      placeholder="100"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={createEvent.isPending}
                    className="w-full bg-brand-gold text-brand-dark font-medium rounded-xl py-3 mt-2 flex justify-center items-center gap-2 hover:bg-brand-gold/90 transition-colors disabled:opacity-70"
                  >
                    {createEvent.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Event"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
