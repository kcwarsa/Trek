"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Star, 
  Zap, 
  Target, 
  Flame, 
  Crown, 
  ChevronRight, 
  Trophy,
  Calendar,
  TrendingUp,
  Shield,
  CheckCircle,
  Plus
} from "lucide-react";
import { PlayerStats, Habit } from "../MobileHabitTracker";
import { motion, AnimatePresence } from "motion/react";

interface PlayerDashboardProps {
  stats: PlayerStats;
  todaysQuests: Habit[];
  completedToday: Habit[];
  habits: Habit[];
  onStatsUpdate: (stats: PlayerStats) => void;
  onHabitsUpdate: (habits: Habit[]) => void;
}

export function PlayerDashboard({ 
  stats, 
  todaysQuests, 
  completedToday, 
  habits,
  onStatsUpdate,
  onHabitsUpdate 
}: PlayerDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;
  const manaProgress = (stats.manaPoints / stats.maxMana) * 100;
  const dailyProgress = (completedToday.length / Math.max(1, todaysQuests.length + completedToday.length)) * 100;

  const handlePullRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add small mana regeneration on refresh
    onStatsUpdate({
      ...stats,
      manaPoints: Math.min(stats.maxMana, stats.manaPoints + 5)
    });
    
    setRefreshing(false);
  };

  const completeQuest = (questId: string) => {
    const quest = habits.find(h => h.id === questId);
    if (!quest) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(h => {
      if (h.id === questId) {
        return {
          ...h,
          completions: [...h.completions, today]
        };
      }
      return h;
    });

    onHabitsUpdate(updatedHabits);

    // Update stats
    const xpGained = quest.xpReward + (stats.currentStreak >= 7 ? 25 : 0);
    const manaGained = Math.floor(quest.xpReward / 2);

    onStatsUpdate({
      ...stats,
      xp: stats.xp + xpGained,
      totalXp: stats.totalXp + xpGained,
      completedHabits: stats.completedHabits + 1,
      manaPoints: Math.min(stats.maxMana, stats.manaPoints + manaGained),
    });
  };

  const getRankConfig = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const configs = {
      'E': { color: 'from-gray-400 to-gray-600', textColor: 'text-gray-400' },
      'D': { color: 'from-green-400 to-green-600', textColor: 'text-green-400' },
      'C': { color: 'from-blue-400 to-blue-600', textColor: 'text-blue-400' },
      'B': { color: 'from-purple-400 to-purple-600', textColor: 'text-purple-400' },
      'A': { color: 'from-orange-400 to-red-600', textColor: 'text-orange-400' },
      'S': { color: 'from-yellow-300 to-orange-500', textColor: 'text-yellow-400' },
    };
    return configs[rank];
  };

  const rankConfig = getRankConfig(stats.hunterRank);

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 space-y-6 pb-24"
        onPanStart={() => setRefreshing(true)}
        onPanEnd={() => setTimeout(() => setRefreshing(false), 1000)}
      >
        {/* Pull to refresh indicator */}
        <AnimatePresence>
          {refreshing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center py-2"
            >
              <div className="flex items-center gap-2 text-blue-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-4 w-4" />
                </motion.div>
                <span className="text-sm">Regenerating Mana...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hunter Profile Card */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${rankConfig.color} flex items-center justify-center relative`}
                whileHover={{ scale: 1.05 }}
              >
                <Crown className="h-8 w-8 text-white" />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r ${rankConfig.color} border-2 border-white flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{stats.hunterRank}</span>
                </div>
              </motion.div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Shadow Hunter</h2>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`bg-gradient-to-r ${rankConfig.color} text-white`}>
                    {stats.hunterRank}-Rank Hunter
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    Level {stats.level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Experience Points</span>
                <span className="text-gray-400">{stats.xp} / {stats.xpToNextLevel}</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>

            {/* Mana Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">Mana Points</span>
                <span className="text-blue-400">{stats.manaPoints} / {stats.maxMana}</span>
              </div>
              <Progress value={manaProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Today's Progress */}
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-purple-400" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Completed Quests</span>
              <span className="text-2xl font-bold text-purple-400">
                {completedToday.length} / {todaysQuests.length + completedToday.length}
              </span>
            </div>
            <Progress value={dailyProgress} className="h-3" />
            
            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <Target className="h-5 w-5 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-400">{stats.completedHabits}</div>
                <div className="text-xs text-green-300">Total Quests</div>
              </div>
              
              <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Flame className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-orange-400">{stats.currentStreak}</div>
                <div className="text-xs text-orange-300">Day Streak</div>
              </div>
              
              <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Trophy className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-yellow-400">{stats.gems}</div>
                <div className="text-xs text-yellow-300">Gems</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Quests */}
        <Card className="bg-gray-900/90 backdrop-blur border-gray-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                Active Quests
              </div>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {todaysQuests.length} remaining
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {todaysQuests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-300 mb-2">All quests completed!</p>
                  <p className="text-sm text-gray-400">Great work, Hunter!</p>
                </motion.div>
              ) : (
                todaysQuests.slice(0, 3).map((quest, index) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankConfig(quest.rank).color} flex items-center justify-center text-white text-sm font-bold`}>
                      {quest.rank}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{quest.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-yellow-400">+{quest.xpReward} XP</span>
                        {quest.estimatedTime && (
                          <span className="text-xs text-gray-400">{quest.estimatedTime}min</span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => completeQuest(quest.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Complete
                    </Button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            
            {todaysQuests.length > 3 && (
              <Button variant="ghost" className="w-full text-gray-300 hover:text-white">
                View All Quests ({todaysQuests.length - 3} more)
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        {stats.achievements.length > 0 && (
          <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur border-yellow-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Recent Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Star className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="font-bold text-yellow-400">First Steps</p>
                  <p className="text-sm text-yellow-300">Completed your first quest!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </ScrollArea>
  );
}