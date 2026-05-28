"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, parseISO, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { dayHistory, tasks, user } = useAppStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = monthStart.getDay();

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const history = dayHistory.find((d) => d.date === dateStr);
    const dayTasks = tasks.filter((t) => t.date === dateStr);
    if (history?.completed) return "completed";
    if (dayTasks.some((t) => t.completed)) return "partial";
    if (user && isBefore(date, parseISO(user.challengeStartDate))) return "before";
    return "empty";
  };

  const monthStr = format(currentMonth, "yyyy-MM");
  const monthHistory = dayHistory.filter((d) => d.date.startsWith(monthStr));
  const completedDays = monthHistory.filter((d) => d.completed).length;
  const totalXP = monthHistory.reduce((sum, d) => sum + d.xpEarned, 0);

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-dark-200">
      <div className="max-w-md mx-auto px-4">
        <div className="pt-14 pb-4">
          <h1 className="text-2xl font-bold text-brown-700 dark:text-beige-100">Calendar</h1>
          <p className="text-sm text-brown-400 dark:text-beige-400">Track your challenge progress</p>
        </div>

        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl bg-beige-100 dark:bg-dark-50 flex items-center justify-center active:scale-90 transition-transform"
            >
              <ChevronLeft size={16} className="text-brown-500 dark:text-beige-300" />
            </button>
            <h2 className="text-base font-semibold text-brown-700 dark:text-beige-100">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl bg-beige-100 dark:bg-dark-50 flex items-center justify-center active:scale-90 transition-transform"
            >
              <ChevronRight size={16} className="text-brown-500 dark:text-beige-300" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-brown-400 dark:text-beige-500 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startPadding }).map((_, i) => <div key={`pad-${i}`} />)}
            {days.map((day) => {
              const status = getDayStatus(day);
              const today = isToday(day);
              return (
                <motion.div
                  key={day.toISOString()}
                  whileTap={{ scale: 0.9 }}
                  className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                    today
                      ? "bg-brown-500 text-white shadow-warm-sm"
                      : status === "completed"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : status === "partial"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                      : status === "before"
                      ? "text-brown-300/30 dark:text-beige-600/20"
                      : "text-brown-600 dark:text-beige-300"
                  }`}
                >
                  {format(day, "d")}
                </motion.div>
              );
            })}
          </div>
        </Card>

        <div className="flex gap-4 justify-center flex-wrap mb-4">
          {[
            { color: "bg-brown-500", label: "Today" },
            { color: "bg-green-200 dark:bg-green-900/40", label: "Completed" },
            { color: "bg-yellow-100 dark:bg-yellow-900/30", label: "Partial" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${color}`} />
              <span className="text-xs text-brown-400 dark:text-beige-500">{label}</span>
            </div>
          ))}
        </div>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-brown-600 dark:text-beige-200 mb-3">
            {format(currentMonth, "MMMM")} Summary
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-2xl font-bold text-brown-700 dark:text-beige-100">{completedDays}</p>
              <p className="text-xs text-brown-400 dark:text-beige-400">Days completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brown-700 dark:text-beige-100">{totalXP}</p>
              <p className="text-xs text-brown-400 dark:text-beige-400">XP earned</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
