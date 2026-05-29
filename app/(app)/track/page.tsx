"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import type { CategoryId, AskesisItem, Tracker } from "@/types";

const CATEGORIES: { id: CategoryId; label: string; icon: string; description: string; color: string; gradient: string }[] = [
  { id: 'health', label: 'Health', icon: '🫀', description: 'Daily health habits', color: '#10B981', gradient: 'from-emerald-500/10 to-teal-500/5' },
  { id: 'sport', label: 'Sport', icon: '⚡', description: 'Movement & training', color: '#F59E0B', gradient: 'from-amber-500/10 to-orange-500/5' },
  { id: 'work', label: 'Work', icon: '🎯', description: 'Work tasks & focus', color: '#3B82F6', gradient: 'from-blue-500/10 to-indigo-500/5' },
  { id: 'development', label: 'Development', icon: '🧠', description: 'Growth & learning', color: '#8B5CF6', gradient: 'from-violet-500/10 to-purple-500/5' },
  { id: 'askesis', label: 'Askesis', icon: '🔥', description: 'Discipline challenges', color: '#EF4444', gradient: 'from-red-500/10 to-rose-500/5' },
];

export default function TrackPage() {
  const { trackers, logs, askesisItems } = useAppStore();
  const [selected, setSelected] = useState<CategoryId | null>(null);
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="ambient-bg min-h-dvh pb-28">
      <div className="px-5 pt-14 space-y-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold text-white/90">Track</h1>
          <p className="text-sm text-white/30 mt-1">Your daily disciplines</p>
        </motion.div>

        <div className="space-y-3">
          {CATEGORIES.map((cat, i) => {
            const catTrackers = cat.id === 'askesis'
              ? askesisItems.filter(a => a.isActive)
              : trackers.filter(t => t.categoryId === cat.id && t.isActive);
            const done = cat.id === 'askesis'
              ? askesisItems.filter(a => a.lastCheckedDate === todayStr).length
              : trackers.filter(t => t.categoryId === cat.id && t.isActive && logs.some(l => l.trackerId === t.id && l.date === todayStr && l.completed)).length;
            const total = catTrackers.length;
            const pct = total > 0 ? (done / total) * 100 : 0;
            const isComplete = total > 0 && done === total;

            return (
              <motion.button key={cat.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                onClick={() => setSelected(cat.id)}
                className={`w-full glass-card rounded-3xl p-5 text-left transition-all active:scale-[0.98] bg-gradient-to-br ${cat.gradient}`}
                style={isComplete ? { border: `1px solid ${cat.color}40`, boxShadow: `0 0 20px ${cat.color}15` } : {}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl" style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}25` }}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white/90">{cat.label}</p>
                      <p className="text-xs text-white/40">{cat.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: isComplete ? cat.color : 'rgba(255,255,255,0.5)' }}>{done}/{total}</p>
                    {isComplete && <p className="text-xs" style={{ color: cat.color }}>Complete ✓</p>}
                  </div>
                </div>
                {total > 0 && (
                  <div className="mt-4 progress-bar">
                    <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      style={{ background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})` }} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <CategoryDrawer categoryId={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryDrawer({ categoryId, onClose }: { categoryId: CategoryId; onClose: () => void }) {
  const { trackers, logs, askesisItems, addTracker, removeTracker, toggleLog, addAskesis, removeAskesis, checkAskesis } = useAppStore();
  const [newName, setNewName] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const cat = CATEGORIES.find(c => c.id === categoryId)!;
  const isAskesis = categoryId === 'askesis';

  const items: (Tracker | AskesisItem)[] = isAskesis
    ? askesisItems.filter(a => a.isActive)
    : trackers.filter(t => t.categoryId === categoryId && t.isActive);

  const handleAdd = () => {
    if (!newName.trim()) return;
    if (isAskesis) addAskesis(newName.trim());
    else addTracker(categoryId, newName.trim());
    setNewName('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full rounded-t-3xl p-6 max-h-[80dvh] overflow-y-auto scrollbar-hide"
        style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cat.icon}</span>
            <h2 className="text-xl font-semibold text-white/90">{cat.label}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/70" style={{ background: 'rgba(255,255,255,0.06)' }}>✕</button>
        </div>

        {isAskesis && (
          <div className="rounded-2xl p-4 mb-5" style={{ border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.05)' }}>
            <p className="text-xs text-red-400/80 leading-relaxed">If you miss checking an askesis before midnight, your streak resets to zero. No exceptions.</p>
          </div>
        )}

        <div className="space-y-3 mb-5">
          {items.length === 0 && (
            <p className="text-center text-white/30 text-sm py-6">No {isAskesis ? 'askesis' : 'trackers'} yet. Add one below.</p>
          )}
          {items.map((item) => {
            const isAskesisItem = 'currentStreak' in item;
            const isChecked = isAskesisItem
              ? (item as AskesisItem).lastCheckedDate === todayStr
              : logs.some(l => l.trackerId === item.id && l.date === todayStr && l.completed);

            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 rounded-2xl p-4 transition-all"
                style={{ background: isChecked ? `${cat.color}12` : 'rgba(255,255,255,0.04)', border: `1px solid ${isChecked ? cat.color + '30' : 'rgba(255,255,255,0.06)'}` }}>
                <button onClick={() => {
                  if (isAskesisItem) { if (!isChecked) checkAskesis(item.id, todayStr); }
                  else toggleLog(item.id, todayStr);
                }}
                  className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center transition-all"
                  style={{ background: isChecked ? cat.color : 'rgba(255,255,255,0.08)', border: isChecked ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
                  {isChecked && <span className="text-xs text-white">✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{item.name}</p>
                  {isAskesisItem && <p className="text-xs text-orange-400">🔥 {(item as AskesisItem).currentStreak} day streak</p>}
                </div>
                <button onClick={() => isAskesisItem ? removeAskesis(item.id) : removeTracker(item.id)}
                  className="text-white/20 hover:text-red-400 text-sm transition-colors">✕</button>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder={`Add ${isAskesis ? 'askesis' : 'tracker'}...`}
            className="glass-input flex-1 rounded-2xl px-4 py-3 text-sm" />
          <button onClick={handleAdd} style={{ background: cat.color }}
            className="rounded-2xl px-5 py-3 text-sm font-semibold text-white active:scale-95 transition-transform">Add</button>
        </div>

        <div className="h-8" />
      </motion.div>
    </motion.div>
  );
}
