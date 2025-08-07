"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Crown, Sparkles, Zap, Award } from "lucide-react";
import { motion } from "motion/react";

interface RankUpDialogProps {
  isOpen: boolean;
  newRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  onClose: () => void;
}

export function RankUpDialog({ isOpen, newRank, onClose }: RankUpDialogProps) {
  const getRankConfig = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const configs = {
      'E': { 
        name: 'E-Rank Hunter', 
        color: 'from-gray-400 to-gray-600',
        glow: 'shadow-gray-500/50',
        description: 'Novice Hunter'
      },
      'D': { 
        name: 'D-Rank Hunter', 
        color: 'from-green-400 to-green-600',
        glow: 'shadow-green-500/50',
        description: 'Apprentice Hunter'
      },
      'C': { 
        name: 'C-Rank Hunter', 
        color: 'from-blue-400 to-blue-600',
        glow: 'shadow-blue-500/50',
        description: 'Skilled Hunter'
      },
      'B': { 
        name: 'B-Rank Hunter', 
        color: 'from-purple-400 to-purple-600',
        glow: 'shadow-purple-500/50',
        description: 'Elite Hunter'
      },
      'A': { 
        name: 'A-Rank Hunter', 
        color: 'from-orange-400 to-red-600',
        glow: 'shadow-red-500/50',
        description: 'Master Hunter'
      },
      'S': { 
        name: 'S-Rank Hunter', 
        color: 'from-yellow-300 via-yellow-400 to-orange-500',
        glow: 'shadow-yellow-500/70',
        description: 'Legendary Hunter'
      },
    };
    
    return configs[rank];
  };

  const rankConfig = getRankConfig(newRank);

  const getRankRewards = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const baseRewards = {
      'D': [
        { type: 'skill', value: 'Enhanced Perception' },
        { type: 'stat_boost', value: '+10 Max Mana' }
      ],
      'C': [
        { type: 'skill', value: 'Quick Recovery' },
        { type: 'stat_boost', value: '+20 Max Mana' },
        { type: 'unlock', value: 'Daily Dungeon Access' }
      ],
      'B': [
        { type: 'skill', value: 'Battle Focus' },
        { type: 'stat_boost', value: '+30 Max Mana' },
        { type: 'unlock', value: 'Guild Features' }
      ],
      'A': [
        { type: 'skill', value: 'Shadow Clone' },
        { type: 'stat_boost', value: '+50 Max Mana' },
        { type: 'unlock', value: 'Raid Missions' }
      ],
      'S': [
        { type: 'skill', value: 'Sovereign\'s Authority' },
        { type: 'stat_boost', value: '+100 Max Mana' },
        { type: 'unlock', value: 'True Power Awakening' },
        { type: 'title', value: 'Shadow Monarch' }
      ],
    };
    
    return baseRewards[rank] || [];
  };

  const rewards = getRankRewards(newRank);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none overflow-visible">
        <VisuallyHidden>
          <DialogTitle>Hunter Rank Advancement</DialogTitle>
          <DialogDescription>
            Your power has grown! You have been promoted to {newRank}-Rank Hunter with new abilities and increased mana capacity.
          </DialogDescription>
        </VisuallyHidden>
        <motion.div
          initial={{ scale: 0, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0, opacity: 0, rotateY: -180 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.8 }}
          className="relative"
        >
          {/* Epic Background Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${rankConfig.color} opacity-20 rounded-3xl blur-3xl scale-110`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${rankConfig.color} opacity-10 rounded-2xl blur-2xl scale-105`} />
          
          <Card className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gradient-to-r ${rankConfig.color} shadow-2xl ${rankConfig.glow}`}>
            <CardContent className="p-10 text-center space-y-8">
              {/* Floating Elements */}
              <div className="relative">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0.8], 
                      rotate: [0, 360, 720],
                      y: [0, -30, -60],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 4
                    }}
                    className={`absolute ${
                      i < 6 ? 'top-0' : 'bottom-0'
                    }`}
                    style={{
                      left: `${10 + (i % 6) * 15}%`,
                    }}
                  >
                    <Sparkles className={`h-3 w-3 bg-gradient-to-r ${rankConfig.color} bg-clip-text text-transparent`} />
                  </motion.div>
                ))}
                
                {/* Rank Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300, duration: 1 }}
                  className={`w-32 h-32 mx-auto bg-gradient-to-br ${rankConfig.color} rounded-full flex items-center justify-center shadow-2xl ${rankConfig.glow} border-4 border-white/20`}
                >
                  <div className="text-6xl font-bold text-white drop-shadow-lg">{newRank}</div>
                </motion.div>
              </div>

              {/* Rank Up Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="space-y-4"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    textShadow: ["0 0 0px rgba(255,255,255,0.5)", "0 0 20px rgba(255,255,255,0.8)", "0 0 0px rgba(255,255,255,0.5)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    RANK UP!
                  </h1>
                </motion.div>
                
                <div className="space-y-2">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${rankConfig.color} bg-clip-text text-transparent`}>
                    {rankConfig.name}
                  </div>
                  <Badge className={`bg-gradient-to-r ${rankConfig.color} text-white px-4 py-1 text-lg shadow-lg`}>
                    {rankConfig.description}
                  </Badge>
                </div>
              </motion.div>

              {/* Power Surge Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="relative"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${rankConfig.color} opacity-20 blur-sm`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* New Abilities */}
              {rewards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Award className="h-5 w-5" />
                    <span className="font-bold">New Abilities Unlocked!</span>
                  </div>
                  <div className="space-y-3">
                    {rewards.map((reward, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.5 + index * 0.2 }}
                        className="flex items-center justify-center gap-3 p-3 bg-black/30 rounded-lg border border-white/10"
                      >
                        {reward.type === 'skill' && <Crown className="h-5 w-5 text-yellow-400" />}
                        {reward.type === 'stat_boost' && <Zap className="h-5 w-5 text-blue-400" />}
                        {reward.type === 'unlock' && <Sparkles className="h-5 w-5 text-purple-400" />}
                        {reward.type === 'title' && <Award className="h-5 w-5 text-red-400" />}
                        <span className="text-white font-medium">{reward.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                <Button 
                  onClick={onClose}
                  className={`bg-gradient-to-r ${rankConfig.color} hover:scale-105 text-white px-10 py-3 text-lg shadow-lg ${rankConfig.glow} transition-all duration-300`}
                >
                  Embrace Your Power
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}