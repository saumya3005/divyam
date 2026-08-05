"use client";

import { BarChart3, Download, TrendingUp, TrendingDown, DollarSign, Users, Ticket, Calendar } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Jan", revenue: 245000, bookings: 32 },
  { month: "Feb", revenue: 312000, bookings: 41 },
  { month: "Mar", revenue: 289000, bookings: 37 },
  { month: "Apr", revenue: 398000, bookings: 52 },
  { month: "May", revenue: 456000, bookings: 58 },
  { month: "Jun", revenue: 521000, bookings: 67 },
];

const TOP_SERVICES = [
  { name: "Royal Wedding Package", revenue: 1250000, bookings: 18, trend: "+12%" },
  { name: "Corporate Gala", revenue: 890000, bookings: 24, trend: "+8%" },
  { name: "Birthday Premium", revenue: 456000, bookings: 45, trend: "+22%" },
  { name: "Anniversary Special", revenue: 340000, bookings: 28, trend: "-3%" },
];

export default function ReportsPage() {
  const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reports</h1>
          <p className="text-brand-gray text-sm mt-1">Business performance and analytics overview.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-medium text-sm border border-white/10 transition-colors w-fit">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "₹22.2L", change: "+18%", up: true, icon: DollarSign, color: "text-brand-gold" },
          { label: "Total Bookings", value: "287", change: "+24%", up: true, icon: Ticket, color: "text-blue-400" },
          { label: "New Customers", value: "156", change: "+12%", up: true, icon: Users, color: "text-green-400" },
          { label: "Avg. Booking Value", value: "₹77.3K", change: "-2%", up: false, icon: Calendar, color: "text-purple-400" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-brand-surface border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon size={18} className={kpi.color} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-white">{kpi.value}</p>
              <p className="text-brand-gray text-xs mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart (CSS-based bar chart) */}
      <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-medium">Monthly Revenue</h3>
            <p className="text-brand-gray text-xs mt-1">Last 6 months performance</p>
          </div>
          <BarChart3 size={18} className="text-brand-gray" />
        </div>
        <div className="flex items-end gap-3 h-48">
          {MONTHLY_DATA.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-brand-gray">₹{(d.revenue / 1000).toFixed(0)}K</span>
              <div
                className="w-full bg-brand-gold/20 rounded-t-lg relative overflow-hidden"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
              >
                <div className="absolute inset-0 bg-brand-gold/40 rounded-t-lg" />
              </div>
              <span className="text-xs text-brand-gray">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Services Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-medium">Top Performing Services</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-brand-gray font-medium">Service</th>
                <th className="text-left px-6 py-3 text-brand-gray font-medium">Revenue</th>
                <th className="text-left px-6 py-3 text-brand-gray font-medium hidden md:table-cell">Bookings</th>
                <th className="text-left px-6 py-3 text-brand-gray font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {TOP_SERVICES.map((svc) => (
                <tr key={svc.name} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{svc.name}</td>
                  <td className="px-6 py-4 text-white">₹{(svc.revenue / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-brand-gray hidden md:table-cell">{svc.bookings}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-xs font-medium ${svc.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                      {svc.trend.startsWith("+") ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {svc.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
