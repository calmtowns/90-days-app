"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import type { GoalArea } from "@/types";

const GOAL_AREAS: { id: GoalArea; label: string; emoji: string; desc: string }[] = [
  { id: "health", label: "Health", emoji: "🌿", desc: "Sleep, nutrition, wellness" },
  { id: "fitness", label: "Fitness", emoji: "💪", desc: "Workouts & movement" },
  { id: "career", label: "Career", emoji: "💼", desc: "Work & professional growth" },
  { id: "learning", label: "Learning", emoji: "📚", desc: "Skills & knowledge" },
  { id: "mindfulness", label: "Mindfulness", emoji: "🧘", desc: "Meditation & mental health" },
  { id: "relationships", label: "Social", emoji: "🤝", desc: "Friends & family" },
  { id: "creativity", label: "Creative", emoji: "🎨", desc: "Art, music, writing" },
  { id: "finance", label: "Finance", emoji: "💰", desc: "Money & investing" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<GoalArea[]>([]);

  const toggleGoal = (goal: GoalArea) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : prev.length < 4 ? [...prev, goal] : prev
    );
  };

  const handleComplete = () => {
    if (!name.trim() || selectedGoals.length === 0) return;
    completeOnboarding(name.trim(), selectedGoals);
    router.replace("/home");
  };

  const steps = [
    <WelcomeStep key="welcome" onNext={() => setStep(1)} />,
    <NameStep key="name" name={name} onChange={setName} onNext={() => name.trim() && setStep(2)} />,
    <GoalsStep key="goals" goals={selectedGoals} onToggle={toggleGoal} onComplete={handleComplete} name={name} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige-50 to-beige-100 dark:from-dark-200 dark:to-dark-300 flex flex-col">
      <div className="flex-1 flex flex-col safe-top safe-bottom px-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-4 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-brown-500" : i < step ? "w-2 bg-brown-400" : "w-2 bg-beige-300 dark:bg-dark-50"}`}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-8xl mb-8 animate-float"
      >
        🌱
      </motion.div>
      <h1 className="text-4xl font-bold text-brown-700 dark:text-beige-100 mb-4">90 Days</h1>
      <p className="text-brown-400 dark:text-beige-300 text-lg mb-2 max-w-xs">
        Transform your life through daily habits and consistency.
      </p>
      <p className="text-brown-400/70 dark:text-beige-400 text-sm mb-12 max-w-xs">
        Build your pixel character. Track your progress. Become who you want to be.
      </p>
      <button
        onClick={onNext}
        className="w-full max-w-xs bg-brown-500 text-white font-semibold text-lg py-4 rounded-3xl shadow-warm-lg active:scale-95 transition-transform"
      >
        Start my journey →
      </button>
    </div>
  );
}

function NameStep({ name, onChange, onNext }: { name: string; onChange: (v: string) => void; onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-5xl mb-6 text-center">👤</div>
      <h2 className="text-3xl font-bold text-brown-700 dark:text-beige-100 mb-2 text-center">What&apos;s your name?</h2>
      <p className="text-brown-400 dark:text-beige-400 text-center mb-10">Your character will carry your name.</p>
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your name..."
        maxLength={20}
        autoFocus
        className="w-full bg-white dark:bg-dark-100 border-2 border-beige-200 dark:border-dark-50 rounded-2xl px-5 py-4 text-xl text-brown-700 dark:text-beige-100 placeholder-beige-300 dark:placeholder-dark-50 outline-none focus:border-brown-400 transition-colors mb-6"
        onKeyDown={(e) => e.key === "Enter" && name.trim() && onNext()}
      />
      <button
        onClick={onNext}
        disabled={!name.trim()}
        className="w-full bg-brown-500 disabled:bg-beige-300 dark:disabled:bg-dark-50 text-white font-semibold text-lg py-4 rounded-3xl shadow-warm-lg active:scale-95 transition-all"
      >
        Continue →
      </button>
    </div>
  );
}

function GoalsStep({
  goals, onToggle, onComplete, name
}: {
  goals: GoalArea[];
  onToggle: (g: GoalArea) => void;
  onComplete: () => void;
  name: string;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="text-5xl mb-4 text-center">🎯</div>
      <h2 className="text-2xl font-bold text-brown-700 dark:text-beige-100 mb-1 text-center">
        Hey {name}! Choose your focus areas
      </h2>
      <p className="text-brown-400 dark:text-beige-400 text-center text-sm mb-6">
        Pick up to 4 areas you want to improve
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {GOAL_AREAS.map((area) => {
          const selected = goals.includes(area.id);
          return (
            <button
              key={area.id}
              onClick={() => onToggle(area.id)}
              className={`p-4 rounded-2xl text-left transition-all active:scale-95 ${
                selected
                  ? "bg-brown-500 text-white shadow-warm-md"
                  : "bg-white dark:bg-dark-100 text-brown-600 dark:text-beige-200 border border-beige-200 dark:border-dark-50"
              }`}
            >
              <div className="text-2xl mb-1">{area.emoji}</div>
              <div className="font-semibold text-sm">{area.label}</div>
              <div className={`text-xs mt-0.5 ${selected ? "text-white/70" : "text-brown-400 dark:text-beige-400"}`}>
                {area.desc}
              </div>
            </button>
          );
        })}
      </div>
      <button
        onClick={onComplete}
        disabled={goals.length === 0}
        className="w-full bg-brown-500 disabled:bg-beige-300 dark:disabled:bg-dark-50 text-white font-semibold text-lg py-4 rounded-3xl shadow-warm-lg active:scale-95 transition-all"
      >
        Begin 90 Days Challenge 🚀
      </button>
    </div>
  );
}
