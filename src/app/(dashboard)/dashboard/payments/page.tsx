"use client";

import { useGetMyBookings } from "@/features/bookings/hooks/useBookings";
import { Loader2, CreditCard, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function CustomerPaymentsPage() {
  const { data: bookings, isLoading, error } = useGetMyBookings();

  const payments = useMemo(() => {
    if (!bookings) return [];
    return bookings
      .filter((b) => b.paymentStatus === "Payment Successful")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Payment History</h1>
          <p className="text-brand-gray text-sm mt-1">View your past transactions and receipts</p>
        </div>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden min-h-75">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load payments.</div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-gray">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Transaction ID</th>
                  <th className="px-6 py-4 font-medium text-white">Service</th>
                  <th className="px-6 py-4 font-medium text-white">Amount</th>
                  <th className="px-6 py-4 font-medium text-white">Date</th>
                  <th className="px-6 py-4 font-medium text-white text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-brand-gold">{p.paymentId || p._id.slice(-8)}</td>
                    <td className="px-6 py-4 text-white font-medium">{p.serviceType}</td>
                    <td className="px-6 py-4 font-medium text-white">₹{p.amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-brand-gray hover:text-brand-gold transition-colors inline-flex items-center gap-1.5 text-xs font-medium">
                        <Receipt size={14} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 flex flex-col items-center text-center h-full justify-center"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <CreditCard size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Payments Yet</h3>
            <p className="text-brand-gray text-sm max-w-md">
              Your successful payments and receipts will appear here.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
