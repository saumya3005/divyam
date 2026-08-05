"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Search, Filter, Plus, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useGetAllBookings, useGetMyBookings, useUpdateBookingStatus, BookingType } from "@/features/bookings/hooks/useBookings";
import { BookingForm } from "@/features/bookings/components/BookingForm";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  Confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
  Completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  Cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
  Rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function BookingsPage() {
  const adminQuery = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();

  const isLoading = adminQuery.isLoading;
  const isError = adminQuery.isError;
  const bookings = adminQuery.data;

  const handleUpdateStatus = async (id: string, status: BookingType["bookingStatus"]) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Booking marked as ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Manage Bookings</h1>
          <p className="text-brand-gray text-sm mt-1">Review, accept, or reject event requests</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-400">Failed to load bookings.</div>
        ) : bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-gray">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">ID</th>
                  <th className="px-6 py-4 font-medium text-white">Customer</th>
                  <th className="px-6 py-4 font-medium text-white">Service</th>
                  <th className="px-6 py-4 font-medium text-white">Date & Time</th>
                  <th className="px-6 py-4 font-medium text-white">Payment</th>
                  <th className="px-6 py-4 font-medium text-white">Status</th>
                  <th className="px-6 py-4 font-medium text-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{booking._id.slice(-6)}</td>
                    <td className="px-6 py-4 font-medium text-white">{booking.customerName}</td>
                    <td className="px-6 py-4">{booking.serviceType}</td>
                    <td className="px-6 py-4">{booking.bookingDate.split('T')[0]} at {booking.bookingTime}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${
                        booking.paymentStatus === 'Payment Successful' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_COLORS[booking.bookingStatus] || STATUS_COLORS.Pending}`}>
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {booking.bookingStatus === 'Pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(booking._id, "Confirmed")} className="text-green-400 hover:underline text-xs">Accept</button>
                          <button onClick={() => handleUpdateStatus(booking._id, "Rejected")} className="text-red-400 hover:underline text-xs">Reject</button>
                        </>
                      )}
                      {booking.bookingStatus === 'Confirmed' && (
                        <button onClick={() => handleUpdateStatus(booking._id, "Completed")} className="text-blue-400 hover:underline text-xs">Complete</button>
                      )}
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
              <Ticket size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Bookings Found</h3>
            <p className="text-brand-gray text-sm max-w-md mb-6">
              Start creating bookings to manage your events. All bookings with their statuses, dates, and customer details will appear here.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
