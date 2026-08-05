"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from "lucide-react";

const FINANCE_STATS = [
  { title: "Total Revenue", value: "$124,500", change: "+12.5%", trend: "up", icon: DollarSign },
  { title: "Outstanding", value: "$18,200", change: "-3.2%", trend: "down", icon: CreditCard },
  { title: "Paid This Month", value: "$42,300", change: "+8.1%", trend: "up", icon: Wallet },
  { title: "Avg. Booking Value", value: "$876", change: "+5.4%", trend: "up", icon: TrendingUp },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Financial Overview</h1>
        <p className="text-brand-gray text-sm mt-1">Track revenue, payments, and financial metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FINANCE_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.title}
              className="bg-brand-surface border border-white/5 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon size={20} className="text-brand-gold" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-brand-gray text-sm mt-1">{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-brand-surface border border-white/5 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Revenue Trend</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp size={32} className="text-brand-gray mx-auto mb-3" />
            <p className="text-brand-gray text-sm">Revenue chart will populate as bookings are processed.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
