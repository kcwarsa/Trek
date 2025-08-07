
export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  completions: string[];
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xpReward: number;
  isCompleted?: boolean;
  completedAt?: string;
  category?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'any';
  photo?: string;
  voiceNote?: string;
  estimatedTime?: number;
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  completedHabits: number;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  unlockedTitles: string[];
  currentTitle: string;
  hunterRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  joinDate: string;
  manaPoints: number;
  maxMana: number;
  dailyLoginStreak: number;
  lastLoginDate: string;
  gems: number;
  avatar: string;
  focusMode: boolean;
  weeklyGoal: number;
  monthlyGoal: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
  xpReward: number;
}
