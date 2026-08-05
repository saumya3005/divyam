"use client";

import { useGetServices, useCreateService, useDeleteService, Service } from "@/features/services/hooks/useServices";
import { Loader2, Briefcase, Plus, Edit2, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = ["Wedding", "Corporate", "Birthday", "Photography", "Decoration", "Catering", "Concert", "Exhibition"];

export default function AdminServicesPage() {
  const { data: services, isLoading, error } = useGetServices();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Wedding",
    price: "",
    duration: "Full Day",
    location: "",
    maxGuests: "100",
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted successfully");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await createService.mutateAsync({
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        duration: form.duration,
        location: form.location,
        maxGuests: Number(form.maxGuests),
        images: [],
        features: [],
      });
      toast.success("Service created successfully");
      setShowModal(false);
      setForm({ title: "", description: "", category: "Wedding", price: "", duration: "Full Day", location: "", maxGuests: "100" });
    } catch {
      toast.error("Failed to create service");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Manage Services</h1>
          <p className="text-brand-gray text-sm mt-1">
            {services ? `${services.length} services available` : "Loading..."}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load services.</div>
        ) : services && services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-gray">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Service</th>
                  <th className="px-6 py-4 font-medium text-white">Category</th>
                  <th className="px-6 py-4 font-medium text-white">Price</th>
                  <th className="px-6 py-4 font-medium text-white">Location</th>
                  <th className="px-6 py-4 font-medium text-white">Capacity</th>
                  <th className="px-6 py-4 font-medium text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white truncate max-w-62.5">{s.title}</div>
                      <div className="text-xs text-brand-gray mt-0.5">{s.duration}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs rounded-full border bg-brand-gold/10 text-brand-gold border-brand-gold/20">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-gold">₹{s.price.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-sm truncate max-w-37.5">{s.location}</td>
                    <td className="px-6 py-4">{s.maxGuests} guests</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleDelete(s._id)}
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
              <Briefcase size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Services Found</h3>
            <p className="text-brand-gray text-sm max-w-md mb-6">
              Create your first event package to get started.
            </p>
          </motion.div>
        )}
      </div>

      {/* Add Service Modal */}
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
                  <h2 className="text-xl font-semibold text-white">Add New Service</h2>
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
                      placeholder="Premium Wedding Package"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-brand-gray block mb-1.5">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50 resize-none"
                      placeholder="Describe the service..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-brand-gray block mb-1.5">Category *</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-brand-gray block mb-1.5">Price (₹) *</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                        placeholder="25000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-brand-gray block mb-1.5">Duration</label>
                      <select
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                      >
                        {["2 hours", "Half Day", "Full Day", "2 Days", "1 Week"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-brand-gray block mb-1.5">Max Guests</label>
                      <input
                        type="number"
                        value={form.maxGuests}
                        onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
                        className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-brand-gray block mb-1.5">Location *</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
                      placeholder="Mumbai Convention Center"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createService.isPending}
                    className="w-full bg-brand-gold text-brand-dark font-medium rounded-xl py-3 mt-2 flex justify-center items-center gap-2 hover:bg-brand-gold/90 transition-colors disabled:opacity-70"
                  >
                    {createService.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Service"}
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
