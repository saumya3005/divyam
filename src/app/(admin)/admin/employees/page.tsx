"use client";

import { useGetEmployees } from "@/features/admin/hooks/useAdmin";
import { Users, UserPlus, Search, MoreVertical, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function EmployeesPage() {
  const { data: employees, isLoading, error } = useGetEmployees();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!employees) return [];
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const activeCount = employees?.filter(e => e.status === "Active").length || 0;
  const onLeaveCount = employees?.filter(e => e.status === "On Leave").length || 0;
  const uniqueDepartments = new Set(employees?.map(e => e.department)).size || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Employees</h1>
          <p className="text-brand-gray text-sm mt-1">Manage your team members and their roles.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-brand-dark px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-brand-gold/90 transition-colors w-fit">
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-brand-surface rounded-xl px-4 py-2.5 border border-white/5 max-w-sm focus-within:border-brand-gold/50 transition-colors">
        <Search size={16} className="text-brand-gray mr-2 shrink-0" />
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: employees?.length || 0, color: "text-brand-gold" },
          { label: "Active", value: activeCount, color: "text-green-400" },
          { label: "On Leave", value: onLeaveCount, color: "text-yellow-400" },
          { label: "Departments", value: uniqueDepartments, color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-brand-surface border border-white/5 rounded-xl p-4">
            <p className="text-brand-gray text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load employees.</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-brand-gray font-medium">Name</th>
                  <th className="text-left px-6 py-3 text-brand-gray font-medium">Role</th>
                  <th className="text-left px-6 py-3 text-brand-gray font-medium hidden md:table-cell">Department</th>
                  <th className="text-left px-6 py-3 text-brand-gray font-medium">Status</th>
                  <th className="text-right px-6 py-3 text-brand-gray font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp._id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold text-xs font-semibold">
                          {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brand-gray">{emp.role}</td>
                    <td className="px-6 py-4 text-brand-gray hidden md:table-cell">{emp.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        emp.status === "Active" ? "bg-green-500/10 text-green-400" : 
                        emp.status === "On Leave" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-brand-gray hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-brand-gray">No employees found.</div>
        )}
      </div>
    </div>
  );
}
