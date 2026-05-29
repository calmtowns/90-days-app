"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, getLevelFromXP } from "@/store/useAppStore";
import { fetchWeather } from "@/lib/weather";
import { differenceInDays } from "date-fns";

const CATEGORY_CONFIG = {
  health: { label: 'Health', icon: '🫀', color: '#10B981', glow: 'rgba(16,185,129,0.2)' },
  sport: { label: 'Sport', icon: '⚡', color: '#F59E0B', glow: 'rgba(245,158,11,0.2)' },
  work: { label: 'Work', icon: '🎯', color: '#3B82F6', glow: 'rgba(59,130,246,0.2)' },
  development: { label: 'Dev', icon: '🧠', color: '#8B5CF6', glow: 'rgba(139,92,246,0.2)' },
  askesis: { label: 'Askesis', icon: '🔥', color: '#EF4444', glow: 'rgba(239,68,68,0.2)' },
} as const;

const WEATHER_ICONS: Record<string, string> = {
  clear: '☀️', cloudy: '☁️', rain: '🌧️', snow: '❄️', fog: '🌫️', storm: '⛈️', unknown: '🌡️',
};

export default function HomePage() {
  const { user, trackers, logs, askesisItems, totalXP, weather, setWeather, checkAskesisResets } = useAppStore();
  const [greeting, setGreeting] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const dayNumber = differenceInDays(new Date(), new Date(user.challengeStartDate)) + 1;
  const { level, xpInLevel, xpToNext } = getLevelFromXP(totalXP);
  const xpPercent = (xpInLevel / xpToNext) * 100;

  const todayLogs = logs.filter(l => l.date === todayStr && l.completed);
  const todayTrackers = trackers.filter(t => t.isActive && t.categoryId !== 'askesis');
  const completionPercent = todayTrackers.length > 0 ? (todayLogs.length / todayTrackers.length) * 100 : 0;

  const activeAskesis = askesisItems.filter(a => a.isActive);
  const askesisCheckedToday = activeAskesis.filter(a => a.lastCheckedDate === todayStr);

  const categoryStats = (Object.entries(CATEGORY_CONFIG) as [keyof typeof CATEGORY_CONFIG, typeof CATEGORY_CONFIG[keyof typeof CATEGORY_CONFIG]][])
    .filter(([id]) => id !== 'askesis')
    .map(([id, cfg]) => {
      const catTrackers = trackers.filter(t => t.categoryId === id && t.isActive);
      const done = catTrackers.filter(t => todayLogs.some(l => l.trackerId === t.id)).length;
      return { id, ...cfg, done, total: catTrackers.length };
    });

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 5) setGreeting('Still awake?');
    else if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else if (h < 21) setGreeting('Good evening');
    else setGreeting('Good night');

    checkAskesisResets();

    fetchWeather().then(w => { if (w) setWeather(w); }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ambient-bg min-h-dvh pb-28 scrollbar-hide overflow-y-auto">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-1/3 -right-24 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 px-5 pt-14 space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/40 font-light">{greeting},</p>
            <h1 className="text-2xl font-semibold text-white/90 tracking-tight">{user.name || 'Explorer'}</h1>
          </div>
          <div className="flex items-center gap-3">
            {weather && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl px-3 py-2 flex items-center gap-2">
                <span className="text-lg">{WEATHER_ICONS[weather.condition]}</span>
                <span className="text-sm font-medium text-white/70">{weather.temp}°</span>
              </motion.div>
            )}
            <div className="glass-card rounded-2xl px-3 py-2 text-center">
              <p className="text-xs text-white/40">Day</p>
              <p className="text-lg font-bold text-violet-400 leading-none">{Math.min(Math.max(dayNumber, 1), 90)}</p>
            </div>
          </div>
        </motion.div>

        {/* Level + XP card */}
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
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.5 }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-white/20">Lv {level}</span>
            <span className="text-xs text-white/20">Lv {level + 1}</span>
          </div>
        </motion.div>

        {/* Today's Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white/70">Today&apos;s Progress</p>
            <p className="text-sm font-semibold text-white/90">{todayLogs.length}/{todayTrackers.length}</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {categoryStats.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }}
                className="rounded-2xl p-3 text-center" style={{ background: cat.total > 0 && cat.done === cat.total ? cat.glow : 'rgba(255,255,255,0.04)', border: `1px solid ${cat.total > 0 && cat.done === cat.total ? cat.color + '40' : 'rgba(255,255,255,0.07)'}` }}>
                <p className="text-xl mb-1">{cat.icon}</p>
                <p className="text-xs text-white/50">{cat.done}/{cat.total}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Askesis streak */}
        {activeAskesis.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-5" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <p className="text-sm font-medium text-white/70">Askesis</p>
              </div>
              <p className="text-xs text-white/40">{askesisCheckedToday.length}/{activeAskesis.length} done today</p>
            </div>
            <div className="space-y-2">
              {activeAskesis.slice(0, 3).map(a => (
                <div key={a.id} className="flex items-center justify-between">
                  <p className="text-sm text-white/70 truncate">{a.name}</p>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs text-orange-400 font-semibold">{a.currentStreak}d</span>
                    <div className={`w-2 h-2 rounded-full ${a.lastCheckedDate === todayStr ? 'bg-green-400' : 'bg-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total XP', value: totalXP.toLocaleString(), icon: '⭐' },
            { label: 'Challenge', value: `${Math.min(Math.max(dayNumber, 1), 90)}/90`, icon: '🏆' },
            { label: 'Completion', value: `${Math.round(completionPercent)}%`, icon: '✨' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
              className="glass-card rounded-2xl p-4 text-center">
              <p className="text-lg mb-1">{stat.icon}</p>
              <p className="text-base font-bold text-white/90">{stat.value}</p>
              <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 90-day progress bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-white/60">90-Day Journey</p>
            <p className="text-sm text-white/40">{90 - Math.min(Math.max(dayNumber, 1), 90)} days left</p>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${(Math.min(Math.max(dayNumber, 1), 90) / 90) * 100}%` }} transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
