"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const STATS = [
  {
    title: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Active Bookings",
    value: "142",
    change: "+4.2%",
    trend: "up",
    icon: Calendar,
  },
  {
    title: "Total Customers",
    value: "856",
    change: "+1.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "24.8%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard Overview</h1>
          <p className="text-brand-gray text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <button className="bg-brand-gold text-brand-dark px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors self-start sm:self-auto">
          Create New Booking
        </button>
      </div>

      {/* Stats Grid */}
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
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-brand-surface border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Bookings</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-medium mb-1">No bookings yet</h3>
            <p className="text-brand-gray text-sm max-w-sm">
              Your recent bookings will appear here once customers start scheduling events.
            </p>
          </div>
        </div>

        {/* Upcoming Events Mini */}
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            <div className="text-center py-8">
              <p className="text-brand-gray text-sm">No events scheduled for today.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
