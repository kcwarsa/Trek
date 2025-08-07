"use client";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Trophy, BarChart3, Star, Crown, Zap, Shield, Sword } from "lucide-react";
import { PlayerStats } from "./HabitTracker";
import { motion } from "motion/react";

interface PlayerProfileProps {
  stats: PlayerStats;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
}

export function PlayerProfile({ stats, onOpenStats, onOpenAchievements }: PlayerProfileProps) {
  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;
  const manaProgress = (stats.manaPoints / stats.maxMana) * 100;

  const getRankConfig = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const configs = {
      'E': { color: 'from-gray-400 to-gray-600', textColor: 'text-gray-400', bgColor: 'bg-gray-500/10' },
      'D': { color: 'from-green-400 to-green-600', textColor: 'text-green-400', bgColor: 'bg-green-500/10' },
      'C': { color: 'from-blue-400 to-blue-600', textColor: 'text-blue-400', bgColor: 'bg-blue-500/10' },
      'B': { color: 'from-purple-400 to-purple-600', textColor: 'text-purple-400', bgColor: 'bg-purple-500/10' },
      'A': { color: 'from-orange-400 to-red-600', textColor: 'text-orange-400', bgColor: 'bg-orange-500/10' },
      'S': { color: 'from-yellow-300 via-yellow-400 to-orange-500', textColor: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    };
    
    return configs[rank];
  };

  const rankConfig = getRankConfig(stats.hunterRank);

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-lg border-2 border-gray-700/50 shadow-2xl shadow-purple-500/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-6">
          {/* Hunter Avatar */}
          <motion.div 
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${rankConfig.color} flex items-center justify-center shadow-2xl border-4 border-white/20 relative overflow-hidden`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Crown className="h-10 w-10 text-white relative z-10" />
            
            {/* Rank indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${rankConfig.color} border-2 border-white flex items-center justify-center shadow-lg`}
            >
              <span className="text-white text-sm font-bold">{stats.hunterRank}</span>
            </motion.div>
          </motion.div>
          
          {/* Hunter Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">Shadow Hunter</h2>
              <Badge className={`bg-gradient-to-r ${rankConfig.color} text-white px-3 py-1 shadow-lg`}>
                {stats.hunterRank}-Rank
              </Badge>
              <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600">
                {stats.currentTitle}
              </Badge>
            </div>
            
            <div className="flex items-center gap-6 flex-wrap">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-bold text-white">Level {stats.level}</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Trophy className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-gray-300">{stats.totalXp.toLocaleString()} Total XP</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Sword className="h-5 w-5 text-red-400" />
                <span className="text-sm text-gray-300">{stats.completedHabits} Quests</span>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOpenStats} 
              className="border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Stats
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOpenAchievements} 
              className="border-purple-500/50 bg-purple-900/20 text-purple-300 hover:bg-purple-800/30 hover:text-purple-200 transition-all duration-300"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Achievements
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* XP Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Experience Points
            </span>
            <span className="text-sm text-gray-400">
              {stats.xp} / {stats.xpToNextLevel} XP
            </span>
          </div>
          <div className="relative">
            <Progress value={xpProgress} className="h-4 bg-gray-800" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {Math.round(xpProgress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Mana Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              Mana Points
            </span>
            <span className="text-sm text-gray-400">
              {stats.manaPoints} / {stats.maxMana} MP
            </span>
          </div>
          <div className="relative">
            <Progress value={manaProgress} className="h-3 bg-gray-800" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-full"
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Hunter Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
            </motion.div>
            <div className="text-xl font-bold text-green-400">
              {stats.completedHabits}
            </div>
            <div className="text-xs text-green-300/80">Quests Cleared</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            </motion.div>
            <div className="text-xl font-bold text-orange-400">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-orange-300/80">Current Streak</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            </motion.div>
            <div className="text-xl font-bold text-purple-400">
              {stats.longestStreak}
            </div>
            <div className="text-xs text-purple-300/80">Record Streak</div>
          </motion.div>
        </div>

        {/* Power Level Indicator */}
        <motion.div
          className={`p-4 rounded-xl bg-gradient-to-r ${rankConfig.bgColor} border border-gray-600/30 backdrop-blur-sm`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0px rgba(147, 51, 234, 0.5)",
                    "0 0 20px rgba(147, 51, 234, 0.8)",
                    "0 0 0px rgba(147, 51, 234, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${rankConfig.color} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-sm">{stats.hunterRank}</span>
              </motion.div>
              <div>
                <div className="text-sm font-medium text-white">Hunter Power Level</div>
                <div className={`text-xs ${rankConfig.textColor}`}>
                  {stats.hunterRank}-Rank Classification
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {(stats.totalXp + stats.level * 100).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Combat Power</div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}