"use client";

import { useGetAllBookings } from "@/features/bookings/hooks/useBookings";
import { Loader2, CreditCard, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function AdminPaymentsPage() {
  const { data: bookings, isLoading } = useGetAllBookings();

  const payments = useMemo(() => {
    if (!bookings) return [];
    return bookings
      .filter((b) => b.paymentStatus === "Payment Successful")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings]);

  const totalRevenue = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Payments</h1>
        <p className="text-brand-gray text-sm mt-1">Track all payment transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-green-400/10 w-fit mb-3"><DollarSign className="w-5 h-5 text-green-400" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Total Revenue</h3>
          <div className="text-2xl font-semibold text-white">₹{totalRevenue.toLocaleString("en-IN")}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-brand-gold/10 w-fit mb-3"><CreditCard className="w-5 h-5 text-brand-gold" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Successful Payments</h3>
          <div className="text-2xl font-semibold text-white">{payments.length}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-blue-400/10 w-fit mb-3"><DollarSign className="w-5 h-5 text-blue-400" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Avg. Payment</h3>
          <div className="text-2xl font-semibold text-white">₹{payments.length > 0 ? Math.round(totalRevenue / payments.length).toLocaleString("en-IN") : 0}</div>
        </motion.div>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-gray">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Payment ID</th>
                  <th className="px-6 py-4 font-medium text-white">Customer</th>
                  <th className="px-6 py-4 font-medium text-white">Service</th>
                  <th className="px-6 py-4 font-medium text-white">Amount</th>
                  <th className="px-6 py-4 font-medium text-white">Status</th>
                  <th className="px-6 py-4 font-medium text-white">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-brand-gold">{p.paymentId || "N/A"}</td>
                    <td className="px-6 py-4 text-white">{p.customerName}</td>
                    <td className="px-6 py-4">{p.serviceType}</td>
                    <td className="px-6 py-4 font-medium text-green-400">₹{p.amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs rounded-full border bg-green-500/10 text-green-400 border-green-500/20">Paid</span>
                    </td>
                    <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-brand-gray">No payments recorded yet.</div>
        )}
      </div>
    </div>
  );
}
