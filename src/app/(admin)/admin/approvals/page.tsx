"use client";

import { useGetApprovals } from "@/features/admin/hooks/useAdmin";
import { CheckCircle2, XCircle, Clock, Filter, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

type ApprovalStatus = "all" | "pending" | "approved" | "rejected";

export default function ApprovalsPage() {
  const { data: approvals, isLoading, error } = useGetApprovals();
  const [filter, setFilter] = useState<ApprovalStatus>("all");

  const filtered = useMemo(() => {
    if (!approvals) return [];
    return filter === "all" ? approvals : approvals.filter((a: any) => a.status === filter);
  }, [approvals, filter]);

  const pendingCount = approvals?.filter((a: any) => a.status === "pending").length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Approvals</h1>
          <p className="text-brand-gray text-sm mt-1">Review and approve pending requests.</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-4 py-2 rounded-xl text-sm font-medium">
            <Clock size={16} />
            {pendingCount} Pending
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected"] as ApprovalStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === tab
                ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                : "text-brand-gray hover:bg-white/5 border border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Approvals List */}
      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
      ) : error ? (
        <div className="p-12 text-center text-red-400">Failed to load approvals.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item: any) => (
            <div key={item._id} className="bg-brand-surface border border-white/5 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.status === "pending" ? "bg-yellow-500/10" :
                  item.status === "approved" ? "bg-green-500/10" :
                  "bg-red-500/10"
                }`}>
                  {item.status === "pending" ? <Clock size={18} className="text-yellow-400" /> :
                   item.status === "approved" ? <CheckCircle2 size={18} className="text-green-400" /> :
                   <XCircle size={18} className="text-red-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-brand-gray font-mono">{item._id.slice(-6).toUpperCase()}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-brand-gray">{item.type}</span>
                  </div>
                  <p className="text-white font-medium text-sm">{item.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-brand-gray">
                    <span>{item.requesterName}</span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {item.status === "pending" ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-medium transition-colors">
                    <CheckCircle2 size={14} />
                    Approve
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors">
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              ) : (
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize shrink-0 ${
                  item.status === "approved" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {item.status}
                </span>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-brand-gray">
              <Filter size={32} className="mx-auto mb-3 opacity-50" />
              <p>No {filter} approvals found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
