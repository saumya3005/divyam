"use client";

import { motion } from "framer-motion";
import { Bell, Shield, Palette } from "lucide-react";
import { useState } from "react";

export default function CustomerSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-brand-gray text-sm mt-1">Manage your account preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Notification Settings */}
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white font-medium">Booking Updates</div>
                <p className="text-xs text-brand-gray mt-0.5">Receive alerts when your booking status changes</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? "bg-brand-gold" : "bg-white/10"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications ? "left-6" : "left-1"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white font-medium">Marketing Emails</div>
                <p className="text-xs text-brand-gray mt-0.5">Receive offers, promotions, and newsletter</p>
              </div>
              <button
                onClick={() => setMarketing(!marketing)}
                className={`w-11 h-6 rounded-full transition-colors relative ${marketing ? "bg-brand-gold" : "bg-white/10"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${marketing ? "left-6" : "left-1"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-brand-surface border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-brand-gold" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-bg-base border border-white/5 rounded-lg">
              <div>
                <div className="text-sm text-white font-medium">Password</div>
                <p className="text-xs text-brand-gray mt-0.5">Last changed 3 months ago</p>
              </div>
              <button className="text-brand-gold text-sm font-medium hover:underline">Update</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-bg-base border border-white/5 rounded-lg">
              <div>
                <div className="text-sm text-white font-medium">Two-Factor Authentication</div>
                <p className="text-xs text-brand-gray mt-0.5">Add an extra layer of security</p>
              </div>
              <button className="text-brand-gold text-sm font-medium hover:underline">Enable</button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-brand-surface border border-red-500/20 rounded-xl p-6 mt-8">
          <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-brand-gray mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="bg-red-500/10 text-red-400 border border-red-500/20 font-medium rounded-xl px-6 py-2.5 hover:bg-red-500/20 transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
