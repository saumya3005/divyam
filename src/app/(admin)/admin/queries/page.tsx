"use client";

import { useState, useEffect } from "react";
import { Loader2, MessageCircle, Reply, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/core/lib/api";

interface QueryType {
  _id: string;
  subject: string;
  message: string;
  status: "Open" | "Resolved";
  adminReply?: string;
  createdAt: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<QueryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: { queries: QueryType[] } }>("/queries");
      setQueries(res.data.data.queries);
    } catch (error) {
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleReplySubmit = async (queryId: string) => {
    if (!replyText.trim()) return;
    try {
      await apiClient.patch(`/queries/${queryId}/reply`, { adminReply: replyText });
      toast.success("Reply submitted successfully!");
      setReplyingTo(null);
      setReplyText("");
      fetchQueries();
    } catch (error) {
      toast.error("Failed to submit reply");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customer Support Queries</h1>
          <p className="text-brand-gray text-sm mt-1">Manage and resolve customer support tickets</p>
        </div>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden min-h-100">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : queries.length > 0 ? (
          <div className="p-6 grid grid-cols-1 gap-6">
            {queries.map((q) => (
              <div key={q._id} className="bg-bg-base border border-white/10 rounded-xl p-5 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-white text-lg">{q.subject}</h3>
                    <p className="text-xs text-brand-gray mt-1">
                      From: <span className="text-white/80">{q.userId?.firstName} {q.userId?.lastName}</span> ({q.userId?.email})
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs rounded-full border ${q.status === "Resolved" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"}`}>
                    {q.status}
                  </span>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg text-brand-gray text-sm leading-relaxed mb-4">
                  {q.message}
                </div>
                
                {q.status === "Resolved" && q.adminReply ? (
                  <div className="bg-brand-gold/10 border border-brand-gold/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-brand-gold mb-2">
                      <CheckCircle2 size={16} />
                      <span className="text-sm font-medium">Your Reply</span>
                    </div>
                    <p className="text-sm text-white/90">{q.adminReply}</p>
                  </div>
                ) : (
                  <div className="mt-2">
                    {replyingTo === q._id ? (
                      <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full bg-bg-base border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 h-32 resize-none text-sm"
                          placeholder="Write your response to the customer..."
                        />
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                            className="text-sm text-brand-gray hover:text-white transition-colors px-4 py-2"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleReplySubmit(q._id)}
                            className="bg-brand-gold text-brand-dark px-6 py-2 rounded-lg font-medium text-sm flex items-center hover:bg-brand-gold/90 transition-colors"
                          >
                            Send Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setReplyingTo(q._id)}
                        className="text-brand-gold hover:text-brand-gold/80 text-sm font-medium flex items-center transition-colors"
                      >
                        <Reply size={16} className="mr-1" /> Click to Reply
                      </button>
                    )}
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-brand-gray/50 flex justify-between">
                  <span>Ticket ID: {q._id}</span>
                  <span>{new Date(q.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center text-center h-full justify-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Support Queries</h3>
            <p className="text-brand-gray text-sm max-w-md">
              There are currently no active customer support tickets to resolve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
