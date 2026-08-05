"use client";

import { useGetNotifications } from "@/features/admin/hooks/useAdmin";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const TYPE_STYLES: Record<string, string> = {
  success: "bg-green-400/10 border-green-400/20",
  warning: "bg-yellow-400/10 border-yellow-400/20",
  info: "bg-blue-400/10 border-blue-400/20",
  booking_created: "bg-blue-400/10 border-blue-400/20",
  payment_received: "bg-green-400/10 border-green-400/20",
  system_alert: "bg-yellow-400/10 border-yellow-400/20",
  task_assigned: "bg-blue-400/10 border-blue-400/20",
};

const ICON_STYLES: Record<string, string> = {
  success: "text-green-400",
  warning: "text-yellow-400",
  info: "text-blue-400",
  booking_created: "text-blue-400",
  payment_received: "text-green-400",
  system_alert: "text-yellow-400",
  task_assigned: "text-blue-400",
};

export default function AdminNotificationsPage() {
  const { data: notifications, isLoading, error } = useGetNotifications();

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
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load notifications.</div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notif, idx) => {
            const Icon = notif.type === "payment_received" ? CheckCircle2 : notif.type === "system_alert" ? AlertCircle : Info;
            return (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={`bg-brand-surface border rounded-xl p-4 flex items-start gap-4 ${TYPE_STYLES[notif.type] || TYPE_STYLES.info}`}
              >
                <div className={`p-2 rounded-lg ${notif.type === "payment_received" ? "bg-green-400/10" : notif.type === "system_alert" ? "bg-yellow-400/10" : "bg-blue-400/10"}`}>
                  <Icon size={18} className={ICON_STYLES[notif.type] || ICON_STYLES.info} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{notif.title}</div>
                  <p className="text-brand-gray text-sm mt-0.5">{notif.message}</p>
                </div>
                <span className="text-xs text-brand-gray whitespace-nowrap">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </span>
              </motion.div>
            );
          })
        ) : (
          <div className="p-12 text-center text-brand-gray">No notifications found.</div>
        )}
      </div>
    </div>
  );
}
