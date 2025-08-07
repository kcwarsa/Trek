"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Home, 
  Target, 
  Trophy, 
  User, 
  Plus, 
  Zap, 
  Calendar,
  Flame,
  Gift,
  Bell,
  Settings,
  Camera,
  Mic
} from "lucide-react";
import { QuestPanel } from "./mobile/QuestPanel";
import { PlayerDashboard } from "./mobile/PlayerDashboard";
import { AchievementCenter } from "./mobile/AchievementCenter";
import { ProfileScreen } from "./mobile/ProfileScreen";
import { QuickActionButton } from "./mobile/QuickActionButton";
import { DailyBonusDialog } from "./mobile/DailyBonusDialog";
import { NotificationPanel } from "./mobile/NotificationPanel";
import { ParticleBackground } from "./ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";

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
  estimatedTime?: number; // in minutes
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

export function MobileHabitTracker() {
  const [activeTab, setActiveTab] = useState("home");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
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
  });

  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [quickActionMode, setQuickActionMode] = useState<'none' | 'add' | 'photo' | 'voice'>('none');

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHabits = localStorage.getItem('habits');
      const savedStats = localStorage.getItem('playerStats');

      if (savedHabits) {
        try {
          setHabits(JSON.parse(savedHabits));
        } catch (error) {
          console.error('Error loading habits:', error);
        }
      }

      if (savedStats) {
        try {
          setPlayerStats(JSON.parse(savedStats));
        } catch (error) {
          console.error('Error loading stats:', error);
        }
      }
    }
  }, []);

  // Save data to localStorage whenever habits or stats change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('playerStats', JSON.stringify(playerStats));
    }
  }, [playerStats]);

  // Load data and check for daily bonus
  useEffect(() => {
    const savedHabits = localStorage.getItem("mobile_habits");
    const savedStats = localStorage.getItem("mobile_player_stats");

    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error("Error loading habits:", error);
      }
    }

    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setPlayerStats(stats);

        // Check for daily login bonus
        const today = new Date().toDateString();
        if (stats.lastLoginDate !== today) {
          setShowDailyBonus(true);
        }
      } catch (error) {
        console.error("Error loading player stats:", error);
      }
    } else {
      // First time user
      setShowDailyBonus(true);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("mobile_habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("mobile_player_stats", JSON.stringify(playerStats));
  }, [playerStats]);

  const handleDailyLogin = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    setPlayerStats(prev => {
      let newStreak = 1;
      if (prev.lastLoginDate === yesterday) {
        newStreak = prev.dailyLoginStreak + 1;
      }

      // Calculate bonus rewards
      const baseBonus = 50;
      const streakMultiplier = Math.min(newStreak, 7);
      const xpBonus = baseBonus * streakMultiplier;
      const gemBonus = Math.floor(newStreak / 3);

      return {
        ...prev,
        lastLoginDate: today,
        dailyLoginStreak: newStreak,
        xp: prev.xp + xpBonus,
        totalXp: prev.totalXp + xpBonus,
        gems: prev.gems + gemBonus,
        manaPoints: Math.min(prev.maxMana, prev.manaPoints + 25),
      };
    });

    setShowDailyBonus(false);
  };

  const getTodaysQuests = () => {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter(habit => !habit.isCompleted && !habit.completions.includes(today));
  };

  const getCompletedTodayQuests = () => {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter(habit => habit.completions.includes(today));
  };

  const tabConfig = [
    { id: 'home', icon: Home, label: 'Home', color: 'text-blue-500' },
    { id: 'quests', icon: Target, label: 'Quests', color: 'text-purple-500' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', color: 'text-yellow-500' },
    { id: 'profile', icon: User, label: 'Profile', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <ParticleBackground />

      {/* Safe area and status bar simulation */}
      <div className="safe-area-top h-12 bg-black/20 backdrop-blur-sm"></div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100vh-3rem)] relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center"
            >
              <Zap className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-gray-300">Good {getTimeOfDay()}</p>
              <p className="font-bold text-white">Shadow Hunter</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Daily streak indicator */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 bg-orange-500/20 px-3 py-1 rounded-full"
            >
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-300">{playerStats.dailyLoginStreak}</span>
            </motion.div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2"
            >
              <Bell className="h-5 w-5 text-gray-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">3</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <TabsContent value="home" className="h-full m-0">
              <PlayerDashboard 
                stats={playerStats}
                todaysQuests={getTodaysQuests()}
                completedToday={getCompletedTodayQuests()}
                habits={habits}
                onStatsUpdate={setPlayerStats}
                onHabitsUpdate={setHabits}
              />
            </TabsContent>

            <TabsContent value="quests" className="h-full m-0">
              <QuestPanel 
                habits={habits}
                stats={playerStats}
                onHabitsUpdate={setHabits}
                onStatsUpdate={setPlayerStats}
              />
            </TabsContent>

            <TabsContent value="achievements" className="h-full m-0">
              <AchievementCenter 
                stats={playerStats}
                habits={habits}
              />
            </TabsContent>

            <TabsContent value="profile" className="h-full m-0">
              <ProfileScreen 
                stats={playerStats}
                habits={habits}
                onStatsUpdate={setPlayerStats}
              />
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <TabsList className="grid grid-cols-4 bg-gray-900/80 backdrop-blur-lg border-t border-gray-700/50 rounded-none h-20 p-2">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col gap-1 h-full data-[state=active]:bg-gray-800/50 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg ${activeTab === tab.id ? tab.color : 'text-gray-500'}`}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <span className={`text-xs ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>
                    {tab.label}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Floating Quick Action Button */}
        <div className="absolute bottom-20 right-4 z-50">
          <QuickActionButton 
            mode={quickActionMode}
            onModeChange={setQuickActionMode}
            onAddQuest={() => {/* Handle add quest */}}
            onPhotoCapture={() => {/* Handle photo */}}
            onVoiceNote={() => {/* Handle voice */}}
          />
        </div>
      </div>

      {/* Dialogs and Overlays */}
      <DailyBonusDialog
        isOpen={showDailyBonus}
        streak={playerStats.dailyLoginStreak}
        onClaim={handleDailyLogin}
      />

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        stats={playerStats}
        habits={habits}
      />
    </div>
  );
}

function getTimeOfDay(): string {
  // Avoid hydration issues by using a static value during SSR
  if (typeof window === 'undefined') return 'day';
  
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}