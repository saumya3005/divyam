"use client";

import { useGetAdminStats } from "@/features/admin/hooks/useAdmin";
import { Loader2, TrendingUp, Users, CalendarCheck, CheckCircle2, Ticket, BarChart3, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ['#F5D061', '#3b82f6', '#22c55e', '#ef4444'];

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useGetAdminStats();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-red-400">
        Failed to load analytics dashboard.
      </div>
    );
  }

  const { stats, recentBookings } = data;

  const summaryCards = [
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Total Bookings", value: stats.totalBookings, icon: Ticket, color: "text-brand-gold", bg: "bg-brand-gold/10" },
    { title: "Confirmed Bookings", value: stats.confirmedBookings, icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-400/10" },
    { title: "Completed Bookings", value: stats.completedBookings, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
    { title: "Rejected Bookings", value: stats.rejectedBookings, icon: CheckCircle2, color: "text-red-400", bg: "bg-red-400/10" },
    { title: "Pending Bookings", value: stats.pendingBookings, icon: CalendarCheck, color: "text-brand-gold", bg: "bg-brand-gold/10" },
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-brand-gray", bg: "bg-white/5" },
    { title: "Total Services", value: stats.totalServices, icon: Users, color: "text-brand-gray", bg: "bg-white/5" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Platform Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand-surface border border-white/5 rounded-2xl p-5 hover:border-brand-gold/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <h3 className="text-brand-gray text-sm font-medium mb-1">{card.title}</h3>
              <div className="text-2xl font-semibold text-white">{card.value}</div>
            </motion.div>
          );
        })}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-brand-surface border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueChart || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5D061" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F5D061" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#ffffff50" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${(val / 1000)}k`}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#F5D061' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F5D061" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-surface border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">Bookings by Status</h2>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={stats.statusChart || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(stats.statusChart || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/20 text-brand-gray">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{booking.customerName}</div>
                    <div className="text-xs text-brand-gray">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {booking.serviceId ? (booking.serviceId as any).title : booking.serviceType}
                  </td>
                  <td className="px-6 py-4 text-brand-gray">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-brand-gold">
                    ₹{booking.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      booking.bookingStatus === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      booking.bookingStatus === 'Confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      booking.bookingStatus === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-brand-gold/10 text-brand-gold border-brand-gold/20'
                    }`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-brand-gray">
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
