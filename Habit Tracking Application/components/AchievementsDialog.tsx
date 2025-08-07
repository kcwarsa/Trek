"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { PlayerStats, Habit } from "./HabitTracker";
import { Trophy, Star, Flame, Target, Crown, Zap, Calendar, Award, Lock } from "lucide-react";
import { motion } from "motion/react";

interface AchievementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  habits: Habit[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  requirement: number;
  type: 'streak' | 'completion' | 'level' | 'habit_count' | 'perfect_week' | 'xp';
  unlocked: boolean;
  progress: number;
  xpReward: number;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
}

export function AchievementsDialog({ isOpen, onClose, stats, habits }: AchievementsDialogProps) {
  const calculateAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [
      // Streak Achievements
      {
        id: 'first_streak',
        name: 'First Steps',
        description: 'Complete your first quest',
        icon: Star,
        requirement: 1,
        type: 'completion',
        unlocked: stats.completedHabits >= 1,
        progress: Math.min(stats.completedHabits, 1),
        xpReward: 50,
        tier: 'bronze',
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: Flame,
        requirement: 7,
        type: 'streak',
        unlocked: stats.longestStreak >= 7,
        progress: Math.min(stats.longestStreak, 7),
        xpReward: 100,
        tier: 'bronze',
      },
      {
        id: 'month_master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: Crown,
        requirement: 30,
        type: 'streak',
        unlocked: stats.longestStreak >= 30,
        progress: Math.min(stats.longestStreak, 30),
        xpReward: 300,
        tier: 'silver',
      },
      {
        id: 'legend_streak',
        name: 'Legendary Streak',
        description: 'Maintain a 100-day streak',
        icon: Trophy,
        requirement: 100,
        type: 'streak',
        unlocked: stats.longestStreak >= 100,
        progress: Math.min(stats.longestStreak, 100),
        xpReward: 1000,
        tier: 'legendary',
      },
      
      // Completion Achievements
      {
        id: 'century_club',
        name: 'Century Club',
        description: 'Complete 100 quests',
        icon: Target,
        requirement: 100,
        type: 'completion',
        unlocked: stats.completedHabits >= 100,
        progress: Math.min(stats.completedHabits, 100),
        xpReward: 500,
        tier: 'silver',
      },
      {
        id: 'thousand_hero',
        name: 'Thousand Hero',
        description: 'Complete 1000 quests',
        icon: Award,
        requirement: 1000,
        type: 'completion',
        unlocked: stats.completedHabits >= 1000,
        progress: Math.min(stats.completedHabits, 1000),
        xpReward: 2000,
        tier: 'legendary',
      },
      
      // Level Achievements
      {
        id: 'level_up',
        name: 'Rising Star',
        description: 'Reach level 5',
        icon: Star,
        requirement: 5,
        type: 'level',
        unlocked: stats.level >= 5,
        progress: Math.min(stats.level, 5),
        xpReward: 200,
        tier: 'bronze',
      },
      {
        id: 'veteran',
        name: 'Veteran Hero',
        description: 'Reach level 20',
        icon: Crown,
        requirement: 20,
        type: 'level',
        unlocked: stats.level >= 20,
        progress: Math.min(stats.level, 20),
        xpReward: 800,
        tier: 'gold',
      },
      {
        id: 'grandmaster',
        name: 'Grandmaster',
        description: 'Reach level 50',
        icon: Trophy,
        requirement: 50,
        type: 'level',
        unlocked: stats.level >= 50,
        progress: Math.min(stats.level, 50),
        xpReward: 2500,
        tier: 'legendary',
      },
      
      // Habit Count Achievements
      {
        id: 'quest_collector',
        name: 'Quest Collector',
        description: 'Create 5 different quests',
        icon: Calendar,
        requirement: 5,
        type: 'habit_count',
        unlocked: habits.length >= 5,
        progress: Math.min(habits.length, 5),
        xpReward: 150,
        tier: 'bronze',
      },
      {
        id: 'quest_master',
        name: 'Quest Master',
        description: 'Create 10 different quests',
        icon: Zap,
        requirement: 10,
        type: 'habit_count',
        unlocked: habits.length >= 10,
        progress: Math.min(habits.length, 10),
        xpReward: 400,
        tier: 'silver',
      },
      
      // XP Achievements
      {
        id: 'xp_novice',
        name: 'XP Novice',
        description: 'Earn 1,000 total XP',
        icon: Star,
        requirement: 1000,
        type: 'xp',
        unlocked: stats.totalXp >= 1000,
        progress: Math.min(stats.totalXp, 1000),
        xpReward: 100,
        tier: 'bronze',
      },
      {
        id: 'xp_champion',
        name: 'XP Champion',
        description: 'Earn 10,000 total XP',
        icon: Award,
        requirement: 10000,
        type: 'xp',
        unlocked: stats.totalXp >= 10000,
        progress: Math.min(stats.totalXp, 10000),
        xpReward: 1000,
        tier: 'gold',
      },
    ];

    return achievements.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return 0;
    });
  };

  const achievements = calculateAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800';
      case 'silver': return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
      case 'gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'legendary': return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Hero Achievements
          </DialogTitle>
          <DialogDescription>
            Unlock achievements by completing quests and reaching milestones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Achievement Summary */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-xl font-bold">Achievement Progress</h3>
                <p className="text-muted-foreground">
                  {unlockedCount} of {achievements.length} achievements unlocked
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.requirement) * 100;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`transition-all duration-300 ${
                    achievement.unlocked 
                      ? `${getTierColor(achievement.tier)} shadow-md` 
                      : 'bg-muted/30 border-dashed opacity-75'
                  }`}>
                    <CardContent className="flex items-center gap-4 p-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked 
                          ? 'bg-white/80 shadow-sm' 
                          : 'bg-muted'
                      }`}>
                        {achievement.unlocked ? (
                          <Icon className={`h-6 w-6 ${achievement.tier === 'legendary' ? 'text-purple-600' : achievement.tier === 'gold' ? 'text-yellow-600' : achievement.tier === 'silver' ? 'text-gray-600' : 'text-amber-600'}`} />
                        ) : (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <Badge variant="outline" className={getTierColor(achievement.tier)}>
                            {achievement.tier}
                          </Badge>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              +{achievement.xpReward} XP
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        
                        {/* Progress */}
                        {!achievement.unlocked && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Progress</span>
                              <span>{achievement.progress} / {achievement.requirement}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-600"
                        >
                          <Trophy className="h-6 w-6" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}