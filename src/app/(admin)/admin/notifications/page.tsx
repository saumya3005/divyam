"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetNotifications } from "@/features/admin/hooks/useAdmin";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, Loader2, Trash2, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import apiClient from "@/core/lib/api";

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
  const queryClient = useQueryClient();

  const markAllMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch("/admin/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: () => toast.error("Failed to mark notifications"),
  });

  const markOneMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/admin/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      toast.success("Notification deleted");
    },
    onError: () => toast.error("Failed to delete notification"),
  });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Notifications</h1>
          <p className="text-brand-gray text-sm mt-1">
            Stay updated with platform activity
            {unreadCount > 0 && <span className="ml-2 text-brand-gold">({unreadCount} unread)</span>}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold/80 transition-colors disabled:opacity-50"
          >
            {markAllMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load notifications.</div>
        ) : notifications && notifications.length > 0 ? (
          <AnimatePresence>
            {notifications.map((notif: any, idx: number) => {
              const Icon = notif.type === "payment_received" ? CheckCircle2 : notif.type === "system_alert" ? AlertCircle : Info;
              return (
                <motion.div
                  key={notif._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.03 * idx }}
                  className={`bg-brand-surface border rounded-xl p-4 flex items-start gap-4 group ${
                    notif.isRead ? "border-white/5 opacity-60" : TYPE_STYLES[notif.type] || TYPE_STYLES.info
                  }`}
                >
                  <div className={`p-2 rounded-lg ${notif.type === "payment_received" ? "bg-green-400/10" : notif.type === "system_alert" ? "bg-yellow-400/10" : "bg-blue-400/10"}`}>
                    <Icon size={18} className={ICON_STYLES[notif.type] || ICON_STYLES.info} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm flex items-center gap-2">
                      {notif.title}
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-brand-gold inline-block" />}
                    </div>
                    <p className="text-brand-gray text-sm mt-0.5">{notif.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-brand-gray whitespace-nowrap">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                    <div className="hidden group-hover:flex items-center gap-1">
                      {!notif.isRead && (
                        <button
                          onClick={() => markOneMutation.mutate(notif._id)}
                          className="p-1.5 rounded-lg text-brand-gray hover:text-green-400 hover:bg-white/5 transition-colors"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(notif._id)}
                        className="p-1.5 rounded-lg text-brand-gray hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Bell size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Notifications</h3>
            <p className="text-brand-gray text-sm max-w-md">You're all caught up! New notifications will appear here.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
