"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent } from "./ui/card";
import { Star, Shield, Sword, Crown, Zap, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface AddHabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => void;
}

export function AddHabitDialog({ isOpen, onClose, onAdd }: AddHabitDialogProps) {
  const [habitName, setHabitName] = useState("");
  const [rank, setRank] = useState<'E' | 'D' | 'C' | 'B' | 'A' | 'S'>('C');

  const rankOptions = [
    {
      value: 'E' as const,
      label: 'E-Rank Quest',
      description: 'Basic daily tasks',
      xp: 10,
      icon: Star,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10 border-gray-500/30',
      glowColor: 'hover:shadow-gray-500/20',
    },
    {
      value: 'D' as const,
      label: 'D-Rank Quest',
      description: 'Simple challenges',
      xp: 20,
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/30',
      glowColor: 'hover:shadow-green-500/20',
    },
    {
      value: 'C' as const,
      label: 'C-Rank Quest',
      description: 'Moderate objectives',
      xp: 35,
      icon: Sword,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
      glowColor: 'hover:shadow-blue-500/20',
    },
    {
      value: 'B' as const,
      label: 'B-Rank Quest',
      description: 'Challenging missions',
      xp: 50,
      icon: Crown,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      glowColor: 'hover:shadow-purple-500/20',
    },
    {
      value: 'A' as const,
      label: 'A-Rank Quest',
      description: 'Elite level trials',
      xp: 80,
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
      glowColor: 'hover:shadow-orange-500/20',
    },
    {
      value: 'S' as const,
      label: 'S-Rank Quest',
      description: 'Legendary endeavors',
      xp: 120,
      icon: Sparkles,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/30',
      glowColor: 'hover:shadow-yellow-500/20',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAdd(habitName.trim(), rank);
      setHabitName("");
      setRank('C');
    }
  };

  const handleClose = () => {
    setHabitName("");
    setRank('C');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">
            Accept New Quest
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose a quest that matches your current power level and commitment. Higher rank quests yield greater rewards!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            {/* Quest Name */}
            <div className="grid gap-3">
              <Label htmlFor="habitName" className="text-white font-medium">Quest Objective</Label>
              <Input
                id="habitName"
                placeholder="e.g., Master the Ancient Art of Early Rising"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                autoFocus
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400/50 focus:ring-purple-400/20"
              />
            </div>

            {/* Rank Selection */}
            <div className="grid gap-4">
              <Label className="text-white font-medium">Quest Rank Classification</Label>
              <RadioGroup
                value={rank}
                onValueChange={(value) => setRank(value as 'E' | 'D' | 'C' | 'B' | 'A' | 'S')}
                className="grid gap-3"
              >
                {rankOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className="cursor-pointer block"
                      >
                        <motion.div
                          whileHover={{ 
                            scale: 1.02,
                            y: -2
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Card className={`border-2 transition-all duration-300 backdrop-blur-sm ${
                            rank === option.value 
                              ? `${option.bgColor} border-current shadow-lg ${option.glowColor}` 
                              : 'bg-gray-800/30 border-gray-600/30 hover:border-gray-500/50'
                          }`}>
                            <CardContent className="flex items-center gap-4 p-4">
                              {/* Rank Badge */}
                              <motion.div 
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                                  rank === option.value 
                                    ? `${option.bgColor} border-current` 
                                    : 'bg-gray-700/50 border-gray-600/50'
                                }`}
                                animate={rank === option.value ? {
                                  boxShadow: [
                                    "0 0 0px rgba(147, 51, 234, 0)",
                                    "0 0 20px rgba(147, 51, 234, 0.3)",
                                    "0 0 0px rgba(147, 51, 234, 0)"
                                  ]
                                } : {}}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Icon className={`h-6 w-6 ${option.color}`} />
                              </motion.div>

                              {/* Quest Details */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-bold text-white text-lg">{option.label}</span>
                                  <motion.div
                                    animate={rank === option.value ? {
                                      scale: [1, 1.1, 1],
                                      rotate: [0, 5, -5, 0]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  >
                                    <span className={`text-sm px-3 py-1 rounded-full font-bold ${
                                      rank === option.value 
                                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' 
                                        : 'bg-gray-700/50 text-gray-400'
                                    }`}>
                                      +{option.xp} XP
                                    </span>
                                  </motion.div>
                                </div>
                                <p className="text-gray-300 text-sm">{option.description}</p>
                                
                                {/* Rank letter */}
                                <div className="mt-2">
                                  <span className={`text-2xl font-bold ${option.color}`}>
                                    {option.value}
                                  </span>
                                </div>
                              </div>

                              {/* Selection Indicator */}
                              {rank === option.value && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="text-purple-400"
                                >
                                  <Crown className="h-6 w-6" />
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!habitName.trim()} 
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
            >
              Accept Quest
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}