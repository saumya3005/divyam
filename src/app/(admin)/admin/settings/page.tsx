"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, Globe, Bell, Shield, Palette } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-brand-gray text-sm mt-1">Manage your platform preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* General Settings */}
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Globe className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-brand-gray block mb-1.5">Platform Name</label>
              <input
                defaultValue="Divyam"
                className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
              />
            </div>
            <div>
              <label className="text-sm text-brand-gray block mb-1.5">Admin Email</label>
              <input
                defaultValue="admin@divyam.com"
                className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold/50"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-medium">Email Notifications</div>
              <p className="text-xs text-brand-gray mt-0.5">Receive email alerts for new bookings and payments</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? "bg-brand-gold" : "bg-white/10"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-medium">Dark Mode</div>
              <p className="text-xs text-brand-gray mt-0.5">Use dark theme across the platform</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? "bg-brand-gold" : "bg-white/10"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${darkMode ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          <button className="bg-brand-gold/10 text-brand-gold px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-gold/20 transition-colors">
            Change Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
