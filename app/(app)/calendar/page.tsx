"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from "date-fns";

export default function CalendarPage() {
  const { trackers, logs, user } = useAppStore();
  const [month, setMonth] = useState(new Date());
  const challengeStart = new Date(user.challengeStartDate);

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const startDow = startOfMonth(month).getDay();

  function getDayStatus(date: Date): 'complete' | 'partial' | 'missed' | 'future' | 'none' {
    const dateStr = date.toISOString().split('T')[0];
    if (!isSameMonth(date, month)) return 'none';
    if (isBefore(date, challengeStart)) return 'none';
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    if (compareDate > todayDate) return 'future';
    const dayTrackers = trackers.filter(t => t.isActive && t.categoryId !== 'askesis');
    if (dayTrackers.length === 0) return 'none';
    const done = dayTrackers.filter(t => logs.some(l => l.trackerId === t.id && l.date === dateStr && l.completed)).length;
    if (done === 0) return 'missed';
    if (done === dayTrackers.length) return 'complete';
    return 'partial';
  }

  const statusColors: Record<string, string> = {
    complete: '#10B981',
    partial: '#F59E0B',
    missed: '#EF444440',
    future: 'rgba(255,255,255,0.05)',
    none: 'transparent',
  };

  const statusGlow: Record<string, string> = {
    complete: '0 0 12px rgba(16,185,129,0.4)',
    partial: '0 0 12px rgba(245,158,11,0.3)',
    missed: 'none', future: 'none', none: 'none',
  };

  return (
    <div className="ambient-bg min-h-dvh pb-28">
      <div className="px-5 pt-14">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-semibold text-white/90">Calendar</h1>
          <p className="text-sm text-white/30 mt-1">Your 90-day journey</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70" style={{ background: 'rgba(255,255,255,0.05)' }}>←</button>
            <h2 className="text-base font-semibold text-white/80">{format(month, 'MMMM yyyy')}</h2>
            <button onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70" style={{ background: 'rgba(255,255,255,0.05)' }}>→</button>
          </div>

          {/* Day of week headers */}
          <div className="grid grid-cols-7 mb-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <p key={i} className="text-center text-xs text-white/20 font-medium">{d}</p>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array(startDow).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map((day, i) => {
              const status = getDayStatus(day);
              const isT = isToday(day);
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.01 }}
                  className="aspect-square rounded-xl flex items-center justify-center relative"
                  style={{
                    background: isT ? 'rgba(139,92,246,0.2)' : statusColors[status] || 'rgba(255,255,255,0.03)',
                    border: isT ? '1px solid rgba(139,92,246,0.4)' : 'none',
                    boxShadow: isT ? 'none' : (statusGlow[status] || 'none'),
                  }}>
                  <span className={`text-xs font-medium ${isT ? 'text-violet-300' : status === 'complete' ? 'text-emerald-300' : status === 'partial' ? 'text-amber-300' : 'text-white/30'}`}>{format(day, 'd')}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-5">
            {[{ color: '#10B981', label: 'Complete' }, { color: '#F59E0B', label: 'Partial' }, { color: '#EF444440', label: 'Missed' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <p className="text-xs text-white/30">{l.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
