"use client";

import { useGetAdminStats } from "@/features/admin/hooks/useAdmin";
import { Loader2, BarChart3, TrendingUp, Users, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ['#F5D061', '#3b82f6', '#22c55e', '#ef4444'];

export default function AdminAnalyticsPage() {
  const { data, isLoading, error } = useGetAdminStats();

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>;
  }
  if (error || !data) {
    return <div className="flex h-[80vh] items-center justify-center text-red-400">Failed to load analytics.</div>;
  }

  const { stats } = data;

  const overviewCards = [
    { title: "Total Bookings", value: stats.totalBookings, icon: Ticket, color: "text-brand-gold", bg: "bg-brand-gold/10" },
    { title: "Total Customers", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { title: "Conversion Rate", value: `${stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Services Active", value: stats.totalServices, icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Analytics & Insights</h1>
        <p className="text-brand-gray text-sm mt-1">Data-driven insights to grow your business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
              <div className={`p-3 rounded-xl ${card.bg} w-fit mb-3`}><Icon className={`w-5 h-5 ${card.color}`} /></div>
              <h3 className="text-brand-gray text-sm mb-1">{card.title}</h3>
              <div className="text-2xl font-semibold text-white">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Booking Trends</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000)}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAnalytics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-brand-surface border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Status Distribution</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={stats.statusChart || []} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                  {(stats.statusChart || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
