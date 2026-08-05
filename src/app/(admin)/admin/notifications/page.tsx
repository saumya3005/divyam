"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, Clock } from "lucide-react";

const NOTIFICATIONS = [
  { type: "success", icon: CheckCircle2, title: "New booking confirmed", message: "Booking #a3f2c1 has been confirmed by admin.", time: "2 minutes ago" },
  { type: "warning", icon: AlertCircle, title: "Payment pending", message: "Customer Rahul Kumar has a pending payment for Wedding Event.", time: "15 minutes ago" },
  { type: "info", icon: Info, title: "New customer registered", message: "Sneha Mehta joined the platform.", time: "1 hour ago" },
  { type: "success", icon: CheckCircle2, title: "Event completed", message: "Corporate Conference at Delhi Convention Center marked as completed.", time: "3 hours ago" },
  { type: "warning", icon: Clock, title: "Upcoming event reminder", message: "Birthday Party event scheduled for tomorrow at 6:00 PM.", time: "5 hours ago" },
  { type: "info", icon: Info, title: "Service updated", message: "Photography Package price updated to ₹15,000.", time: "1 day ago" },
];

const TYPE_STYLES: Record<string, string> = {
  success: "bg-green-400/10 border-green-400/20",
  warning: "bg-yellow-400/10 border-yellow-400/20",
  info: "bg-blue-400/10 border-blue-400/20",
};

const ICON_STYLES: Record<string, string> = {
  success: "text-green-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
};

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Notifications</h1>
          <p className="text-brand-gray text-sm mt-1">Stay updated with platform activity</p>
        </div>
        <button className="text-sm text-brand-gold hover:text-brand-gold/80 transition-colors">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map((notif, idx) => {
          const Icon = notif.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
              className={`bg-brand-surface border rounded-xl p-4 flex items-start gap-4 ${TYPE_STYLES[notif.type]}`}
            >
              <div className={`p-2 rounded-lg ${notif.type === "success" ? "bg-green-400/10" : notif.type === "warning" ? "bg-yellow-400/10" : "bg-blue-400/10"}`}>
                <Icon size={18} className={ICON_STYLES[notif.type]} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{notif.title}</div>
                <p className="text-brand-gray text-sm mt-0.5">{notif.message}</p>
              </div>
              <span className="text-xs text-brand-gray whitespace-nowrap">{notif.time}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
