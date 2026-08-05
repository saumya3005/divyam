"use client";

import { motion } from "framer-motion";
import { Users, Plus, Shield, Mail } from "lucide-react";

const ROLES = ["Admin", "Manager", "Staff"];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Team Management</h1>
          <p className="text-brand-gray text-sm mt-1">Manage your team members and their roles</p>
        </div>
        <button className="bg-brand-gold text-brand-dark px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          Invite Member
        </button>
      </div>

      {/* Role Filters */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...ROLES].map((role) => (
          <button
            key={role}
            className={`text-xs font-medium px-4 py-1.5 rounded-full transition-colors ${
              role === "All"
                ? "bg-brand-gold text-brand-dark"
                : "bg-white/5 text-brand-gray hover:text-white border border-white/5"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border border-white/5 rounded-xl p-12 flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Users size={28} className="text-brand-gray" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Build Your Team</h3>
        <p className="text-brand-gray text-sm max-w-md mb-6">
          Invite team members to collaborate on event management. Assign roles like Admin, Manager, or Staff to control access.
        </p>
        <div className="flex gap-3">
          <button className="bg-brand-gold text-brand-dark px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-gold/90 transition-colors flex items-center gap-2">
            <Mail size={16} />
            Send Invite
          </button>
        </div>
      </motion.div>
    </div>
  );
}
