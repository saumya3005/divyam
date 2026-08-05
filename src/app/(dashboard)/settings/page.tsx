"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

const SETTINGS_SECTIONS = [
  {
    title: "Profile",
    description: "Manage your personal information",
    icon: User,
  },
  {
    title: "Notifications",
    description: "Configure notification preferences",
    icon: Bell,
  },
  {
    title: "Security",
    description: "Password, two-factor authentication",
    icon: Shield,
  },
  {
    title: "Appearance",
    description: "Theme, display, and accessibility",
    icon: Palette,
  },
];

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-brand-gray text-sm mt-1">Manage your account and application preferences</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="w-14 h-14 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold border border-brand-gold/30 text-xl font-bold shrink-0">
          {user?.firstName?.charAt(0) || "U"}
        </div>
        <div className="flex-1">
          <h2 className="text-white font-semibold">{user?.firstName} {user?.lastName}</h2>
          <p className="text-brand-gray text-sm">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20 capitalize">
            {user?.role || "Admin"}
          </span>
        </div>
        <button className="text-sm text-brand-gold hover:text-brand-gold/80 font-medium transition-colors">
          Edit Profile
        </button>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SETTINGS_SECTIONS.map((section, i) => {
          const Icon = section.icon;
          return (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={section.title}
              className="bg-brand-surface border border-white/5 rounded-xl p-5 text-left hover:border-brand-gold/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3 group-hover:bg-brand-gold/10 transition-colors">
                <Icon size={20} className="text-brand-gray group-hover:text-brand-gold transition-colors" />
              </div>
              <h3 className="text-white font-medium">{section.title}</h3>
              <p className="text-brand-gray text-sm mt-1">{section.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
