"use client";
import { motion } from "framer-motion";

interface XPBarProps {
  xp: number;
  xpToNextLevel: number;
  level: number;
  showLabel?: boolean;
}

export function XPBar({ xp, xpToNextLevel, level, showLabel = true }: XPBarProps) {
  const percent = Math.min((xp / xpToNextLevel) * 100, 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-brown-400 dark:text-beige-400">Level {level}</span>
          <span className="text-xs text-brown-400/70 dark:text-beige-500">
            {xp} / {xpToNextLevel} XP
          </span>
        </div>
      )}
      <div className="h-2.5 bg-beige-200 dark:bg-dark-50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brown-400 to-brown-500 dark:from-brown-300 dark:to-brown-400"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
