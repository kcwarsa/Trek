"use client";

import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Trophy, Star, Crown, Target, Flame, Lock, Sparkles } from "lucide-react";
import { PlayerStats, Habit } from "../MobileHabitTracker";
import { motion } from "motion/react";

interface AchievementCenterProps {
  stats: PlayerStats;
  habits: Habit[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  requirement: number;
  progress: number;
  unlocked: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'legendary';
  xpReward: number;
}

export function AchievementCenter({ stats, habits }: AchievementCenterProps) {
  const achievements: Achievement[] = [
    {
      id: 'first_quest',
      name: 'First Steps',
      description: 'Complete your first quest',
      icon: Star,
      requirement: 1,
      progress: Math.min(stats.completedHabits, 1),
      unlocked: stats.completedHabits >= 1,
      tier: 'bronze',
      xpReward: 50,
    },
    {
      id: 'week_streak',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      requirement: 7,
      progress: Math.min(stats.longestStreak, 7),
      unlocked: stats.longestStreak >= 7,
      tier: 'bronze',
      xpReward: 100,
    },
    {
      id: 'level_5',
      name: 'Rising Hunter',
      description: 'Reach level 5',
      icon: Target,
      requirement: 5,
      progress: Math.min(stats.level, 5),
      unlocked: stats.level >= 5,
      tier: 'silver',
      xpReward: 200,
    },
    {
      id: 'month_streak',
      name: 'Legendary Persistence',
      description: 'Maintain a 30-day streak',
      icon: Crown,
      requirement: 30,
      progress: Math.min(stats.longestStreak, 30),
      unlocked: stats.longestStreak >= 30,
      tier: 'gold',
      xpReward: 500,
    },
    {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: 'Complete all quests for 7 consecutive days',
      icon: Sparkles,
      requirement: 7,
      progress: Math.min(stats.currentStreak, 7),
      unlocked: stats.currentStreak >= 7,
      tier: 'legendary',
      xpReward: 1000,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercentage = (unlockedCount / achievements.length) * 100;

  const getTierConfig = (tier: string) => {
    const configs = {
      bronze: { 
        color: 'from-amber-400 to-orange-500', 
        bgColor: 'bg-amber-500/10', 
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-400'
      },
      silver: { 
        color: 'from-gray-300 to-gray-500', 
        bgColor: 'bg-gray-500/10', 
        borderColor: 'border-gray-500/30',
        textColor: 'text-gray-300'
      },
      gold: { 
        color: 'from-yellow-300 to-yellow-500', 
        bgColor: 'bg-yellow-500/10', 
        borderColor: 'border-yellow-500/30',
        textColor: 'text-yellow-400'
      },
      legendary: { 
        color: 'from-purple-400 to-pink-500', 
        bgColor: 'bg-purple-500/10', 
        borderColor: 'border-purple-500/30',
        textColor: 'text-purple-400'
      },
    };
    return configs[tier] || configs.bronze;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-2xl font-bold text-white mb-2">Achievement Center</h1>
        <p className="text-gray-300 text-sm">
          Unlock achievements by completing quests and reaching milestones
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 pb-24">
          {/* Progress Summary */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Achievement Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Completed</span>
                <span className="text-2xl font-bold text-purple-400">
                  {unlockedCount} / {achievements.length}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{Math.round(completionPercentage)}%</div>
                <div className="text-sm text-gray-400">Achievement Rate</div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement List */}
          <div className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const tierConfig = getTierConfig(achievement.tier);
              const progressPercentage = (achievement.progress / achievement.requirement) * 100;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-2 transition-all ${
                    achievement.unlocked 
                      ? `${tierConfig.bgColor} ${tierConfig.borderColor} shadow-lg` 
                      : 'bg-gray-800/30 border-gray-700/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <motion.div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.unlocked 
                              ? `bg-gradient-to-r ${tierConfig.color}` 
                              : 'bg-gray-700'
                          }`}
                          animate={achievement.unlocked ? {
                            boxShadow: [
                              "0 0 0px rgba(147, 51, 234, 0)",
                              "0 0 20px rgba(147, 51, 234, 0.3)",
                              "0 0 0px rgba(147, 51, 234, 0)"
                            ]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {achievement.unlocked ? (
                            <Icon className="h-6 w-6 text-white" />
                          ) : (
                            <Lock className="h-6 w-6 text-gray-400" />
                          )}
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-white">{achievement.name}</h3>
                            <Badge 
                              className={`capitalize ${
                                achievement.unlocked 
                                  ? `bg-gradient-to-r ${tierConfig.color} text-white` 
                                  : 'bg-gray-700 text-gray-300'
                              }`}
                            >
                              {achievement.tier}
                            </Badge>
                            {achievement.unlocked && (
                              <Badge variant="secondary" className="bg-green-600 text-white">
                                +{achievement.xpReward} XP
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-300">{achievement.description}</p>
                          
                          {/* Progress */}
                          {!achievement.unlocked && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Progress</span>
                                <span>{achievement.progress} / {achievement.requirement}</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        {achievement.unlocked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={tierConfig.textColor}
                          >
                            <Trophy className="h-6 w-6" />
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Motivational Message */}
          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Keep Going, Hunter!</h3>
              <p className="text-green-300 text-sm">
                Every quest completed brings you closer to unlocking new achievements. 
                Stay consistent and watch your power grow!
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}