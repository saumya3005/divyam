"use client";

import { useGetMyBookings, BookingType } from "@/features/bookings/hooks/useBookings";
import { Loader2, Ticket, Calendar, DollarSign, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  Confirmed: "bg-green-400/10 text-green-400 border-green-400/20",
  Completed: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  Cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
  Rejected: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function CustomerBookingsPage() {
  const { data: bookings, isLoading, error } = useGetMyBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Bookings</h1>
          <p className="text-brand-gray text-sm mt-1">Manage and view your event bookings</p>
        </div>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden min-h-100">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load your bookings.</div>
        ) : bookings && bookings.length > 0 ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking: BookingType) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-bg-base border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{booking.serviceType}</h3>
                    <p className="text-xs text-brand-gray font-mono mt-1">ID: {booking._id.slice(-6)}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_COLORS[booking.bookingStatus] || STATUS_COLORS.Pending}`}>
                    {booking.bookingStatus}
                  </span>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-sm text-brand-gray">
                    <Calendar size={16} className="text-brand-gold/70" />
                    <span>{new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-brand-gray">
                    <MapPin size={16} className="text-brand-gold/70" />
                    <span className="truncate">{booking.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-brand-gray">
                    <DollarSign size={16} className="text-brand-gold/70" />
                    <span>₹{booking.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-brand-gray mr-2">Payment:</span>
                    <span className={booking.paymentStatus === "Payment Successful" ? "text-green-400 font-medium" : "text-yellow-400 font-medium"}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                  {booking.paymentStatus === "Payment Pending" && booking.bookingStatus !== "Cancelled" && booking.bookingStatus !== "Rejected" && (
                    <button className="bg-brand-gold text-brand-dark px-3 py-1.5 text-xs font-medium rounded hover:bg-brand-gold/90 transition-colors">
                      Pay Now
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 flex flex-col items-center text-center h-full justify-center"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Ticket size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Bookings Found</h3>
            <p className="text-brand-gray text-sm max-w-md">
              You haven't made any bookings yet. Browse our services and book your next event!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
