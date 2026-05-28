import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import type { LevelInfo, TaskCategory, CharacterLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
}

export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpRequired = 0;
  while (true) {
    const nextXP = getXPForLevel(level);
    if (xpRequired + nextXP > totalXP) break;
    xpRequired += nextXP;
    level++;
    if (level > 50) break;
  }
  return level;
}

export function getLevelInfo(level: number): LevelInfo {
  const xpRequired = getXPForLevel(level);
  const xpTotal = getTotalXPForLevel(level);
  let tier: CharacterLevel = "beginner";
  let name = "Beginner";

  if (level >= 31) { tier = "transformation"; name = "Transformation"; }
  else if (level >= 21) { tier = "momentum"; name = "Momentum"; }
  else if (level >= 11) { tier = "discipline"; name = "Discipline"; }

  return { level, name, tier, xpRequired, xpTotal };
}

export function getCategoryColor(category: TaskCategory): string {
  const colors: Record<TaskCategory, string> = {
    health: "#E8A87C",
    work: "#7C9EE8",
    learning: "#A87CE8",
    mindfulness: "#7CE8A8",
    fitness: "#E87C9E",
    social: "#E8D07C",
    creative: "#7CE8D0",
    other: "#B0B0B0",
  };
  return colors[category];
}

export function getCategoryEmoji(category: TaskCategory): string {
  const emojis: Record<TaskCategory, string> = {
    health: "🌿",
    work: "💼",
    learning: "📚",
    mindfulness: "🧘",
    fitness: "💪",
    social: "🤝",
    creative: "🎨",
    other: "✨",
  };
  return emojis[category];
}

export function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
}

export function getXPForTask(priority: "low" | "medium" | "high"): number {
  const xpMap = { low: 10, medium: 25, high: 50 };
  return xpMap[priority];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
}
