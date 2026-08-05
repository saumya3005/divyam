"use client";

import { useGetAllBookings } from "@/features/bookings/hooks/useBookings";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-400",
  Confirmed: "bg-green-400",
  Completed: "bg-blue-400",
  Cancelled: "bg-red-400",
  Rejected: "bg-red-600",
};

export default function AdminCalendarPage() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  const bookingsByDate = useMemo(() => {
    if (!bookings) return {};
    const map: Record<string, typeof bookings> = {};
    bookings.forEach((b) => {
      const d = new Date(b.bookingDate);
      if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
        const key = d.getDate().toString();
        if (!map[key]) map[key] = [];
        map[key].push(b);
      }
    });
    return map;
  }, [bookings, selectedMonth, selectedYear]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Calendar</h1>
          <p className="text-brand-gray text-sm mt-1">View upcoming events by date</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedMonth((p) => (p === 0 ? 11 : p - 1))} className="px-3 py-2 bg-brand-surface border border-white/10 rounded-lg text-white text-sm hover:bg-white/5">←</button>
          <span className="text-white font-medium min-w-30 text-center">{monthNames[selectedMonth]} {selectedYear}</span>
          <button onClick={() => setSelectedMonth((p) => (p === 11 ? 0 : p + 1))} className="px-3 py-2 bg-brand-surface border border-white/10 rounded-lg text-white text-sm hover:bg-white/5">→</button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-gold" size={32} /></div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-surface border border-white/5 rounded-2xl p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-brand-gray py-2">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayBookings = bookingsByDate[day.toString()] || [];
              const isToday = day === new Date().getDate() && selectedMonth === new Date().getMonth();
              return (
                <div
                  key={day}
                  className={`aspect-square border rounded-lg p-1 flex flex-col items-start relative ${
                    isToday ? "border-brand-gold/50 bg-brand-gold/5" : "border-white/5 hover:border-white/10"
                  } transition-colors`}
                >
                  <span className={`text-xs font-medium ${isToday ? "text-brand-gold" : "text-brand-gray"}`}>{day}</span>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {dayBookings.slice(0, 3).map((b, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[b.bookingStatus] || "bg-gray-400"}`} title={b.customerName} />
                    ))}
                  </div>
                  {dayBookings.length > 3 && (
                    <span className="text-[9px] text-brand-gray">+{dayBookings.length - 3}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
            {Object.entries(STATUS_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-brand-gray">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
