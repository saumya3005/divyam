"use client";

import { useGetPublishedEvents } from "@/features/admin/hooks/useEvents";
import { Loader2, Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CustomerEventsPage() {
  const { data: events, isLoading, error } = useGetPublishedEvents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Upcoming Events</h1>
          <p className="text-brand-gray text-sm mt-1">Discover and book your spot at our exclusive events.</p>
        </div>
      </div>

      <div className="bg-brand-surface border border-white/5 rounded-xl overflow-hidden min-h-100 p-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-brand-gold" size={32} />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">Failed to load events.</div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-base border border-white/10 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-all flex flex-col group"
              >
                <div className="aspect-video w-full bg-white/5 relative overflow-hidden flex items-center justify-center">
                  {/* Placeholder for Cover Image */}
                  <Calendar className="w-12 h-12 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-brand-gold text-brand-dark text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {event.eventType}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                  <p className="text-brand-gray text-sm mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-brand-gray gap-2">
                      <Users size={16} className="text-brand-gold/70" />
                      <span>Capacity: {event.capacity} guests</span>
                    </div>
                    <div className="flex items-center text-sm text-brand-gray gap-2">
                      <DollarSign size={16} className="text-brand-gold/70" />
                      <span className="text-brand-gold font-medium">₹{event.basePrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/bookings?event=${event._id}`}
                    className="w-full text-center bg-white/5 hover:bg-brand-gold hover:text-brand-dark text-white font-medium py-2.5 rounded-lg transition-colors border border-white/10 hover:border-brand-gold"
                  >
                    Book Ticket
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 flex flex-col items-center text-center h-full justify-center"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Calendar size={28} className="text-brand-gray" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Events Scheduled</h3>
            <p className="text-brand-gray text-sm max-w-md">
              Check back later for exciting new events to attend!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
