"use client";
import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { getLevelInfo, getTodayString } from "@/lib/utils";
import { Flame, Star, Trophy, TrendingUp, CheckCircle2, Target } from "lucide-react";
import { motion } from "framer-motion";
import { format, parseISO, subDays } from "date-fns";

export default function AnalyticsPage() {
  const { character, currentStreak, longestStreak, totalDaysCompleted, challengeDay, dayHistory, tasks, user } = useAppStore();
  const levelInfo = getLevelInfo(character.level);
  const today = getTodayString();
  const todayTasks = tasks.filter((t) => t.date === today);
  const completedToday = todayTasks.filter((t) => t.completed).length;

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
      const day = dayHistory.find((d) => d.date === date);
      return {
        date,
        label: format(parseISO(date), "EEE"),
        xp: day?.xpEarned || 0,
        completed: day?.completed || false,
      };
    });
  }, [dayHistory]);

  const maxXP = Math.max(...last7Days.map((d) => d.xp), 1);
  const completionRate = challengeDay > 0 ? Math.round((totalDaysCompleted / challengeDay) * 100) : 0;

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-dark-200">
      <div className="max-w-md mx-auto px-4">
        <div className="pt-14 pb-4">
          <h1 className="text-2xl font-bold text-brown-700 dark:text-beige-100">Analytics</h1>
          <p className="text-sm text-brown-400 dark:text-beige-400">Your progress overview</p>
        </div>

        <Card variant="elevated" className="p-5 mb-4 bg-gradient-to-br from-brown-500 to-brown-700 text-white border-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/70 text-sm">Current Level</p>
              <p className="text-4xl font-bold">{character.level}</p>
              <p className="text-white/80 text-sm mt-1">{levelInfo.name}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">Total XP</p>
              <p className="text-2xl font-bold">{character.totalXpEarned.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((character.xp / character.xpToNextLevel) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-white/60 text-xs">{character.xp} XP</p>
            <p className="text-white/60 text-xs">{character.xpToNextLevel} XP to next</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatBox icon={<Flame size={20} className="text-orange-400" />} value={currentStreak} label="Current Streak" unit="days" />
          <StatBox icon={<Trophy size={20} className="text-yellow-400" />} value={longestStreak} label="Best Streak" unit="days" />
          <StatBox icon={<CheckCircle2 size={20} className="text-green-400" />} value={totalDaysCompleted} label="Days Completed" unit={`/ ${challengeDay}`} />
          <StatBox icon={<Target size={20} className="text-blue-400" />} value={`${completionRate}%`} label="Challenge Rate" unit="" />
        </div>

        <Card className="p-4 mb-4">
          <h3 className="text-sm font-semibold text-brown-600 dark:text-beige-200 mb-3">Today</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brown-400 dark:text-beige-400">Tasks completed</span>
            <span className="font-semibold text-brown-700 dark:text-beige-100">{completedToday} / {todayTasks.length}</span>
          </div>
          <div className="h-1.5 bg-beige-200 dark:bg-dark-50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-400 rounded-full"
              animate={{ width: todayTasks.length > 0 ? `${(completedToday / todayTasks.length) * 100}%` : "0%" }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-brown-600 dark:text-beige-200">Last 7 Days</h3>
            <TrendingUp size={16} className="text-brown-400" />
          </div>
          <div className="flex items-end gap-2 h-24">
            {last7Days.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className={`w-full rounded-t-lg ${day.completed ? "bg-brown-500" : day.xp > 0 ? "bg-brown-300" : "bg-beige-200 dark:bg-dark-50"}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((day.xp / maxXP) * 80, day.xp > 0 ? 8 : 4)}px` }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                />
                <span className="text-[10px] text-brown-400 dark:text-beige-500">{day.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-brown-400/60 dark:text-beige-500/40 mt-2 text-center">XP earned per day</p>
        </Card>

        <Card className="p-4 mb-4">
          <h3 className="text-sm font-semibold text-brown-600 dark:text-beige-200 mb-3">90 Day Challenge</h3>
          <div className="flex justify-between mb-2">
            <span className="text-3xl font-bold text-brown-700 dark:text-beige-100">{challengeDay}</span>
            <span className="text-brown-400 dark:text-beige-400 text-sm self-end mb-1">/ 90 days</span>
          </div>
          <div className="h-3 bg-beige-200 dark:bg-dark-50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brown-400 to-brown-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(challengeDay / 90) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-brown-400 dark:text-beige-500 mt-2">{90 - challengeDay} days remaining</p>
        </Card>

        {user && (
          <p className="text-center text-xs text-brown-400/50 dark:text-beige-500/40 pb-4">
            <Star size={10} className="inline mr-1" />
            Challenge started {format(parseISO(user.challengeStartDate), "MMMM d, yyyy")}
          </p>
        )}
      </div>
    </div>
  );
}

function StatBox({ icon, value, label, unit }: { icon: React.ReactNode; value: string | number; label: string; unit: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-brown-400 dark:text-beige-400 font-medium">{label}</span></div>
      <p className="text-2xl font-bold text-brown-700 dark:text-beige-100">
        {value}<span className="text-sm font-normal text-brown-400 ml-1">{unit}</span>
      </p>
    </Card>
  );
}
