export type TaskCategory = 'health' | 'work' | 'learning' | 'mindfulness' | 'fitness' | 'social' | 'creative' | 'other';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  xpReward: number;
  createdAt: string;
  completedAt?: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export type CharacterState = 'idle' | 'work' | 'sleep' | 'happy' | 'workout';

export type CharacterLevel = 'beginner' | 'discipline' | 'momentum' | 'transformation';

export interface Character {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  state: CharacterState;
  totalXpEarned: number;
}

export interface DayProgress {
  date: string;
  tasksTotal: number;
  tasksCompleted: number;
  xpEarned: number;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: string;
}

export type GoalArea = 'health' | 'career' | 'relationships' | 'learning' | 'finance' | 'creativity' | 'mindfulness' | 'fitness';

export interface UserProfile {
  id: string;
  name: string;
  goalAreas: GoalArea[];
  challengeStartDate: string;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface AppState {
  user: UserProfile | null;
  character: Character;
  tasks: Task[];
  notes: Note[];
  dayHistory: DayProgress[];
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  challengeDay: number;
  darkMode: boolean;
}

export interface LevelInfo {
  level: number;
  name: string;
  tier: CharacterLevel;
  xpRequired: number;
  xpTotal: number;
}
