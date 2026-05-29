"use client";
import { useMemo } from "react";
import { useAppStore, getLevelFromXP } from "@/store/useAppStore";
import { differenceInDays, format, subDays } from "date-fns";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { trackers, logs, askesisItems, totalXP, user } = useAppStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const dayNumber = Math.max(differenceInDays(new Date(), new Date(user.challengeStartDate)) + 1, 1);
  const { level, xpInLevel, xpToNext } = getLevelFromXP(totalXP);
  const xpPercent = (xpInLevel / xpToNext) * 100;

  const todayTrackers = trackers.filter(t => t.isActive && t.categoryId !== 'askesis');
  const completedToday = todayTrackers.filter(t => logs.some(l => l.trackerId === t.id && l.date === todayStr && l.completed)).length;

  const last7 = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
      const dayTrackers = trackers.filter(t => t.isActive && t.categoryId !== 'askesis');
      const done = dayTrackers.filter(t => logs.some(l => l.trackerId === t.id && l.date === date && l.completed)).length;
      const pct = dayTrackers.length > 0 ? (done / dayTrackers.length) * 100 : 0;
      return {
        date,
        label: format(subDays(new Date(), 6 - i), 'EEE'),
        pct,
        complete: dayTrackers.length > 0 && done === dayTrackers.length,
      };
    });
  }, [trackers, logs]);

  const topAskesis = [...askesisItems].sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 3);

  const stats = [
    { label: 'Total XP', value: totalXP.toLocaleString(), icon: '⭐', color: '#A78BFA' },
    { label: 'Level', value: String(level), icon: '◈', color: '#8B5CF6' },
    { label: 'Day', value: `${Math.min(dayNumber, 90)}/90`, icon: '🏆', color: '#F59E0B' },
    { label: 'Today', value: `${completedToday}/${todayTrackers.length}`, icon: '✓', color: '#10B981' },
  ];

  return (
    <div className="ambient-bg min-h-dvh pb-28">
      <div className="px-5 pt-14 space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold text-white/90">Analytics</h1>
          <p className="text-sm text-white/30 mt-1">Your progress overview</p>
        </motion.div>

        {/* Level card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-5 glow-violet">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Evolution Level</p>
              <p className="text-4xl font-bold text-white text-glow">{level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40 mb-1">{xpInLevel} / {xpToNext} XP</p>
              <p className="text-sm text-violet-400 font-medium">{Math.round(xpPercent)}% to next</p>
            </div>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} />
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
              className="glass-card rounded-2xl p-4">
              <p className="text-2xl mb-2">{s.icon}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-white/30 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Last 7 days */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-5">
          <p className="text-sm font-medium text-white/70 mb-4">Last 7 Days</p>
          <div className="flex items-end gap-2 h-20">
            {last7.map((day, i) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(day.pct * 0.7, day.pct > 0 ? 8 : 4)}px` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="w-full rounded-t-lg"
                  style={{ background: day.complete ? '#10B981' : day.pct > 0 ? '#8B5CF6' : 'rgba(255,255,255,0.08)' }} />
                <span className="text-[10px] text-white/30">{day.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/20 mt-2 text-center">Completion % per day</p>
        </motion.div>

        {/* Askesis top streaks */}
        {topAskesis.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card rounded-3xl p-5" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-sm font-medium text-white/70 mb-4">🔥 Top Askesis Streaks</p>
            <div className="space-y-3">
              {topAskesis.map(a => (
                <div key={a.id} className="flex items-center justify-between">
                  <p className="text-sm text-white/70 truncate flex-1 mr-4">{a.name}</p>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-orange-400">{a.currentStreak}d</p>
                    <p className="text-xs text-white/30">best: {a.longestStreak}d</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 90-day journey */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-white/60">90-Day Challenge</p>
            <p className="text-sm text-white/40">{90 - Math.min(dayNumber, 90)} days left</p>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${(Math.min(dayNumber, 90) / 90) * 100}%` }} transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }} />
          </div>
          <p className="text-xs text-white/25 mt-2">Started {format(new Date(user.challengeStartDate), 'MMMM d, yyyy')}</p>
        </motion.div>
      </div>
    </div>
  );
}
