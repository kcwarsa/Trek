"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Sparkles, Zap } from "lucide-react";
import { AddHabitDialog } from "./AddHabitDialog";
import { HabitItem } from "./HabitItem";
import { PlayerProfile } from "./PlayerProfile";
import { StatsDialog } from "./StatsDialog";
import { AchievementsDialog } from "./AchievementsDialog";
import { LevelUpDialog } from "./LevelUpDialog";
import { RankUpDialog } from "./RankUpDialog";
import { ParticleBackground } from "./ParticleBackground";
import { motion, AnimatePresence } from "motion/react";

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  completions: string[]; // Array of date strings in YYYY-MM-DD format
  category?: string;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xpReward: number;
  isCompleted?: boolean;
  completedAt?: string;
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
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'completion' | 'level' | 'habit_count' | 'perfect_week' | 'rank';
  unlocked: boolean;
  xpReward: number;
}

export function HabitTracker() {
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
  });
  
  const [activeTab, setActiveTab] = useState("active");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isAchievementsDialogOpen, setIsAchievementsDialogOpen] = useState(false);
  const [levelUpDialog, setLevelUpDialog] = useState<{ isOpen: boolean; newLevel: number }>({
    isOpen: false,
    newLevel: 1,
  });
  const [rankUpDialog, setRankUpDialog] = useState<{ isOpen: boolean; newRank: string }>({
    isOpen: false,
    newRank: 'E',
  });
  const [xpAnimation, setXpAnimation] = useState<{ show: boolean; amount: number; type: 'xp' | 'mana' }>({
    show: false,
    amount: 0,
    type: 'xp',
  });

  // Load data from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("solo_leveling_habits");
    const savedStats = localStorage.getItem("solo_leveling_player_stats");
    
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (error) {
        console.error("Error loading habits:", error);
      }
    }
    
    if (savedStats) {
      try {
        setPlayerStats(JSON.parse(savedStats));
      } catch (error) {
        console.error("Error loading player stats:", error);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("solo_leveling_habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("solo_leveling_player_stats", JSON.stringify(playerStats));
  }, [playerStats]);

  const calculateXpForLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  const showAnimation = (amount: number, type: 'xp' | 'mana' = 'xp') => {
    setXpAnimation({ show: true, amount, type });
    setTimeout(() => setXpAnimation({ show: false, amount: 0, type: 'xp' }), 2500);
  };

  const addHabit = (name: string, rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const xpRewards = { E: 10, D: 20, C: 35, B: 50, A: 80, S: 120 };
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      completions: [],
      rank,
      xpReward: xpRewards[rank],
    };
    setHabits([...habits, newHabit]);
    setIsAddDialogOpen(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const completeQuest = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Mark quest as completed
    const updatedHabits = habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          completions: [...h.completions, today]
        };
      }
      return h;
    });

    setHabits(updatedHabits);

    // Calculate XP and bonuses
    let xpGained = habit.xpReward;
    let manaGained = Math.floor(habit.xpReward / 2);
    
    // Streak bonus
    const currentStreak = calculateOverallStreak(updatedHabits, today);
    if (currentStreak >= 7) {
      xpGained += 25;
      manaGained += 10;
    }
    if (currentStreak >= 30) {
      xpGained += 50;
      manaGained += 20;
    }

    // Daily quest bonus
    const dailyQuestBonus = Math.floor(Math.random() * 20) + 10;
    xpGained += dailyQuestBonus;

    // Update player stats
    setPlayerStats(prev => {
      const newXp = prev.xp + xpGained;
      const newTotalXp = prev.totalXp + xpGained;
      const newCompletedHabits = prev.completedHabits + 1;
      const newCurrentStreak = currentStreak;
      const newLongestStreak = Math.max(prev.longestStreak, currentStreak);
      const newMana = Math.min(prev.maxMana, prev.manaPoints + manaGained);
      
      // Check for level up
      let newLevel = prev.level;
      let xpToNextLevel = prev.xpToNextLevel;
      
      if (newXp >= xpToNextLevel) {
        newLevel += 1;
        const nextLevelXp = calculateXpForLevel(newLevel + 1);
        xpToNextLevel = nextLevelXp;
        
        // Show level up dialog
        setLevelUpDialog({ isOpen: true, newLevel });
      }

      // Check for rank up
      let newRank = prev.hunterRank;
      if (newLevel >= 50 && prev.hunterRank === 'A') newRank = 'S';
      else if (newLevel >= 40 && prev.hunterRank === 'B') newRank = 'A';
      else if (newLevel >= 30 && prev.hunterRank === 'C') newRank = 'B';
      else if (newLevel >= 20 && prev.hunterRank === 'D') newRank = 'C';
      else if (newLevel >= 10 && prev.hunterRank === 'E') newRank = 'D';

      if (newRank !== prev.hunterRank) {
        setRankUpDialog({ isOpen: true, newRank });
      }
      
      return {
        ...prev,
        xp: newXp >= prev.xpToNextLevel ? newXp - prev.xpToNextLevel : newXp,
        totalXp: newTotalXp,
        level: newLevel,
        xpToNextLevel,
        completedHabits: newCompletedHabits,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        hunterRank: newRank,
        manaPoints: newMana,
      };
    });

    showAnimation(xpGained, 'xp');
    setTimeout(() => showAnimation(manaGained, 'mana'), 500);
  };

  const resetCompletedQuests = () => {
    setHabits(habits.filter(habit => !habit.isCompleted));
  };

  const calculateOverallStreak = (habitsData: Habit[], upToDate: string): number => {
    const today = new Date(upToDate);
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      const hasAnyCompletion = habitsData.some(habit => 
        habit.completions.includes(dateString)
      );
      
      if (hasAnyCompletion) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const activeQuests = habits.filter(habit => !habit.isCompleted);
  const completedQuests = habits.filter(habit => habit.isCompleted);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-conic from-indigo-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">
        {/* XP/Mana Animations */}
        <AnimatePresence>
          {xpAnimation.show && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -150, scale: 1 }}
              exit={{ opacity: 0, y: -200 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className={`px-8 py-4 rounded-full shadow-2xl text-2xl font-bold border-2 ${
                xpAnimation.type === 'xp' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300 shadow-yellow-500/50' 
                  : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-blue-300 shadow-blue-500/50'
              }`}>
                <div className="flex items-center gap-2">
                  {xpAnimation.type === 'xp' ? (
                    <>
                      <Sparkles className="h-6 w-6" />
                      +{xpAnimation.amount} XP
                    </>
                  ) : (
                    <>
                      <Zap className="h-6 w-6" />
                      +{xpAnimation.amount} MP
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header with Player Profile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-6"
        >
          <div className="flex-1">
            <PlayerProfile 
              stats={playerStats}
              onOpenStats={() => setIsStatsDialogOpen(true)}
              onOpenAchievements={() => setIsAchievementsDialogOpen(true)}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">
                  Hunter's Guild
                </h1>
                <p className="text-gray-300 mt-2">Complete daily quests to grow stronger and level up!</p>
              </div>
              <div className="flex gap-3">
                {completedQuests.length > 0 && (
                  <Button 
                    onClick={resetCompletedQuests}
                    variant="outline" 
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Clear Completed
                  </Button>
                )}
                <Button 
                  onClick={() => setIsAddDialogOpen(true)} 
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 border border-purple-400/30"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Quest
                </Button>
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              <TabsTrigger 
                value="active" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Active Quests ({activeQuests.length})
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Completed ({completedQuests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <AnimatePresence mode="wait">
                {activeQuests.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="border-2 border-dashed border-gray-600/50 bg-gray-800/30 backdrop-blur-sm">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="mb-6"
                        >
                          <Sparkles className="h-16 w-16 text-purple-400" />
                        </motion.div>
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl font-bold text-white">No Active Quests</h3>
                          <p className="text-gray-300 max-w-md">
                            Your quest log is empty, Hunter. Accept new challenges to begin your journey of growth!
                          </p>
                          <Button 
                            onClick={() => setIsAddDialogOpen(true)} 
                            className="mt-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Accept First Quest
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {activeQuests.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <HabitItem
                          habit={habit}
                          today={today}
                          onComplete={completeQuest}
                          onDelete={deleteHabit}
                          playerStats={playerStats}
                          isActive={true}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <AnimatePresence mode="wait">
                {completedQuests.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="border-2 border-dashed border-gray-600/50 bg-gray-800/30 backdrop-blur-sm">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <motion.div
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="mb-6"
                        >
                          <Sparkles className="h-16 w-16 text-green-400" />
                        </motion.div>
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl font-bold text-white">No Completed Quests</h3>
                          <p className="text-gray-300">
                            Complete some active quests to see your achievements here!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {completedQuests.map((habit, index) => (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <HabitItem
                          habit={habit}
                          today={today}
                          onComplete={() => {}}
                          onDelete={deleteHabit}
                          playerStats={playerStats}
                          isActive={false}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Dialogs */}
        <AddHabitDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={addHabit}
        />

        <StatsDialog
          isOpen={isStatsDialogOpen}
          onClose={() => setIsStatsDialogOpen(false)}
          stats={playerStats}
          habits={habits}
        />

        <AchievementsDialog
          isOpen={isAchievementsDialogOpen}
          onClose={() => setIsAchievementsDialogOpen(false)}
          stats={playerStats}
          habits={habits}
        />

        <LevelUpDialog
          isOpen={levelUpDialog.isOpen}
          newLevel={levelUpDialog.newLevel}
          onClose={() => setLevelUpDialog({ isOpen: false, newLevel: 1 })}
        />

        <RankUpDialog
          isOpen={rankUpDialog.isOpen}
          newRank={rankUpDialog.newRank as 'E' | 'D' | 'C' | 'B' | 'A' | 'S'}
          onClose={() => setRankUpDialog({ isOpen: false, newRank: 'E' })}
        />
      </div>
    </div>
  );
}