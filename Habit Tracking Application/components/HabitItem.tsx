"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Calendar, Flame, Target, Trash2, Star, Crown, Zap, Sword, CheckCircle, Play, Award } from "lucide-react";
import { Habit, PlayerStats } from "./HabitTracker";
import { motion, AnimatePresence } from "motion/react";

interface HabitItemProps {
  habit: Habit;
  today: string;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  playerStats: PlayerStats;
  isActive: boolean;
}

export function HabitItem({ habit, today, onComplete, onDelete, playerStats, isActive }: HabitItemProps) {
  const totalCompletions = habit.completions.length;

  // Calculate current streak for this specific habit
  const calculateHabitStreak = () => {
    if (habit.completions.length === 0) return 0;
    
    const sortedCompletions = [...habit.completions].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (sortedCompletions.includes(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateHabitStreak();

  // Get recent completion dates for visual feedback
  const getRecentDays = () => {
    const days = [];
    const currentDate = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const isCompleted = habit.completions.includes(dateString);
      const isToday = dateString === today;
      
      days.push({
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isCompleted,
        isToday,
      });
    }
    
    return days;
  };

  const recentDays = getRecentDays();

  const getRankConfig = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const configs = {
      'E': {
        icon: Star,
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/30',
        glowColor: 'shadow-gray-500/20',
        label: 'E-Rank Quest',
        gradientFrom: 'from-gray-400',
        gradientTo: 'to-gray-600',
      },
      'D': {
        icon: Target,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        glowColor: 'shadow-green-500/20',
        label: 'D-Rank Quest',
        gradientFrom: 'from-green-400',
        gradientTo: 'to-green-600',
      },
      'C': {
        icon: Sword,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        glowColor: 'shadow-blue-500/20',
        label: 'C-Rank Quest',
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-blue-600',
      },
      'B': {
        icon: Crown,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        glowColor: 'shadow-purple-500/20',
        label: 'B-Rank Quest',
        gradientFrom: 'from-purple-400',
        gradientTo: 'to-purple-600',
      },
      'A': {
        icon: Zap,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        glowColor: 'shadow-orange-500/20',
        label: 'A-Rank Quest',
        gradientFrom: 'from-orange-400',
        gradientTo: 'to-red-600',
      },
      'S': {
        icon: Crown,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        glowColor: 'shadow-yellow-500/20',
        label: 'S-Rank Quest',
        gradientFrom: 'from-yellow-300',
        gradientTo: 'to-orange-500',
      },
    };
    
    return configs[rank];
  };

  const rankConfig = getRankConfig(habit.rank);
  const RankIcon = rankConfig.icon;

  // Calculate bonus XP for streaks
  const getBonusXp = () => {
    let bonus = 0;
    if (playerStats.currentStreak >= 7) bonus += 25;
    if (playerStats.currentStreak >= 30) bonus += 50;
    return bonus;
  };

  const bonusXp = getBonusXp();
  const totalXpReward = habit.xpReward + bonusXp;

  return (
    <motion.div
      layout
      whileHover={{ scale: isActive ? 1.02 : 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className={`border-2 transition-all duration-500 backdrop-blur-sm ${
        habit.isCompleted 
          ? 'bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-900/30 border-green-500/30 shadow-lg shadow-green-500/10' 
          : `${rankConfig.bgColor} ${rankConfig.borderColor} hover:shadow-lg ${rankConfig.glowColor} bg-gradient-to-br from-gray-800/50 via-gray-900/30 to-gray-800/50`
      }`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                {/* Rank Icon with Animation */}
                <motion.div
                  animate={!habit.isCompleted ? {
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                  className={`w-10 h-10 rounded-full ${rankConfig.bgColor} ${rankConfig.borderColor} border-2 flex items-center justify-center`}
                >
                  <RankIcon className={`h-5 w-5 ${rankConfig.color}`} />
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg leading-tight">{habit.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Rank Badge */}
                    <Badge className={`bg-gradient-to-r ${rankConfig.gradientFrom} ${rankConfig.gradientTo} text-white px-2 py-1 text-sm shadow-sm`}>
                      {habit.rank}-Rank
                    </Badge>
                    
                    {/* Status Badge */}
                    {habit.isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1"
                      >
                        <Badge className="bg-green-600 text-white px-2 py-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </motion.div>
                    ) : (
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        <Play className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quest Stats */}
              <div className="flex items-center gap-6 flex-wrap text-sm">
                <div className="flex items-center gap-1 text-gray-300">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span>{currentStreak} streak</span>
                </div>
                
                <div className="flex items-center gap-1 text-gray-300">
                  <Award className="h-4 w-4 text-purple-400" />
                  <span>{totalCompletions} victories</span>
                </div>

                <div className="flex items-center gap-1 text-yellow-300">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium">+{habit.xpReward} XP</span>
                  {bonusXp > 0 && !habit.isCompleted && (
                    <span className="text-orange-300">
                      (+{bonusXp} bonus)
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {habit.completedAt && (
                <div className="text-xs text-gray-400 text-right">
                  Completed<br/>
                  {new Date(habit.completedAt).toLocaleDateString()}
                </div>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900 border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      {habit.isCompleted ? 'Remove Completed Quest' : 'Abandon Quest'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      Are you sure you want to {habit.isCompleted ? 'remove' : 'abandon'} "{habit.name}"? 
                      This will permanently delete the quest and all progress data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-800 text-gray-300 border-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(habit.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {habit.isCompleted ? 'Remove' : 'Abandon'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quest Action Button - Only for Active Quests */}
          <AnimatePresence>
            {isActive && !habit.isCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-xl border-2 border-dashed ${rankConfig.borderColor} ${rankConfig.bgColor} backdrop-blur-sm`}
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-8 h-8 rounded-full ${rankConfig.bgColor} border ${rankConfig.borderColor} flex items-center justify-center`}
                    >
                      <Play className={`h-4 w-4 ${rankConfig.color}`} />
                    </motion.div>
                    <div>
                      <div className="font-medium text-white">Complete Quest Today</div>
                      <div className="text-sm text-gray-300">Gain experience and grow stronger!</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <div className="text-yellow-300 font-bold">+{totalXpReward} XP</div>
                      <div className="text-blue-300">+{Math.floor(totalXpReward/2)} MP</div>
                    </div>
                    <Button
                      onClick={() => onComplete(habit.id)}
                      className={`bg-gradient-to-r ${rankConfig.gradientFrom} ${rankConfig.gradientTo} hover:scale-105 text-white shadow-lg ${rankConfig.glowColor} transition-all duration-300`}
                    >
                      Complete Quest
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weekly Progress Chart */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Quest Progress (Last 7 days)</span>
            </div>
            <div className="flex gap-2">
              {recentDays.map((day, index) => (
                <motion.div
                  key={day.date}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg min-w-0 flex-1 transition-all backdrop-blur-sm ${
                    day.isToday
                      ? 'bg-purple-500/20 border-2 border-purple-400/40'
                      : 'bg-gray-800/30 border border-gray-600/30'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-xs text-gray-300 uppercase tracking-wider font-medium">
                    {day.day}
                  </span>
                  <motion.div
                    className={`w-6 h-6 rounded-full border-2 relative ${
                      day.isCompleted
                        ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                    animate={day.isCompleted ? { 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 0px rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.8)",
                        "0 0 0px rgba(34, 197, 94, 0.5)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {day.isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Star className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                  {day.isToday && (
                    <span className="text-xs font-medium text-purple-400">Today</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}