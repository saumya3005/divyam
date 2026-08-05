"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useGetBookingStats, useGetMyBookings } from "@/features/bookings/hooks/useBookings";
import { useState } from "react";
import { BookingForm } from "@/features/bookings/components/BookingForm";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const [isFormOpen, setIsFormOpen] = useState(false);

  const statsQuery = useGetBookingStats(isAdmin);
  const myBookingsQuery = useGetMyBookings();

  const stats = statsQuery.data;
  const myBookings = myBookingsQuery.data;

  const STATS = isAdmin && stats ? [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: "Lifetime",
      trend: "up",
      icon: CreditCard,
    },
    {
      title: "Active Bookings",
      value: stats.pendingBookings + stats.confirmedBookings,
      change: `${stats.pendingBookings} pending`,
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      change: "Registered",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      change: "All time",
      trend: "up",
      icon: TrendingUp,
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
          <p className="text-brand-gray text-sm mt-1">Welcome back, {user?.firstName || "Customer"}</p>
        </div>
        {!isAdmin && (
          <button onClick={() => setIsFormOpen(true)} className="bg-brand-gold text-brand-dark px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors self-start sm:self-auto">
            Create New Booking
          </button>
        )}
      </div>

      {isAdmin ? (
        statsQuery.isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={stat.title}
                  className="bg-brand-surface border border-white/5 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon size={20} className="text-brand-gray" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                      <ArrowUpRight size={14} />
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-brand-gray text-sm mt-1">{stat.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-brand-surface border border-white/5 rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <h2 className="text-lg font-semibold text-white mb-2">Ready for your next event?</h2>
            <p className="text-brand-gray text-sm mb-6">Create a booking and let us handle the rest.</p>
            <button onClick={() => setIsFormOpen(true)} className="bg-brand-gold text-brand-dark px-6 py-3 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors">
              Start Booking
            </button>
          </div>
          <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Your Recent Bookings</h2>
            {myBookingsQuery.isLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-brand-gold" size={24} /></div>
            ) : myBookings && myBookings.length > 0 ? (
              <ul className="space-y-3">
                {myBookings.slice(0, 3).map((booking: any) => (
                  <li key={booking._id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm font-medium">{booking.serviceType}</p>
                      <p className="text-brand-gray text-xs">{booking.bookingDate.split('T')[0]}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-brand-gold/10 text-brand-gold">{booking.bookingStatus}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-brand-gray text-sm text-center py-4">No recent bookings</p>
            )}
          </div>
        </div>
      )}

      {isFormOpen && <BookingForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
