"use client";

import { Users, UserPlus, Search, MoreVertical } from "lucide-react";

const PLACEHOLDER_EMPLOYEES = [
  { id: 1, name: "Arjun Mehta", role: "Event Coordinator", department: "Operations", status: "Active" },
  { id: 2, name: "Priya Sharma", role: "Decorator Lead", department: "Creative", status: "Active" },
  { id: 3, name: "Rohan Gupta", role: "Logistics Manager", department: "Operations", status: "On Leave" },
  { id: 4, name: "Neha Patel", role: "Client Relations", department: "Sales", status: "Active" },
  { id: 5, name: "Vikram Singh", role: "Sound Engineer", department: "Technical", status: "Active" },
];

export default function EmployeesPage() {
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
        <Search size={16} className="text-brand-gray mr-2" />
        <input
          type="text"
          placeholder="Search employees..."
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: "24", color: "text-brand-gold" },
          { label: "Active", value: "20", color: "text-green-400" },
          { label: "On Leave", value: "3", color: "text-yellow-400" },
          { label: "Departments", value: "5", color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-brand-surface border border-white/5 rounded-xl p-4">
            <p className="text-brand-gray text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
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
              {PLACEHOLDER_EMPLOYEES.map((emp) => (
                <tr key={emp.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold text-xs font-semibold">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand-gray">{emp.role}</td>
                  <td className="px-6 py-4 text-brand-gray hidden md:table-cell">{emp.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
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
      </div>
    </div>
  );
}
