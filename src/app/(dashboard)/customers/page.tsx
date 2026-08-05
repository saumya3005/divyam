"use client";

import { motion } from "framer-motion";
import { Users, Search, Plus, Building2 } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customer Management</h1>
          <p className="text-brand-gray text-sm mt-1">View and manage all your clients</p>
        </div>
        <button className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      <div className="flex items-center bg-brand-surface border border-white/5 rounded-lg px-3 py-2 focus-within:border-brand-gold/50 transition-colors max-w-md">
        <Search size={16} className="text-brand-gray mr-2" />
        <input
          type="text"
          placeholder="Search customers by name, email, or company..."
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border border-white/5 rounded-xl p-12 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Building2 size={28} className="text-brand-gray" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">No Customers Yet</h3>
        <p className="text-brand-gray text-sm max-w-md mb-6">
          Your customer database is empty. Add your first customer or they will be auto-created when a booking is made.
        </p>
        <button className="bg-brand-gold text-brand-dark px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors">
          Add First Customer
        </button>
      </motion.div>
    </div>
  );
}
