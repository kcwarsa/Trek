"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Star, Target, Crown, Zap, Sparkles, Shield, Clock, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddQuestSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S', options: any) => void;
}

export function AddQuestSheet({ isOpen, onClose, onAdd }: AddQuestSheetProps) {
  const [questName, setQuestName] = useState("");
  const [rank, setRank] = useState<'E' | 'D' | 'C' | 'B' | 'A' | 'S'>('C');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'any'>('any');
  const [estimatedTime, setEstimatedTime] = useState<number>(15);
  const [category, setCategory] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);

  const rankOptions = [
    {
      value: 'E' as const,
      label: 'E-Rank',
      description: 'Simple daily habits',
      xp: 10,
      icon: Star,
      color: 'from-gray-400 to-gray-600',
      textColor: 'text-gray-400',
      examples: ['Drink water', 'Take vitamins', 'Check calendar'],
    },
    {
      value: 'D' as const,
      label: 'D-Rank',
      description: 'Easy challenges',
      xp: 20,
      icon: Target,
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-400',
      examples: ['10-minute walk', 'Read 5 pages', 'Tidy room'],
    },
    {
      value: 'C' as const,
      label: 'C-Rank',
      description: 'Moderate goals',
      xp: 35,
      icon: Shield,
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-400',
      examples: ['30-minute workout', 'Study for 1 hour', 'Cook healthy meal'],
    },
    {
      value: 'B' as const,
      label: 'B-Rank',
      description: 'Challenging tasks',
      xp: 50,
      icon: Crown,
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-400',
      examples: ['Complete project milestone', 'Advanced workout', 'Learn new skill'],
    },
    {
      value: 'A' as const,
      label: 'A-Rank',
      description: 'Elite objectives',
      xp: 80,
      icon: Zap,
      color: 'from-orange-400 to-red-600',
      textColor: 'text-orange-400',
      examples: ['Major life change', 'Intensive training', 'Career advancement'],
    },
    {
      value: 'S' as const,
      label: 'S-Rank',
      description: 'Legendary pursuits',
      xp: 120,
      icon: Sparkles,
      color: 'from-yellow-300 to-orange-500',
      textColor: 'text-yellow-400',
      examples: ['Life transformation', 'Master a skill', 'Achieve dream goal'],
    },
  ];

  const categories = [
    'Health & Fitness',
    'Learning & Growth',
    'Work & Career',
    'Relationships',
    'Creativity',
    'Mindfulness',
    'Finance',
    'Home & Organization',
  ];

  const steps = [
    { title: 'Quest Details', description: 'Name your quest' },
    { title: 'Difficulty Rank', description: 'Choose quest difficulty' },
    { title: 'Quest Settings', description: 'Configure options' },
  ];

  const handleSubmit = () => {
    if (questName.trim()) {
      onAdd(questName.trim(), rank, {
        timeOfDay,
        estimatedTime,
        category,
      });

      // Reset form
      setQuestName("");
      setRank('C');
      setTimeOfDay('any');
      setEstimatedTime(15);
      setCategory('');
      setCurrentStep(0);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedRank = rankOptions.find(option => option.value === rank)!;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <SheetHeader className="text-center">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create New Quest
          </SheetTitle>
          <SheetDescription className="text-gray-300">
            {steps[currentStep].description}
          </SheetDescription>
        </SheetHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 my-6">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-purple-500 w-8' : 'bg-gray-600 w-2'
              }`}
              animate={{ width: index <= currentStep ? 32 : 8 }}
            />
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Quest Details */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="text-white">Quest Name</Label>
                  <Input
                    placeholder="e.g., Master the Art of Morning Meditation"
                    value={questName}
                    onChange={(e) => setQuestName(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white text-lg h-12"
                    autoFocus
                  />
                </div>

                {/* Quest Examples */}
                <div className="space-y-3">
                  <Label className="text-gray-300">Popular Quest Ideas</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "Complete morning workout routine",
                      "Read for 30 minutes daily",
                      "Practice gratitude journaling",
                      "Learn a new language",
                      "Drink 8 glasses of water",
                    ].map((example, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setQuestName(example)}
                        className="text-left p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors text-gray-300 hover:text-white"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Difficulty Rank */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <RadioGroup value={rank} onValueChange={(value) => setRank(value as any)}>
                  {rankOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card className={`border-2 transition-all ${
                              rank === option.value 
                                ? 'border-purple-500 bg-purple-500/10' 
                                : 'border-gray-700 bg-gray-800/30'
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                                    <Icon className="h-6 w-6 text-white" />
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-bold text-white">{option.label}</span>
                                      <Badge className={`bg-gradient-to-r ${option.color} text-white`}>
                                        +{option.xp} XP
                                      </Badge>
                                    </div>
                                    <p className="text-gray-300 text-sm">{option.description}</p>
                                  </div>
                                </div>

                                {rank === option.value && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 pt-3 border-t border-gray-600"
                                  >
                                    <Label className="text-gray-400 text-sm">Examples:</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {option.examples.map((example, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {example}
                                        </Badge>
                                      ))}
                                    </div>
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
              </motion.div>
            )}

            {/* Step 3: Quest Settings */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Time of Day */}
                <div className="space-y-3">
                  <Label className="text-white flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Preferred Time
                  </Label>
                  <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="any">Any Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Estimated Time */}
                <div className="space-y-3">
                  <Label className="text-white">Estimated Duration (minutes)</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 15, 30, 60].map((time) => (
                      <Button
                        key={time}
                        variant={estimatedTime === time ? "default" : "outline"}
                        onClick={() => setEstimatedTime(time)}
                        className={estimatedTime === time ? "bg-purple-600" : "border-gray-600 text-gray-300"}
                      >
                        {time}m
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label className="text-white flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category (Optional)
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quest Preview */}
                <Card className="bg-purple-500/10 border-purple-500/30">
                  <CardContent className="p-4">
                    <Label className="text-purple-300 text-sm">Quest Preview</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedRank.color} flex items-center justify-center`}>
                          <selectedRank.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-white">{questName || 'Your Quest Name'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <Badge className={`bg-gradient-to-r ${selectedRank.color} text-white`}>
                          {selectedRank.label}
                        </Badge>
                        <span>+{selectedRank.xp} XP</span>
                        <span>{estimatedTime}min</span>
                        <span className="capitalize">{timeOfDay}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? handleClose : prevStep}
            className="border-gray-600 text-gray-300"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>

          <Button
            onClick={nextStep}
            disabled={currentStep === 0 && !questName.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {currentStep === steps.length - 1 ? 'Create Quest' : 'Next'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}