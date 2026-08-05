"use client";

import { useGetAdminStats } from "@/features/admin/hooks/useAdmin";
import { Loader2, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function AdminRevenuePage() {
  const { data, isLoading, error } = useGetAdminStats();

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>;
  }
  if (error || !data) {
    return <div className="flex h-[80vh] items-center justify-center text-red-400">Failed to load revenue data.</div>;
  }

  const { stats } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Revenue</h1>
        <p className="text-brand-gray text-sm mt-1">Financial overview and revenue analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-green-400/10 w-fit mb-3"><DollarSign className="w-5 h-5 text-green-400" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Total Revenue</h3>
          <div className="text-2xl font-semibold text-white">₹{stats.totalRevenue.toLocaleString("en-IN")}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-brand-gold/10 w-fit mb-3"><TrendingUp className="w-5 h-5 text-brand-gold" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Paid Bookings</h3>
          <div className="text-2xl font-semibold text-white">{stats.completedBookings + stats.confirmedBookings}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-blue-400/10 w-fit mb-3"><BarChart3 className="w-5 h-5 text-blue-400" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Avg. Order Value</h3>
          <div className="text-2xl font-semibold text-white">
            ₹{(stats.completedBookings + stats.confirmedBookings) > 0
              ? Math.round(stats.totalRevenue / (stats.completedBookings + stats.confirmedBookings)).toLocaleString("en-IN")
              : 0}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Revenue Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000)}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '8px' }} itemStyle={{ color: '#22c55e' }} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-brand-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Monthly Breakdown</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueChart || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000)}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '8px' }} itemStyle={{ color: '#F5D061' }} />
                <Bar dataKey="revenue" fill="#F5D061" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
