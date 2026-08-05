"use client";

import { Package, Plus, Search, MoreVertical, AlertTriangle } from "lucide-react";

const PLACEHOLDER_INVENTORY = [
  { id: 1, name: "Round Tables (8-seater)", category: "Furniture", quantity: 50, available: 42, status: "In Stock" },
  { id: 2, name: "Gold Chiavari Chairs", category: "Furniture", quantity: 200, available: 180, status: "In Stock" },
  { id: 3, name: "LED Par Lights", category: "Lighting", quantity: 80, available: 12, status: "Low Stock" },
  { id: 4, name: "PA Speaker System", category: "Audio", quantity: 10, available: 3, status: "Low Stock" },
  { id: 5, name: "White Linen Tablecloths", category: "Decor", quantity: 120, available: 95, status: "In Stock" },
  { id: 6, name: "Flower Arch Frame", category: "Decor", quantity: 8, available: 0, status: "Out of Stock" },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Inventory</h1>
          <p className="text-brand-gray text-sm mt-1">Track equipment, supplies, and event assets.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-brand-dark px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-brand-gold/90 transition-colors w-fit">
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-brand-surface rounded-xl px-4 py-2.5 border border-white/5 max-w-sm focus-within:border-brand-gold/50 transition-colors">
        <Search size={16} className="text-brand-gray mr-2" />
        <input
          type="text"
          placeholder="Search inventory..."
          className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-brand-gray"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: "468", color: "text-brand-gold" },
          { label: "In Stock", value: "412", color: "text-green-400" },
          { label: "Low Stock", value: "15", color: "text-yellow-400" },
          { label: "Out of Stock", value: "3", color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-brand-surface border border-white/5 rounded-xl p-4">
            <p className="text-brand-gray text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      <div className="flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-yellow-400 text-sm font-medium">Low Stock Alert</p>
          <p className="text-brand-gray text-xs mt-1">2 items are running low and need to be restocked soon.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-brand-gray font-medium">Item</th>
                <th className="text-left px-6 py-3 text-brand-gray font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-brand-gray font-medium">Total</th>
                <th className="text-left px-6 py-3 text-brand-gray font-medium">Available</th>
                <th className="text-left px-6 py-3 text-brand-gray font-medium">Status</th>
                <th className="text-right px-6 py-3 text-brand-gray font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_INVENTORY.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                        <Package size={14} className="text-brand-gold" />
                      </div>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand-gray hidden md:table-cell">{item.category}</td>
                  <td className="px-6 py-4 text-white">{item.quantity}</td>
                  <td className="px-6 py-4 text-white">{item.available}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === "In Stock" ? "bg-green-500/10 text-green-400" :
                      item.status === "Low Stock" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>
                      {item.status}
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
