"use client";

import { useGetAllUsers } from "@/features/admin/hooks/useAdmin";
import { Loader2, Users as UsersIcon, Mail, Calendar, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

export default function AdminCustomersPage() {
  const { data: users, isLoading, error } = useGetAllUsers();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!users) return [];
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customers</h1>
          <p className="text-brand-gray text-sm mt-1">
            {users ? `${users.length} registered customers` : "Loading..."}
          </p>
        </div>
        <div className="flex items-center bg-brand-surface rounded-lg px-4 py-2.5 border border-white/5 w-full sm:w-72 focus-within:border-brand-gold/50 transition-colors">
          <Search size={16} className="text-brand-gray mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray"
          />
        </div>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load customers.</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-brand-gray">
              <thead className="bg-white/5 border-b border-white/5 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium text-white">Customer</th>
                  <th className="px-6 py-4 font-medium text-white">Email</th>
                  <th className="px-6 py-4 font-medium text-white">Role</th>
                  <th className="px-6 py-4 font-medium text-white">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold font-semibold text-sm">
                          {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                        </div>
                        <div className="font-medium text-white">{u.firstName} {u.lastName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="opacity-60" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs rounded-full border bg-white/5 text-brand-gray border-white/10 capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="opacity-60" />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
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
            className="p-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <UsersIcon size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Customers Found</h3>
            <p className="text-brand-gray text-sm max-w-md">
              {search ? "No customers match your search." : "No registered customers yet."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
