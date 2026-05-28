"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCategoryEmoji, getTodayString } from "@/lib/utils";
import { CheckCircle2, Circle, Trash2, Plus, X } from "lucide-react";
import type { TaskCategory, TaskPriority } from "@/types";

const CATEGORIES: TaskCategory[] = ["health", "work", "learning", "mindfulness", "fitness", "social", "creative", "other"];
const PRIORITIES: { value: TaskPriority; label: string; xp: number }[] = [
  { value: "low", label: "Low", xp: 10 },
  { value: "medium", label: "Medium", xp: 25 },
  { value: "high", label: "High", xp: 50 },
];

export default function TasksPage() {
  const tasks = useAppStore((s) => s.tasks);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const addTask = useAppStore((s) => s.addTask);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"all" | "today" | "completed">("today");

  const today = getTodayString();
  const filtered = tasks.filter((t) => {
    if (filter === "today") return t.date === today;
    if (filter === "completed") return t.completed;
    return true;
  });
  const pendingToday = tasks.filter((t) => t.date === today && !t.completed);

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-dark-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center pt-14 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-brown-700 dark:text-beige-100">Tasks</h1>
            <p className="text-sm text-brown-400 dark:text-beige-400">{pendingToday.length} pending today</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="w-12 h-12 bg-brown-500 rounded-2xl flex items-center justify-center shadow-warm-md active:scale-95 transition-transform"
          >
            <Plus size={22} className="text-white" />
          </button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {(["today", "all", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-brown-500 text-white shadow-warm-sm"
                  : "bg-white dark:bg-dark-100 text-brown-500 dark:text-beige-300 border border-beige-200 dark:border-dark-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="No tasks here"
            description={filter === "today" ? "Add your tasks for today!" : filter === "completed" ? "Complete some tasks first!" : "No tasks yet."}
            action={
              filter === "today" ? (
                <button onClick={() => setShowAdd(true)} className="bg-brown-500 text-white font-semibold px-6 py-3 rounded-2xl text-sm">
                  Add Task
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-2 pb-4">
            <AnimatePresence>
              {filtered.map((task) => (
                <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Card className="flex items-center gap-3 p-4">
                    <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 active:scale-90 transition-transform">
                      {task.completed ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} className="text-beige-300 dark:text-dark-50" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-brown-400/50" : "text-brown-700 dark:text-beige-100"}`}>
                          {getCategoryEmoji(task.category)} {task.title}
                        </p>
                        <span className={`text-xs font-bold flex-shrink-0 ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-yellow-500" : "text-green-500"}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-brown-400/60 dark:text-beige-500/40 mt-0.5">+{task.xpReward} XP • {task.category}</p>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="flex-shrink-0 p-1 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={16} className="text-brown-300 dark:text-beige-500/40" />
                    </button>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} onAdd={addTask} />}
      </AnimatePresence>
    </div>
  );
}

function AddTaskModal({
  onClose, onAdd
}: {
  onClose: () => void;
  onAdd: (task: { title: string; category: TaskCategory; priority: TaskPriority; date: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("work");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), category, priority, date: getTodayString() });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white dark:bg-dark-100 rounded-t-3xl p-6 safe-bottom"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brown-700 dark:text-beige-100">New Task</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-2xl bg-beige-100 dark:bg-dark-50 flex items-center justify-center">
            <X size={16} className="text-brown-500 dark:text-beige-300" />
          </button>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you want to do?"
          autoFocus
          className="w-full bg-beige-50 dark:bg-dark-200 border border-beige-200 dark:border-dark-50 rounded-2xl px-4 py-3 text-base text-brown-700 dark:text-beige-100 placeholder-beige-300 dark:placeholder-dark-50 outline-none focus:border-brown-400 transition-colors mb-4"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <div className="mb-4">
          <p className="text-xs font-semibold text-brown-500 dark:text-beige-400 mb-2 uppercase tracking-wide">Category</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  category === cat ? "bg-brown-500 text-white" : "bg-beige-100 dark:bg-dark-200 text-brown-500 dark:text-beige-300"
                }`}
              >
                {getCategoryEmoji(cat)} {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-xs font-semibold text-brown-500 dark:text-beige-400 mb-2 uppercase tracking-wide">Priority</p>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                  priority === p.value ? "bg-brown-500 text-white border-brown-500" : "bg-beige-50 dark:bg-dark-200 text-brown-500 dark:text-beige-300 border-beige-200 dark:border-dark-50"
                }`}
              >
                {p.label}
                <span className="block text-xs opacity-70">+{p.xp} XP</span>
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={!title.trim()} className="w-full" size="lg">
          Add Task
        </Button>
      </motion.div>
    </motion.div>
  );
}
