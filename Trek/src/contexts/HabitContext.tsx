
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, PlayerStats } from '../types';

interface HabitContextType {
  habits: Habit[];
  playerStats: PlayerStats;
  updateHabits: (habits: Habit[]) => void;
  updatePlayerStats: (stats: PlayerStats) => void;
  completeHabit: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const initialPlayerStats: PlayerStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  totalXp: 0,
  completedHabits: 0,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [],
  unlockedTitles: ['Novice Hunter'],
  currentTitle: 'Novice Hunter',
  hunterRank: 'E',
  joinDate: new Date().toISOString(),
  manaPoints: 100,
  maxMana: 100,
  dailyLoginStreak: 0,
  lastLoginDate: '',
  gems: 0,
  avatar: 'default',
  focusMode: false,
  weeklyGoal: 7,
  monthlyGoal: 30,
};

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(initialPlayerStats);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [habits, playerStats]);

  const loadData = async () => {
    try {
      const [savedHabits, savedStats] = await Promise.all([
        AsyncStorage.getItem('habits'),
        AsyncStorage.getItem('playerStats'),
      ]);

      if (savedHabits) {
        setHabits(JSON.parse(savedHabits));
      }
      
      if (savedStats) {
        setPlayerStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('habits', JSON.stringify(habits)),
        AsyncStorage.setItem('playerStats', JSON.stringify(playerStats)),
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const updateHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
  };

  const updatePlayerStats = (newStats: PlayerStats) => {
    setPlayerStats(newStats);
  };

  const completeHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          completions: [...h.completions, today],
          completedAt: new Date().toISOString(),
        };
      }
      return h;
    });

    setHabits(updatedHabits);

    // Update stats
    const xpGained = habit.xpReward + (playerStats.currentStreak >= 7 ? 25 : 0);
    const manaGained = Math.floor(xpGained / 2);

    setPlayerStats(prev => ({
      ...prev,
      xp: prev.xp + xpGained,
      totalXp: prev.totalXp + xpGained,
      completedHabits: prev.completedHabits + 1,
      manaPoints: Math.min(prev.maxMana, prev.manaPoints + manaGained),
    }));
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completions: [],
    };
    
    setHabits(prev => [...prev, newHabit]);
  };

  const value: HabitContextType = {
    habits,
    playerStats,
    updateHabits,
    updatePlayerStats,
    completeHabit,
    addHabit,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
