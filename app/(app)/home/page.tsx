"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { PixelCharacter } from "@/components/character/PixelCharacter";
import { XPBar } from "@/components/ui/XPBar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getLevelInfo, getGreeting, getCategoryEmoji, isNightTime, getTodayString } from "@/lib/utils";
import { CheckCircle2, Circle, Flame, Star, Plus, Trash2, Moon } from "lucide-react";
import Link from "next/link";
import type { Task } from "@/types";

export default function HomePage() {
  const { user, character, currentStreak, challengeDay, toggleDarkMode } = useAppStore();
  const tasks = useAppStore((s) => s.tasks);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const isNight = isNightTime();
  const todayTasks = tasks.filter((t) => t.date === getTodayString());
  const completedCount = todayTasks.filter((t) => t.completed).length;
  const levelInfo = getLevelInfo(character.level);
  const completionPercent = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isNight ? "bg-gradient-to-b from-dark-300 to-dark-400" : "bg-gradient-to-b from-beige-50 to-beige-100 dark:from-dark-200 dark:to-dark-300"}`}>
      <div className="max-w-md mx-auto px-4 pt-safe-top pb-4">
        <div className="flex justify-between items-center pt-6 pb-2">
          <div>
            <p className="text-sm text-brown-400 dark:text-beige-400">{getGreeting()}, {user?.name} 👋</p>
            <h1 className="text-2xl font-bold text-brown-700 dark:text-beige-100">Day {challengeDay} / 90</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-dark-100 shadow-warm-sm flex items-center justify-center"
          >
            <Moon size={18} className="text-brown-500 dark:text-beige-300" />
          </button>
        </div>

        <Card variant="elevated" className="p-5 mb-4 overflow-hidden relative">
          {isNight && (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-dark-400/20 rounded-3xl" />
          )}
          <div className="flex items-end gap-4 relative">
            <div className="flex-shrink-0">
              <PixelCharacter state={character.state} level={character.level} size={100} />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 bg-brown-100 dark:bg-brown-900/30 text-brown-600 dark:text-brown-300 rounded-full">
                  {levelInfo.name}
                </span>
                <span className="text-xs text-brown-400 dark:text-beige-400">Lv. {character.level}</span>
              </div>
              <h2 className="text-lg font-bold text-brown-700 dark:text-beige-100 mb-2">{character.name}</h2>
              <XPBar xp={character.xp} xpToNextLevel={character.xpToNextLevel} level={character.level} />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <StatCard icon={<Flame size={18} className="text-orange-400" />} value={currentStreak} label="Streak" />
          <StatCard icon={<Star size={18} className="text-yellow-400" />} value={character.totalXpEarned} label="Total XP" />
          <StatCard icon={<CheckCircle2 size={18} className="text-green-400" />} value={`${completionPercent}%`} label="Today" />
        </div>

        {todayTasks.length > 0 && (
          <Card className="p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-brown-600 dark:text-beige-200">Today&apos;s Progress</h3>
              <span className="text-xs text-brown-400 dark:text-beige-400">{completedCount}/{todayTasks.length} done</span>
            </div>
            <div className="h-2 bg-beige-200 dark:bg-dark-50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </Card>
        )}

        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-brown-700 dark:text-beige-100">Today&apos;s Tasks</h2>
          <Link href="/tasks" className="flex items-center gap-1 text-sm text-brown-500 dark:text-brown-300 font-medium">
            <Plus size={16} />Add
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="No tasks yet"
            description="Add your first task for today and start earning XP!"
            action={
              <Link href="/tasks" className="bg-brown-500 text-white font-semibold px-6 py-3 rounded-2xl text-sm">
                Add Task
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {todayTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {isNight && (
          <div className="text-center py-6 text-beige-400/50 dark:text-beige-500/40 text-sm">
            🌙 Rest well. Tomorrow is a new day.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <Card className="p-3 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-lg font-bold text-brown-700 dark:text-beige-100">{value}</div>
      <div className="text-xs text-brown-400 dark:text-beige-400">{label}</div>
    </Card>
  );
}

function TaskItem({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card className="flex items-center gap-3 p-4">
        <button onClick={onToggle} className="flex-shrink-0 transition-transform active:scale-90">
          {task.completed ? (
            <CheckCircle2 size={24} className="text-green-500" />
          ) : (
            <Circle size={24} className="text-beige-300 dark:text-dark-50" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-brown-400/50 dark:text-beige-500/40" : "text-brown-700 dark:text-beige-100"}`}>
            {getCategoryEmoji(task.category)} {task.title}
          </p>
          <p className="text-xs text-brown-400/60 dark:text-beige-500/40 mt-0.5">+{task.xpReward} XP</p>
        </div>
        <button onClick={onDelete} className="flex-shrink-0 p-1 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <Trash2 size={16} className="text-brown-300 dark:text-beige-500/40 hover:text-red-400" />
        </button>
      </Card>
    </motion.div>
  );
}
