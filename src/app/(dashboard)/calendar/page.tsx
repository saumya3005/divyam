"use client";

import { motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date();
const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" });

function getDaysInMonth() {
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Shift to Monday start
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function CalendarPage() {
  const cells = getDaysInMonth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Event Calendar</h1>
        <p className="text-brand-gray text-sm mt-1">Visualize your booking schedule</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border border-white/5 rounded-xl p-6"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 rounded-lg hover:bg-white/5 text-brand-gray hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-white">{currentMonth}</h2>
          <button className="p-2 rounded-lg hover:bg-white/5 text-brand-gray hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-brand-gray py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-white/5 rounded-lg overflow-hidden">
          {cells.map((day, i) => {
            const isToday = day === today.getDate();
            return (
              <div
                key={i}
                className={`min-h-20 sm:min-h-25 p-2 bg-brand-surface transition-colors ${
                  day ? "hover:bg-white/5 cursor-pointer" : "opacity-30"
                }`}
              >
                {day && (
                  <span
                    className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      isToday
                        ? "bg-brand-gold text-brand-dark"
                        : "text-brand-gray"
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
