"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, MessageCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import apiClient from "@/core/lib/api";

interface QueryType {
  _id: string;
  subject: string;
  message: string;
  status: "Open" | "Resolved";
  adminReply?: string;
  createdAt: string;
}

export default function SupportPage() {
  const [queries, setQueries] = useState<QueryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: { queries: QueryType[] } }>("/queries/my");
      setQueries(res.data.data.queries);
    } catch (error) {
      toast.error("Failed to load your queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await apiClient.post("/queries", data);
      toast.success("Query submitted successfully!");
      reset();
      setShowForm(false);
      fetchQueries();
    } catch (error) {
      toast.error("Failed to submit query");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Customer Support</h1>
          <p className="text-brand-gray text-sm mt-1">Submit your queries and track responses</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-gold text-brand-dark px-4 py-2 rounded-lg font-medium text-sm flex items-center hover:bg-brand-gold/90 transition-colors"
        >
          {showForm ? "Cancel" : <><Plus size={16} className="mr-2" /> New Query</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-brand-surface border border-white/5 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-medium text-white mb-4">Submit a New Query</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-brand-gray mb-1">Subject</label>
              <input 
                {...register("subject", { required: "Subject is required" })}
                className="w-full bg-bg-base border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50"
                placeholder="Brief subject of your issue..."
              />
              {errors.subject && <span className="text-red-400 text-xs mt-1 block">{errors.subject.message as string}</span>}
            </div>
            <div>
              <label className="block text-sm text-brand-gray mb-1">Message</label>
              <textarea 
                {...register("message", { required: "Message is required" })}
                className="w-full bg-bg-base border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-gold/50 h-32 resize-none"
                placeholder="Describe your query in detail..."
              />
              {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message as string}</span>}
            </div>
            <button 
              disabled={isSubmitting}
              className="bg-brand-gold text-brand-dark px-6 py-2 rounded-lg font-medium flex items-center disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Submit Query
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : queries.length > 0 ? (
          queries.map((q) => (
            <div key={q._id} className="bg-brand-surface border border-white/5 rounded-xl p-5 flex flex-col hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-white text-lg">{q.subject}</h4>
                <span className={`px-2.5 py-1 text-xs rounded-full border ${q.status === "Resolved" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"}`}>
                  {q.status}
                </span>
              </div>
              <p className="text-brand-gray text-sm mb-4 leading-relaxed">{q.message}</p>
              
              {q.adminReply && (
                <div className="mt-2 bg-brand-gold/5 border border-brand-gold/10 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-brand-gold mb-2">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">Support Response</span>
                  </div>
                  <p className="text-sm text-brand-gray">{q.adminReply}</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-white/5 text-xs text-brand-gray/60">
                Submitted on {new Date(q.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center border border-white/5 rounded-xl bg-brand-surface">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-medium mb-1">No Queries Yet</h3>
            <p className="text-brand-gray text-sm max-w-md mx-auto">
              If you have any questions or need assistance with your bookings, feel free to submit a new query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
