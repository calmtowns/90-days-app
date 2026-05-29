import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, CategoryId, Tracker, TrackerLog, AskesisItem, Note, WeatherData } from '@/types';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
const today = () => new Date().toISOString().split('T')[0];

const XP_PER_TRACKER = 15;
const XP_ASKESIS_BONUS = 25;

function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function getLevelFromXP(totalXP: number): { level: number; xpInLevel: number; xpToNext: number } {
  let level = 1;
  let remaining = totalXP;
  while (remaining >= getXPForLevel(level)) {
    remaining -= getXPForLevel(level);
    level++;
    if (level >= 100) break;
  }
  return { level, xpInLevel: remaining, xpToNext: getXPForLevel(level) };
}

const defaultTrackers: Tracker[] = [
  { id: 'h1', categoryId: 'health', name: 'Drink 2L water', icon: '💧', createdAt: today(), isActive: true },
  { id: 'h2', categoryId: 'health', name: 'Sleep 8 hours', icon: '🌙', createdAt: today(), isActive: true },
  { id: 's1', categoryId: 'sport', name: 'Morning workout', icon: '💪', createdAt: today(), isActive: true },
  { id: 'w1', categoryId: 'work', name: 'Deep work 2h', icon: '🎯', createdAt: today(), isActive: true },
  { id: 'd1', categoryId: 'development', name: 'Read 30 min', icon: '📚', createdAt: today(), isActive: true },
];

const initialState = {
  user: { name: '', onboardingCompleted: false, challengeStartDate: today() },
  trackers: defaultTrackers,
  logs: [] as TrackerLog[],
  askesisItems: [] as AskesisItem[],
  notes: [] as Note[],
  dayRecords: [],
  totalXP: 0,
  darkMode: true,
  weather: null,
  weatherLastFetched: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeOnboarding: (name) => set(s => ({
        user: { ...s.user, name, onboardingCompleted: true, challengeStartDate: today() }
      })),

      addTracker: (categoryId, name, icon) => set(s => ({
        trackers: [...s.trackers, { id: generateId(), categoryId, name, icon, createdAt: today(), isActive: true }]
      })),

      removeTracker: (trackerId) => set(s => ({
        trackers: s.trackers.filter(t => t.id !== trackerId)
      })),

      toggleLog: (trackerId, date) => set(s => {
        const existing = s.logs.find(l => l.trackerId === trackerId && l.date === date);
        let newLogs: TrackerLog[];
        let xpDelta = 0;

        if (existing) {
          newLogs = s.logs.map(l =>
            l.trackerId === trackerId && l.date === date
              ? { ...l, completed: !l.completed, completedAt: !l.completed ? new Date().toISOString() : undefined }
              : l
          );
          xpDelta = existing.completed ? -XP_PER_TRACKER : XP_PER_TRACKER;
        } else {
          newLogs = [...s.logs, { trackerId, date, completed: true, completedAt: new Date().toISOString() }];
          xpDelta = XP_PER_TRACKER;
        }

        return { logs: newLogs, totalXP: Math.max(0, s.totalXP + xpDelta) };
      }),

      addAskesis: (name) => set(s => ({
        askesisItems: [...s.askesisItems, {
          id: generateId(), name, startDate: today(), currentStreak: 0,
          longestStreak: 0, lastCheckedDate: null, isActive: true
        }]
      })),

      removeAskesis: (id) => set(s => ({
        askesisItems: s.askesisItems.filter(a => a.id !== id)
      })),

      checkAskesis: (id, date) => set(s => ({
        askesisItems: s.askesisItems.map(a => {
          if (a.id !== id) return a;
          const newStreak = a.currentStreak + 1;
          return {
            ...a,
            lastCheckedDate: date,
            currentStreak: newStreak,
            longestStreak: Math.max(a.longestStreak, newStreak),
          };
        }),
        totalXP: s.totalXP + XP_ASKESIS_BONUS,
      })),

      checkAskesisResets: () => {
        const todayStr = today();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        set(s => ({
          askesisItems: s.askesisItems.map(a => {
            if (!a.isActive) return a;
            // If last checked was not today or yesterday, reset streak
            if (a.lastCheckedDate && a.lastCheckedDate !== todayStr && a.lastCheckedDate !== yesterdayStr) {
              return { ...a, currentStreak: 0, startDate: todayStr };
            }
            return a;
          })
        }));
      },

      addNote: (content) => set(s => ({
        notes: [{ id: generateId(), content, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...s.notes]
      })),

      updateNote: (id, content) => set(s => ({
        notes: s.notes.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n)
      })),

      deleteNote: (id) => set(s => ({ notes: s.notes.filter(n => n.id !== id) })),

      setWeather: (data) => set({ weather: data, weatherLastFetched: new Date().toISOString() }),

      resetApp: () => set(initialState),
    }),
    { name: '90-days-storage-v2' }
  )
);
