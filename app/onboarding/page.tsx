"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const { completeOnboarding } = useAppStore();
  const router = useRouter();

  const handleFinish = () => {
    if (!name.trim()) return;
    completeOnboarding(name.trim());
    router.push('/home');
  };

  return (
    <div className="ambient-bg min-h-dvh flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }} />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-xs w-full relative z-10">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl mb-8">◬</motion.div>
            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">90 Days</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-12">A system for deliberate self-evolution. Track your disciplines, build your future.</p>
            <button onClick={() => setStep(1)}
              className="w-full py-4 rounded-3xl text-base font-semibold text-white transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', boxShadow: '0 0 40px rgba(139,92,246,0.3)' }}>Begin</button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="name" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xs relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">What&apos;s your name?</h2>
            <p className="text-white/40 text-sm mb-8">How should we call you?</p>
            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && name.trim() && handleFinish()}
              placeholder="Your name..." autoFocus
              className="glass-input w-full rounded-2xl px-5 py-4 text-base mb-6" />
            <button onClick={handleFinish} disabled={!name.trim()}
              className="w-full py-4 rounded-3xl text-base font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', boxShadow: name.trim() ? '0 0 40px rgba(139,92,246,0.3)' : 'none' }}>Start the Journey</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
