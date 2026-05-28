import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppState, Task, Note, UserProfile, Character, DayProgress } from "@/types";
import { generateId, getXPForTask, getLevelFromXP, getXPForLevel, getTotalXPForLevel, getTodayString, isNightTime } from "@/lib/utils";
import { differenceInCalendarDays, parseISO } from "date-fns";

interface AppActions {
  // User
  setUser: (user: UserProfile) => void;
  completeOnboarding: (name: string, goalAreas: UserProfile["goalAreas"]) => void;

  // Tasks
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed" | "xpReward">) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  getTodayTasks: () => Task[];

  // Notes
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;

  // Character
  addXP: (amount: number) => void;
  updateCharacterState: () => void;

  // Streak & Progress
  updateDayProgress: () => void;
  calculateStreak: () => void;

  // UI
  toggleDarkMode: () => void;

  // Reset
  resetApp: () => void;
}

const initialCharacter: Character = {
  name: "Hero",
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  state: "idle",
  totalXpEarned: 0,
};

const initialState: AppState = {
  user: null,
  character: initialCharacter,
  tasks: [],
  notes: [],
  dayHistory: [],
  currentStreak: 0,
  longestStreak: 0,
  totalDaysCompleted: 0,
  challengeDay: 1,
  darkMode: false,
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      completeOnboarding: (name, goalAreas) => {
        const user: UserProfile = {
          id: generateId(),
          name,
          goalAreas,
          challengeStartDate: getTodayString(),
          createdAt: new Date().toISOString(),
          onboardingCompleted: true,
        };
        set({
          user,
          character: { ...initialCharacter, name },
        });
      },

      addTask: (taskData) => {
        const xpReward = getXPForTask(taskData.priority);
        const task: Task = {
          ...taskData,
          id: generateId(),
          completed: false,
          xpReward,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },

      toggleTask: (taskId) => {
        const { tasks, character } = get();
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const wasCompleted = task.completed;
        const updatedTasks = tasks.map((t) =>
          t.id === taskId
            ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
            : t
        );
        set({ tasks: updatedTasks });

        if (!wasCompleted) {
          get().addXP(task.xpReward);
          get().updateDayProgress();
        } else {
          const newTotalXP = Math.max(0, character.totalXpEarned - task.xpReward);
          const newLevel = getLevelFromXP(newTotalXP);
          const xpInCurrentLevel = newTotalXP - getTotalXPForLevel(newLevel);
          const xpToNext = getXPForLevel(newLevel);
          set({
            character: {
              ...character,
              xp: xpInCurrentLevel,
              level: newLevel,
              xpToNextLevel: xpToNext,
              totalXpEarned: newTotalXP,
            },
          });
          get().updateDayProgress();
        }
      },

      deleteTask: (taskId) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
      },

      getTodayTasks: () => {
        const today = getTodayString();
        return get().tasks.filter((t) => t.date === today);
      },

      addNote: (title, content) => {
        const colors = ["#FFF8F0", "#F0F8FF", "#F0FFF4", "#FFF0F8", "#FFFBF0"];
        const note: Note = {
          id: generateId(),
          title,
          content,
          color: colors[Math.floor(Math.random() * colors.length)],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [note, ...state.notes] }));
      },

      updateNote: (id, title, content) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      },

      addXP: (amount) => {
        const { character } = get();
        const newTotalXP = character.totalXpEarned + amount;
        const newLevel = getLevelFromXP(newTotalXP);
        const xpInCurrentLevel = newTotalXP - getTotalXPForLevel(newLevel);
        const xpToNext = getXPForLevel(newLevel);
        set({
          character: {
            ...character,
            xp: xpInCurrentLevel,
            level: newLevel,
            xpToNextLevel: xpToNext,
            totalXpEarned: newTotalXP,
            state: "happy",
          },
        });
        setTimeout(() => {
          const currentChar = get().character;
          if (currentChar.state === "happy") {
            get().updateCharacterState();
          }
        }, 2000);
      },

      updateCharacterState: () => {
        const todayTasks = get().getTodayTasks();
        const completedToday = todayTasks.filter((t) => t.completed).length;
        const night = isNightTime();

        let state: Character["state"] = "idle";
        if (night) state = "sleep";
        else if (completedToday > 0 && completedToday === todayTasks.length && todayTasks.length > 0) state = "happy";
        else if (completedToday > 0) state = "work";

        set((s) => ({ character: { ...s.character, state } }));
      },

      updateDayProgress: () => {
        const today = getTodayString();
        const todayTasks = get().getTodayTasks();
        const completed = todayTasks.filter((t) => t.completed).length;
        const xpEarned = todayTasks.filter((t) => t.completed).reduce((sum, t) => sum + t.xpReward, 0);
        const dayComplete = todayTasks.length > 0 && completed === todayTasks.length;

        set((state) => {
          const existing = state.dayHistory.find((d) => d.date === today);
          const newProgress: DayProgress = {
            date: today,
            tasksTotal: todayTasks.length,
            tasksCompleted: completed,
            xpEarned,
            completed: dayComplete,
          };
          const dayHistory = existing
            ? state.dayHistory.map((d) => (d.date === today ? newProgress : d))
            : [...state.dayHistory, newProgress];
          return { dayHistory };
        });
        get().calculateStreak();
      },

      calculateStreak: () => {
        const { dayHistory, user } = get();
        if (!user) return;
        const completedDays = dayHistory
          .filter((d) => d.completed)
          .map((d) => d.date)
          .sort()
          .reverse();

        if (completedDays.length === 0) {
          set({ currentStreak: 0 });
          return;
        }

        let streak = 0;
        const today = getTodayString();
        const todayIndex = completedDays.indexOf(today);
        if (todayIndex === -1 && differenceInCalendarDays(new Date(), parseISO(completedDays[0])) > 1) {
          set({ currentStreak: 0 });
          return;
        }

        for (let i = 0; i < completedDays.length; i++) {
          if (i === 0) { streak = 1; continue; }
          const diff = differenceInCalendarDays(parseISO(completedDays[i - 1]), parseISO(completedDays[i]));
          if (diff === 1) streak++;
          else break;
        }

        const challengeStart = parseISO(user.challengeStartDate);
        const challengeDay = differenceInCalendarDays(new Date(), challengeStart) + 1;
        const totalDaysCompleted = completedDays.length;

        set((state) => ({
          currentStreak: streak,
          longestStreak: Math.max(state.longestStreak, streak),
          totalDaysCompleted,
          challengeDay: Math.min(Math.max(1, challengeDay), 90),
        }));
      },

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      resetApp: () => set(initialState),
    }),
    {
      name: "90days-app-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
