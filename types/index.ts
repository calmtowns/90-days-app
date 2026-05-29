export type CategoryId = 'health' | 'sport' | 'work' | 'development' | 'askesis';

export interface Tracker {
  id: string;
  categoryId: CategoryId;
  name: string;
  icon?: string;
  createdAt: string;
  isActive: boolean;
}

export interface TrackerLog {
  trackerId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
}

export interface AskesisItem {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  currentStreak: number;
  longestStreak: number;
  lastCheckedDate: string | null; // last date it was marked done
  isActive: boolean;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export interface DayRecord {
  date: string;
  completedTrackers: string[];
  totalTrackers: number;
  xpEarned: number;
}

export interface UserProfile {
  name: string;
  onboardingCompleted: boolean;
  challengeStartDate: string;
}

export interface LevelInfo {
  level: number;
  xp: number;
  xpToNext: number;
  xpInCurrentLevel: number;
  totalXP: number;
}

export interface WeatherData {
  temp: number;
  condition: 'clear' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'storm' | 'unknown';
  description: string;
  isDay: boolean;
  feelsLike?: number;
}

export interface AppState {
  user: UserProfile;
  trackers: Tracker[];
  logs: TrackerLog[];
  askesisItems: AskesisItem[];
  notes: Note[];
  dayRecords: DayRecord[];
  totalXP: number;
  darkMode: boolean;
  weather: WeatherData | null;
  weatherLastFetched: string | null;

  // Actions
  completeOnboarding: (name: string) => void;
  addTracker: (categoryId: CategoryId, name: string, icon?: string) => void;
  removeTracker: (trackerId: string) => void;
  toggleLog: (trackerId: string, date: string) => void;
  addAskesis: (name: string) => void;
  removeAskesis: (id: string) => void;
  checkAskesis: (id: string, date: string) => void;
  checkAskesisResets: () => void;
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  setWeather: (data: WeatherData) => void;
  resetApp: () => void;
}
