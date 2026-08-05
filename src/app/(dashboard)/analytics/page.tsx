"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

const METRICS = [
  { label: "Total Bookings", value: "0", icon: Calendar },
  { label: "Active Customers", value: "0", icon: Users },
  { label: "Revenue Growth", value: "0%", icon: TrendingUp },
  { label: "Conversion Rate", value: "0%", icon: BarChart3 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics & Insights</h1>
        <p className="text-brand-gray text-sm mt-1">Data-driven insights to grow your business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={metric.label}
              className="bg-brand-surface border border-white/5 rounded-xl p-5"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center mb-3">
                <Icon size={20} className="text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
              <p className="text-brand-gray text-sm mt-1">{metric.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-surface border border-white/5 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Booking Trends</h2>
          <div className="h-48 flex items-center justify-center">
            <p className="text-brand-gray text-sm text-center">Charts will populate once booking data is available.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-brand-surface border border-white/5 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Customer Acquisition</h2>
          <div className="h-48 flex items-center justify-center">
            <p className="text-brand-gray text-sm text-center">Customer growth data will appear here as your business scales.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
