"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Users as UsersIcon, Plus, Eye, Edit2, Trash2, Search } from "lucide-react";
import { useGetCustomers, useDeleteCustomer, Customer } from "@/features/customers/hooks/useCustomers";
import { CustomerDrawerForm } from "@/features/customers/components/CustomerDrawerForm";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-400/10 text-green-400 border-green-400/20",
  inactive: "bg-red-400/10 text-red-400 border-red-400/20",
  lead: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
};

export default function AdminCustomersPage() {
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const deleteMutation = useDeleteCustomer();

  const { data: customersData, isLoading, isError } = useGetCustomers(debouncedFilters);
  const customers = customersData || [];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("create");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

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

  const openDrawer = (mode: "create" | "edit" | "view", customer: Customer | null = null) => {
    setDrawerMode(mode);
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteMutation.mutateAsync(customerToDelete);
      toast.success("Customer Deleted Successfully");
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete customer");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Manage Customers</h1>
          <p className="text-brand-gray text-sm mt-1">View, add, or update customer records</p>
        </div>
        <button
          onClick={() => openDrawer("create")}
          className="flex items-center gap-2 bg-brand-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-surface border border-white/5 p-4 rounded-xl">
        <div className="relative md:col-span-3">
          <Search size={18} className="absolute left-3 top-2.5 text-brand-gray" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
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
          <option value="active" className="bg-brand-surface">Active</option>
          <option value="inactive" className="bg-brand-surface">Inactive</option>
          <option value="lead" className="bg-brand-surface">Lead</option>
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
          <div className="p-12 text-center text-red-400">Failed to load customers.</div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-brand-gray whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Name</th>
                  <th className="px-6 py-4 font-medium text-white">Email</th>
                  <th className="px-6 py-4 font-medium text-white">Phone</th>
                  <th className="px-6 py-4 font-medium text-white">Industry</th>
                  <th className="px-6 py-4 font-medium text-white">Status</th>
                  <th className="px-6 py-4 font-medium text-white">Created</th>
                  <th className="px-6 py-4 font-medium text-white text-right sticky right-0 bg-brand-surface">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{c.companyName}</td>
                    <td className="px-6 py-4">{c.email}</td>
                    <td className="px-6 py-4">{c.phone}</td>
                    <td className="px-6 py-4">{c.industry || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full border capitalize ${STATUS_COLORS[c.status] || STATUS_COLORS.lead}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2 sticky right-0 bg-brand-surface group-hover:bg-[#1a1a1a] transition-colors">
                      <button onClick={() => openDrawer("view", c)} className="text-brand-gray hover:text-white transition-colors" title="View"><Eye size={18} /></button>
                      <button onClick={() => openDrawer("edit", c)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => { setCustomerToDelete(c._id); setDeleteModalOpen(true); }} className="text-red-400 hover:text-red-300 transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !isLoading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <UsersIcon size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Customers Found</h3>
            <p className="text-brand-gray text-sm max-w-md mb-6">Adjust your filters or add a new customer to get started.</p>
          </motion.div>
        ) : null}
      </div>

      <CustomerDrawerForm isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} mode={drawerMode} customer={selectedCustomer} />

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-brand-surface border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-2">Delete Customer?</h3>
              <p className="text-brand-gray text-sm mb-6">Are you sure you want to delete this customer? This action cannot be undone.</p>
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
