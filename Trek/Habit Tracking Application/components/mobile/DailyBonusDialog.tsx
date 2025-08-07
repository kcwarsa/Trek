"use client";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { VisuallyHidden } from "../ui/visually-hidden";
import { Star, Flame, Gift, Gem, Zap, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyBonusDialogProps {
  isOpen: boolean;
  streak: number;
  onClaim: () => void;
}

export function DailyBonusDialog({ isOpen, streak, onClaim }: DailyBonusDialogProps) {
  const getStreakRewards = (streakCount: number) => {
    const baseXp = 50;
    const streakMultiplier = Math.min(streakCount, 7);
    const xpBonus = baseXp * streakMultiplier;
    const gemBonus = Math.floor(streakCount / 3);
    const manaBonus = 25;

    return {
      xp: xpBonus,
      gems: gemBonus,
      mana: manaBonus,
      title: getStreakTitle(streakCount),
    };
  };

  const getStreakTitle = (streakCount: number) => {
    if (streakCount >= 30) return "Legendary Dedication";
    if (streakCount >= 14) return "Unwavering Spirit";
    if (streakCount >= 7) return "Weekly Warrior";
    if (streakCount >= 3) return "Rising Hunter";
    return "Welcome Back";
  };

  const getStreakColor = (streakCount: number) => {
    if (streakCount >= 30) return "from-yellow-300 to-orange-500";
    if (streakCount >= 14) return "from-purple-400 to-pink-500";
    if (streakCount >= 7) return "from-blue-400 to-cyan-500";
    if (streakCount >= 3) return "from-green-400 to-emerald-500";
    return "from-gray-400 to-gray-600";
  };

  const rewards = getStreakRewards(streak);
  const streakColor = getStreakColor(streak);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none p-0">
        <VisuallyHidden>
          <DialogTitle>Daily Login Bonus</DialogTitle>
          <DialogDescription>
            Claim your daily login rewards and maintain your streak!
          </DialogDescription>
        </VisuallyHidden>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Celebration Background */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  x: Math.random() * 300,
                  y: Math.random() * 400,
                  scale: 0,
                  rotate: 0 
                }}
                animate={{ 
                  y: -50,
                  scale: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Star className="h-4 w-4 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/50 border-2 border-purple-500/30 backdrop-blur-lg">
            <CardContent className="p-8 text-center space-y-6">
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="h-8 w-8 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Daily Bonus!</h2>
                </div>
                <Badge className={`bg-gradient-to-r ${streakColor} text-white px-4 py-1 text-lg`}>
                  {rewards.title}
                </Badge>
              </motion.div>

              {/* Streak Display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${streakColor} flex items-center justify-center relative`}>
                  <Flame className="h-12 w-12 text-white" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-red-400/20"
                  />
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-white">{streak}</div>
                  <div className="text-sm text-gray-300">Day Streak</div>
                </div>
              </motion.div>

              {/* Rewards */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-white">Today's Rewards</h3>

                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30"
                  >
                    <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-yellow-400">+{rewards.xp}</div>
                    <div className="text-xs text-yellow-300">XP</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/30"
                  >
                    <Zap className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-cyan-400">+{rewards.mana}</div>
                    <div className="text-xs text-cyan-300">Mana</div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0 }}
                    className="p-4 bg-purple-500/20 rounded-lg border border-purple-500/30"
                  >
                    <Gem className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-xl font-bold text-purple-400">+{rewards.gems}</div>
                    <div className="text-xs text-purple-300">Gems</div>
                  </motion.div>
                </div>

                {/* Bonus Message */}
                {streak >= 7 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
                  >
                    <Crown className="h-5 w-5 text-yellow-400 inline mr-2" />
                    <span className="text-yellow-300 text-sm">
                      Weekly streak bonus applied!
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Claim Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <Button
                  onClick={onClaim}
                  className={`w-full bg-gradient-to-r ${streakColor} hover:scale-105 text-white py-3 text-lg font-bold shadow-lg transition-all duration-300`}
                >
                  Claim Rewards
                </Button>
              </motion.div>

              {/* Streak Motivation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-center"
              >
                <p className="text-sm text-gray-300">
                  {streak < 7 
                    ? `${7 - streak} more days for weekly bonus!`
                    : streak < 30 
                    ? `${30 - streak} more days for legendary status!`
                    : "You've achieved legendary status!"
                  }
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}