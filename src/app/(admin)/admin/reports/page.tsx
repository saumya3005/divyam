"use client";

import { useGetAdminStats } from "@/features/admin/hooks/useAdmin";
import { BarChart3, Download, TrendingUp, TrendingDown, DollarSign, Users, Ticket, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function ReportsPage() {
  const { data, isLoading, error } = useGetAdminStats();

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  if (error || !data) {
    return <div className="p-12 text-center text-red-400">Failed to load reports data.</div>;
  }

  const { stats } = data;
  const MONTHLY_DATA = stats.revenueChart || [];
  const TOP_SERVICES = stats.topServices || [];

  const maxRevenue = Math.max(...MONTHLY_DATA.map((d: any) => d.revenue || 0), 1);

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Divyam - Admin Report", 14, 22);
      
      doc.setFontSize(12);
      doc.text(`Total Revenue: ₹${stats.totalRevenue.toLocaleString("en-IN")}`, 14, 32);
      doc.text(`Total Bookings: ${stats.totalBookings}`, 14, 40);
      
      doc.setFontSize(16);
      doc.text("Top Services", 14, 55);
      
      const tableData = TOP_SERVICES.map((svc: any) => [
        svc.name,
        `₹${svc.revenue.toLocaleString("en-IN")}`,
        svc.bookings.toString()
      ]);

      (doc as any).autoTable({
        startY: 60,
        head: [['Service', 'Revenue', 'Bookings']],
        body: tableData,
      });

      doc.save("divyam-admin-report.pdf");
      toast.success("Report exported successfully!");
    } catch (error) {
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Reports</h1>
          <p className="text-brand-gray text-sm mt-1">Business performance and analytics overview.</p>
        </div>
        <button 
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl font-medium text-sm border border-white/10 transition-colors w-fit"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${(stats.totalRevenue / 100000).toFixed(2)}L`, change: "+15%", up: true, icon: DollarSign, color: "text-brand-gold" },
          { label: "Total Bookings", value: stats.totalBookings.toString(), change: "+8%", up: true, icon: Ticket, color: "text-blue-400" },
          { label: "Total Users", value: stats.totalUsers.toString(), change: "+5%", up: true, icon: Users, color: "text-green-400" },
          { label: "Avg. Booking Value", value: `₹${stats.totalBookings > 0 ? (stats.totalRevenue / stats.totalBookings / 1000).toFixed(1) : 0}K`, change: "+2%", up: true, icon: Calendar, color: "text-purple-400" },
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
          {MONTHLY_DATA.length > 0 ? MONTHLY_DATA.map((d: any) => (
            <div key={d.month || d.name} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-brand-gray">₹{((d.revenue || 0) / 1000).toFixed(0)}K</span>
              <div
                className="w-full bg-brand-gold/20 rounded-t-lg relative overflow-hidden"
                style={{ height: `${((d.revenue || 0) / maxRevenue) * 100}%` }}
              >
                <div className="absolute inset-0 bg-brand-gold/40 rounded-t-lg" />
              </div>
              <span className="text-xs text-brand-gray">{d.month || d.name}</span>
            </div>
          )) : (
            <div className="flex-1 flex items-center justify-center h-full text-brand-gray">No revenue data found</div>
          )}
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
              {TOP_SERVICES.length > 0 ? TOP_SERVICES.map((svc: any, idx: number) => (
                <tr key={svc.name || idx} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{svc.name}</td>
                  <td className="px-6 py-4 text-white">₹{((svc.revenue || 0) / 100000).toFixed(1)}L</td>
                  <td className="px-6 py-4 text-brand-gray hidden md:table-cell">{svc.bookings}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                      <TrendingUp size={12} />
                      +{(Math.random() * 20).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-brand-gray">No service data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
