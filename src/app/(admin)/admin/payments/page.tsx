"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CreditCard, DollarSign, Eye, Edit2, Trash2, Search } from "lucide-react";
import { useGetPayments, useDeletePayment, PaymentItem } from "@/features/payments/hooks/usePayments";
import { PaymentDrawerForm } from "@/features/payments/components/PaymentDrawerForm";
import { toast } from "sonner";
import dayjs from "dayjs";

const STATUS_COLORS: Record<string, string> = {
  Completed: "bg-green-400/10 text-green-400 border-green-400/20",
  Pending: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  Failed: "bg-red-400/10 text-red-400 border-red-400/20",
  Refunded: "bg-orange-400/10 text-orange-400 border-orange-400/20",
};

export default function AdminPaymentsPage() {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const deleteMutation = useDeletePayment();

  const { data: paymentsData, isLoading, isError } = useGetPayments(debouncedFilters);
  const payments = paymentsData || [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"edit" | "view">("view");
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setTimeout(() => {
      setDebouncedFilters(prev => ({ ...prev, search: e.target.value }));
    }, 500);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setDebouncedFilters(prev => ({ ...prev, [key]: value }));
  };

  const openDrawer = (mode: "edit" | "view", payment: PaymentItem) => {
    setDrawerMode(mode);
    setSelectedPayment(payment);
    setDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!paymentToDelete) return;
    try {
      await deleteMutation.mutateAsync(paymentToDelete);
      toast.success("Payment Deleted Successfully");
      setDeleteModalOpen(false);
      setPaymentToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete payment");
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const successfulPayments = payments.filter(p => p.status === "Completed").length;

  return (
    <div className="space-y-6 relative">
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
          <div className="text-2xl font-semibold text-white">{successfulPayments}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-brand-surface border border-white/5 rounded-2xl p-5">
          <div className="p-3 rounded-xl bg-blue-400/10 w-fit mb-3"><DollarSign className="w-5 h-5 text-blue-400" /></div>
          <h3 className="text-brand-gray text-sm mb-1">Avg. Payment</h3>
          <div className="text-2xl font-semibold text-white">
            ₹{successfulPayments > 0 ? Math.round(totalRevenue / successfulPayments).toLocaleString("en-IN") : 0}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-surface border border-white/5 p-4 rounded-xl">
        <div className="relative md:col-span-3">
          <Search size={18} className="absolute left-3 top-2.5 text-brand-gray" />
          <input
            type="text"
            placeholder="Search by Transaction ID..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 appearance-none"
        >
          <option value="" className="bg-brand-surface">All Statuses</option>
          <option value="Completed" className="bg-brand-surface">Completed</option>
          <option value="Pending" className="bg-brand-surface">Pending</option>
          <option value="Failed" className="bg-brand-surface">Failed</option>
          <option value="Refunded" className="bg-brand-surface">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden relative min-h-100">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-brand-surface/50 backdrop-blur-sm z-10">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        )}
        {isError ? (
          <div className="p-12 text-center text-red-400">Failed to load payments.</div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-brand-gray whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Transaction ID</th>
                  <th className="px-6 py-4 font-medium text-white">Customer</th>
                  <th className="px-6 py-4 font-medium text-white">Amount</th>
                  <th className="px-6 py-4 font-medium text-white">Date</th>
                  <th className="px-6 py-4 font-medium text-white">Status</th>
                  <th className="px-6 py-4 font-medium text-white text-right sticky right-0 bg-brand-surface">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">
                      {payment.transactionId || "N/A"}
                      <div className="text-xs text-brand-gray capitalize mt-0.5">{payment.paymentMethod || "Manual"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white">{payment.userId?.name || "Unknown"}</span>
                        <span className="text-xs text-brand-gray">{payment.userId?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-gold">₹{payment.amount?.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">{dayjs(payment.createdAt).format("DD MMM YYYY")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${STATUS_COLORS[payment.status] || STATUS_COLORS.Pending}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 sticky right-0 bg-brand-surface group-hover:bg-[#1a1a1a] transition-colors">
                      <button onClick={() => openDrawer("view", payment)} className="text-brand-gray hover:text-white transition-colors" title="View"><Eye size={18} /></button>
                      <button onClick={() => openDrawer("edit", payment)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => { setPaymentToDelete(payment._id); setDeleteModalOpen(true); }} className="text-red-400 hover:text-red-300 transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !isLoading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <CreditCard size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Payments Found</h3>
            <p className="text-brand-gray text-sm max-w-md mb-6">There are no payment records matching your criteria.</p>
          </motion.div>
        ) : null}
      </div>

      <PaymentDrawerForm isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} mode={drawerMode} item={selectedPayment} />

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-brand-surface border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Payment?</h3>
              <p className="text-brand-gray text-sm mb-6">Are you sure you want to remove this payment record? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-gray hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={confirmDelete} disabled={deleteMutation.isPending} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2">
                  {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
