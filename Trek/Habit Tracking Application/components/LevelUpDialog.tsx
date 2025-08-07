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
import { Star, Crown, Sparkles, Gift } from "lucide-react";
import { motion } from "motion/react";

interface LevelUpDialogProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpDialog({ isOpen, newLevel, onClose }: LevelUpDialogProps) {
  const getLevelRewards = (level: number) => {
    const rewards = [];
    
    // Title rewards
    if (level === 5) rewards.push({ type: 'title', value: 'Apprentice' });
    if (level === 10) rewards.push({ type: 'title', value: 'Warrior' });
    if (level === 20) rewards.push({ type: 'title', value: 'Expert' });
    if (level === 30) rewards.push({ type: 'title', value: 'Master' });
    if (level === 50) rewards.push({ type: 'title', value: 'Grandmaster' });
    
    // XP bonus rewards
    if (level % 10 === 0) rewards.push({ type: 'xp_bonus', value: level * 10 });
    
    // Achievement unlocks
    if (level === 5) rewards.push({ type: 'achievement', value: 'Rising Star' });
    if (level === 20) rewards.push({ type: 'achievement', value: 'Veteran Hero' });
    if (level === 50) rewards.push({ type: 'achievement', value: 'Grandmaster' });
    
    return rewards;
  };

  const rewards = getLevelRewards(newLevel);

  const getLevelTitle = (level: number) => {
    if (level >= 50) return "Grandmaster";
    if (level >= 40) return "Legend";
    if (level >= 30) return "Master";
    if (level >= 20) return "Expert";
    if (level >= 15) return "Veteran";
    if (level >= 10) return "Warrior";
    if (level >= 5) return "Apprentice";
    return "Novice";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none">
        <VisuallyHidden>
          <DialogTitle>Level Up Celebration</DialogTitle>
          <DialogDescription>
            Congratulations! You have reached level {newLevel} and unlocked new abilities.
          </DialogDescription>
        </VisuallyHidden>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative"
        >
          {/* Celebration Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl" />
          
          <Card className="relative bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/30 border-2 border-purple-200 dark:border-purple-700 shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              {/* Animated Stars */}
              <div className="relative">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ 
                      scale: [0, 1, 0.8], 
                      rotate: [0, 180, 360],
                      y: [0, -20, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className={`absolute ${
                      i === 0 ? 'top-0 left-1/4' :
                      i === 1 ? 'top-0 right-1/4' :
                      i === 2 ? 'top-1/2 left-0' :
                      i === 3 ? 'top-1/2 right-0' :
                      i === 4 ? 'bottom-0 left-1/3' :
                      'bottom-0 right-1/3'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                ))}
                
                {/* Level Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl"
                >
                  <Crown className="h-12 w-12 text-white" />
                </motion.div>
              </div>

              {/* Level Up Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  LEVEL UP!
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <span className="text-2xl font-bold">Level {newLevel}</span>
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                  {getLevelTitle(newLevel)}
                </Badge>
              </motion.div>

              {/* Rewards */}
              {rewards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">Rewards Unlocked!</span>
                  </div>
                  <div className="space-y-2">
                    {rewards.map((reward, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2 + index * 0.2 }}
                        className="flex items-center justify-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                      >
                        {reward.type === 'title' && (
                          <>
                            <Crown className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">New Title: <strong>{reward.value}</strong></span>
                          </>
                        )}
                        {reward.type === 'xp_bonus' && (
                          <>
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">Bonus XP: <strong>+{reward.value}</strong></span>
                          </>
                        )}
                        {reward.type === 'achievement' && (
                          <>
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Achievement: <strong>{reward.value}</strong></span>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                <Button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2"
                >
                  Continue Your Journey
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}