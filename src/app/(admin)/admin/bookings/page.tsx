"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Search, Plus, Loader2, Eye, Edit2, Trash2 } from "lucide-react";
import { useGetAllBookings, useDeleteBooking, BookingType } from "@/features/bookings/hooks/useBookings";
import { BookingDrawerForm } from "@/features/bookings/components/BookingDrawerForm";
import { toast } from "sonner";
import { useGetServices } from "@/features/services/hooks/useServices";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  Confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
  Completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  Cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
  Rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

const PAYMENT_COLORS: Record<string, string> = {
  "Payment Pending": "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  "Payment Successful": "bg-green-400/10 text-green-400 border-green-400/20",
  "Refunded": "bg-red-400/10 text-red-400 border-red-400/20",
};

const EVENT_TYPES = ["Wedding", "Reception", "Birthday", "Corporate", "Engagement", "Haldi", "Anniversary", "Other"];

export default function BookingsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    serviceId: "",
    eventType: "",
  });

  // Debounced Search (for real-time typing effect without spamming API)
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  
  const adminQuery = useGetAllBookings(debouncedFilters);
  const deleteMutation = useDeleteBooking();
  const { data: servicesData } = useGetServices();

  const bookings = adminQuery.data || [];
  const services = servicesData || [];
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("create");
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    // Simple debounce simulation
    setTimeout(() => {
      setDebouncedFilters(prev => ({ ...prev, search: e.target.value }));
    }, 500);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setDebouncedFilters(prev => ({ ...prev, [key]: value }));
  };

  const openDrawer = (mode: "create" | "edit" | "view", booking: BookingType | null = null) => {
    setDrawerMode(mode);
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteMutation.mutateAsync(bookingToDelete);
      toast.success("Booking Deleted Successfully");
      setDeleteModalOpen(false);
      setBookingToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete booking");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Manage Bookings</h1>
          <p className="text-brand-gray text-sm mt-1">Review, add, or update event bookings</p>
        </div>
        <button
          onClick={() => openDrawer("create")}
          className="flex items-center gap-2 bg-brand-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
        >
          <Plus size={18} />
          Add Booking
        </button>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 bg-brand-surface border border-white/5 p-4 rounded-xl">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-2.5 text-brand-gray" />
          <input
            type="text"
            placeholder="Search ID, Client, Phone..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-gold/50"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 appearance-none"
        >
          <option value="" className="bg-brand-surface">All Statuses</option>
          <option value="Pending" className="bg-brand-surface">Pending</option>
          <option value="Confirmed" className="bg-brand-surface">Confirmed</option>
          <option value="Completed" className="bg-brand-surface">Completed</option>
          <option value="Cancelled" className="bg-brand-surface">Cancelled</option>
          <option value="Rejected" className="bg-brand-surface">Rejected</option>
        </select>
        <select
          value={filters.paymentStatus}
          onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 appearance-none"
        >
          <option value="" className="bg-brand-surface">All Payments</option>
          <option value="Payment Pending" className="bg-brand-surface">Pending</option>
          <option value="Payment Successful" className="bg-brand-surface">Paid</option>
          <option value="Refunded" className="bg-brand-surface">Refunded</option>
        </select>
        <select
          value={filters.eventType}
          onChange={(e) => handleFilterChange("eventType", e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 appearance-none"
        >
          <option value="" className="bg-brand-surface">All Event Types</option>
          {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-brand-surface">{t}</option>)}
        </select>
        <select
          value={filters.serviceId}
          onChange={(e) => handleFilterChange("serviceId", e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 appearance-none"
        >
          <option value="" className="bg-brand-surface">All Services</option>
          {services.map((s: any) => <option key={s._id} value={s._id} className="bg-brand-surface">{s.title}</option>)}
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden relative min-h-100">
        {adminQuery.isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-brand-surface/50 backdrop-blur-sm z-10">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        )}
        
        {adminQuery.isError ? (
          <div className="p-12 text-center text-red-400">Failed to load bookings.</div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-brand-gray whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-4 py-4 font-medium text-white">Booking ID</th>
                  <th className="px-4 py-4 font-medium text-white">Client</th>
                  <th className="px-4 py-4 font-medium text-white">Phone</th>
                  <th className="px-4 py-4 font-medium text-white">Service</th>
                  <th className="px-4 py-4 font-medium text-white">Event</th>
                  <th className="px-4 py-4 font-medium text-white">Venue</th>
                  <th className="px-4 py-4 font-medium text-white">Event Date</th>
                  <th className="px-4 py-4 font-medium text-white">Guest Count</th>
                  <th className="px-4 py-4 font-medium text-white">Amount</th>
                  <th className="px-4 py-4 font-medium text-white">Advance</th>
                  <th className="px-4 py-4 font-medium text-white">Payment Status</th>
                  <th className="px-4 py-4 font-medium text-white">Booking Status</th>
                  <th className="px-4 py-4 font-medium text-white">Created Date</th>
                  <th className="px-4 py-4 font-medium text-white text-right sticky right-0 bg-brand-surface">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-4 font-mono text-xs">{booking.bookingId || booking._id.slice(-6)}</td>
                    <td className="px-4 py-4 font-medium text-white">{booking.customerName}</td>
                    <td className="px-4 py-4">{booking.phone}</td>
                    <td className="px-4 py-4 truncate max-w-37.5">
                      {typeof booking.serviceId === 'object' ? booking.serviceId.title : 'N/A'}
                    </td>
                    <td className="px-4 py-4">{booking.serviceType}</td>
                    <td className="px-4 py-4 truncate max-w-37.5">{booking.address}</td>
                    <td className="px-4 py-4">{booking.bookingDate?.split('T')[0]}</td>
                    <td className="px-4 py-4">{booking.guests}</td>
                    <td className="px-4 py-4">₹{booking.amount}</td>
                    <td className="px-4 py-4">₹{booking.advanceAmount || 0}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${PAYMENT_COLORS[booking.paymentStatus] || PAYMENT_COLORS["Payment Pending"]}`}>
                        {booking.paymentStatus === "Payment Successful" ? "Paid" : booking.paymentStatus === "Payment Pending" ? "Pending" : booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_COLORS[booking.bookingStatus] || STATUS_COLORS.Pending}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-right space-x-2 sticky right-0 bg-brand-surface group-hover:bg-[#1a1a1a] transition-colors">
                      <button onClick={() => openDrawer("view", booking)} className="text-brand-gray hover:text-white transition-colors" title="View Booking">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => openDrawer("edit", booking)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit Booking">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => { setBookingToDelete(booking._id); setDeleteModalOpen(true); }}
                        className="text-red-400 hover:text-red-300 transition-colors" 
                        title="Delete Booking"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !adminQuery.isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Ticket size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Bookings Found</h3>
            <p className="text-brand-gray text-sm max-w-md mb-6">
              Adjust your filters or add a new booking to get started.
            </p>
          </motion.div>
        ) : null}
      </div>

      <BookingDrawerForm 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        mode={drawerMode}
        booking={selectedBooking}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative bg-brand-surface border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Delete Booking?</h3>
              <p className="text-brand-gray text-sm mb-6">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
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
