
export const getRankConfig = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
  const configs = {
    'E': { 
      colors: ['#6b7280', '#9ca3af'],
      textColor: '#6b7280'
    },
    'D': { 
      colors: ['#10b981', '#34d399'],
      textColor: '#10b981'
    },
    'C': { 
      colors: ['#3b82f6', '#60a5fa'],
      textColor: '#3b82f6'
    },
    'B': { 
      colors: ['#8b5cf6', '#a78bfa'],
      textColor: '#8b5cf6'
    },
    'A': { 
      colors: ['#f97316', '#fb923c'],
      textColor: '#f97316'
    },
    'S': { 
      colors: ['#eab308', '#fbbf24'],
      textColor: '#eab308'
    },
  };
  return configs[rank];
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const calculateLevel = (totalXp: number): number => {
  return Math.floor(totalXp / 1000) + 1;
};

export const calculateXpToNextLevel = (currentXp: number, level: number): number => {
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  return xpForNextLevel - currentXp;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const getStreakEmoji = (streak: number): string => {
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 14) return '🔥🔥';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '⚡';
  return '✨';
};
