"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { User, Mail, Shield, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">My Profile</h1>
        <p className="text-brand-gray text-sm mt-1">Manage your personal information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-brand-surface border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold border-2 border-brand-gold/30 font-bold text-3xl">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{user.firstName} {user.lastName}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-brand-gray mt-2">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="px-2.5 py-1 text-xs rounded-full border bg-white/5 text-brand-gray border-white/10 capitalize flex items-center gap-1.5">
                <Shield size={12} className="text-brand-gold" />
                {user.role}
              </span>
              <span className="px-2.5 py-1 text-xs rounded-full border bg-green-500/10 text-green-400 border-green-500/20 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-brand-surface border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-brand-gray block mb-1.5">First Name</label>
              <input
                defaultValue={user.firstName}
                className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
              />
            </div>
            <div>
              <label className="text-sm text-brand-gray block mb-1.5">Last Name</label>
              <input
                defaultValue={user.lastName}
                className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-brand-gray block mb-1.5">Email Address</label>
              <input
                defaultValue={user.email}
                disabled
                className="w-full bg-bg-base/50 border border-white/5 rounded-xl px-4 py-3 text-white/50 text-sm cursor-not-allowed"
              />
            </div>
          </div>
          <button className="bg-brand-gold/10 text-brand-gold font-medium rounded-xl px-6 py-2.5 mt-6 hover:bg-brand-gold/20 transition-colors">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
