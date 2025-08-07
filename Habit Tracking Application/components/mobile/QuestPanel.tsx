"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Plus, 
  Star, 
  Target, 
  Crown, 
  Zap, 
  Sparkles,
  CheckCircle,
  Clock,
  Camera,
  Mic,
  Move,
  Trash2,
  RotateCcw
} from "lucide-react";
import { PlayerStats, Habit } from "../MobileHabitTracker";
import { AddQuestSheet } from "./AddQuestSheet";
import { motion, AnimatePresence, PanInfo } from "motion/react";

interface QuestPanelProps {
  habits: Habit[];
  stats: PlayerStats;
  onHabitsUpdate: (habits: Habit[]) => void;
  onStatsUpdate: (stats: PlayerStats) => void;
}

export function QuestPanel({ habits, stats, onHabitsUpdate, onStatsUpdate }: QuestPanelProps) {
  const [activeQuestTab, setActiveQuestTab] = useState("active");
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [swipedQuests, setSwipedQuests] = useState<Set<string>>(new Set());

  const today = new Date().toISOString().split('T')[0];
  const activeQuests = habits.filter(h => !h.isCompleted && !h.completions.includes(today));
  const completedQuests = habits.filter(h => h.isCompleted || h.completions.includes(today));

  const handleQuestSwipe = (questId: string, direction: 'left' | 'right', info: PanInfo) => {
    const velocity = direction === 'left' ? info.velocity.x : -info.velocity.x;
    
    if (Math.abs(velocity) > 500 || Math.abs(info.offset.x) > 150) {
      if (direction === 'left') {
        // Swipe left to complete
        completeQuest(questId);
      } else {
        // Swipe right to delete/archive
        setSwipedQuests(prev => new Set([...prev, questId]));
        setTimeout(() => deleteQuest(questId), 300);
      }
    }
  };

  const completeQuest = (questId: string) => {
    const quest = habits.find(h => h.id === questId);
    if (!quest) return;

    const updatedHabits = habits.map(h => {
      if (h.id === questId) {
        return {
          ...h,
          completions: [...h.completions, today],
          completedAt: new Date().toISOString()
        };
      }
      return h;
    });

    onHabitsUpdate(updatedHabits);

    // Update stats with XP and bonuses
    const baseXp = quest.xpReward;
    const streakBonus = stats.currentStreak >= 7 ? 25 : 0;
    const totalXp = baseXp + streakBonus;
    const manaGained = Math.floor(totalXp / 2);

    onStatsUpdate({
      ...stats,
      xp: stats.xp + totalXp,
      totalXp: stats.totalXp + totalXp,
      completedHabits: stats.completedHabits + 1,
      manaPoints: Math.min(stats.maxMana, stats.manaPoints + manaGained),
    });
  };

  const deleteQuest = (questId: string) => {
    onHabitsUpdate(habits.filter(h => h.id !== questId));
    setSwipedQuests(prev => {
      const newSet = new Set(prev);
      newSet.delete(questId);
      return newSet;
    });
  };

  const addQuest = (name: string, rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S', options: any) => {
    const xpRewards = { E: 10, D: 20, C: 35, B: 50, A: 80, S: 120 };
    const newQuest: Habit = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      completions: [],
      rank,
      xpReward: xpRewards[rank],
      timeOfDay: options.timeOfDay,
      estimatedTime: options.estimatedTime,
      category: options.category,
    };
    
    onHabitsUpdate([...habits, newQuest]);
    setShowAddQuest(false);
  };

  const getRankConfig = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const configs = {
      'E': { color: 'from-gray-400 to-gray-600', icon: Star, bgColor: 'bg-gray-500/10' },
      'D': { color: 'from-green-400 to-green-600', icon: Target, bgColor: 'bg-green-500/10' },
      'C': { color: 'from-blue-400 to-blue-600', icon: Target, bgColor: 'bg-blue-500/10' },
      'B': { color: 'from-purple-400 to-purple-600', icon: Crown, bgColor: 'bg-purple-500/10' },
      'A': { color: 'from-orange-400 to-red-600', icon: Zap, bgColor: 'bg-orange-500/10' },
      'S': { color: 'from-yellow-300 to-orange-500', icon: Sparkles, bgColor: 'bg-yellow-500/10' },
    };
    return configs[rank];
  };

  const QuestCard = ({ quest, isActive = true }: { quest: Habit, isActive?: boolean }) => {
    const rankConfig = getRankConfig(quest.rank);
    const Icon = rankConfig.icon;
    const isSwipedOut = swipedQuests.has(quest.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isSwipedOut ? 0 : 1, 
          y: 0,
          x: isSwipedOut ? 300 : 0
        }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          drag={isActive ? "x" : false}
          dragConstraints={{ left: -200, right: 200 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100) {
              handleQuestSwipe(quest.id, 'left', info);
            } else if (info.offset.x > 100) {
              handleQuestSwipe(quest.id, 'right', info);
            }
          }}
          whileDrag={{ scale: 1.02, rotateZ: info => info.offset.x / 10 }}
          className="relative"
        >
          {/* Swipe indicators */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-green-500/20 flex items-center justify-end pr-4 rounded-l-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex-1 bg-red-500/20 flex items-center justify-start pl-4 rounded-r-lg">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
          </div>

          <Card className={`relative bg-gray-800/90 backdrop-blur border-gray-700/50 ${!isActive ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${rankConfig.color} flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{quest.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`bg-gradient-to-r ${rankConfig.color} text-white text-xs`}>
                      {quest.rank}-Rank
                    </Badge>
                    <span className="text-yellow-400 text-sm">+{quest.xpReward} XP</span>
                    {quest.estimatedTime && (
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quest.estimatedTime}m
                      </span>
                    )}
                  </div>
                </div>

                {isActive && (
                  <Button
                    size="sm"
                    onClick={() => completeQuest(quest.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Additional quest info */}
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                {quest.timeOfDay && quest.timeOfDay !== 'any' && (
                  <span className="capitalize">{quest.timeOfDay}</span>
                )}
                {quest.category && (
                  <span>{quest.category}</span>
                )}
                <span>Created {new Date(quest.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Quest Log</h1>
          <Button
            onClick={() => setShowAddQuest(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Quest
          </Button>
        </div>

        {/* Swipe hint */}
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Move className="h-4 w-4" />
            <span>Swipe left to complete, right to delete</span>
          </div>
        </div>
      </div>

      {/* Quest Tabs */}
      <Tabs value={activeQuestTab} onValueChange={setActiveQuestTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 grid grid-cols-2 bg-gray-800/50 backdrop-blur">
          <TabsTrigger value="active" className="data-[state=active]:bg-blue-600">
            Active ({activeQuests.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-green-600">
            Completed ({completedQuests.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="active" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3 pb-24">
                <AnimatePresence>
                  {activeQuests.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <Target className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-300 mb-2">No Active Quests</h3>
                      <p className="text-gray-400 mb-6">Create your first quest to begin your journey!</p>
                      <Button
                        onClick={() => setShowAddQuest(true)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Quest
                      </Button>
                    </motion.div>
                  ) : (
                    activeQuests.map((quest) => (
                      <QuestCard key={quest.id} quest={quest} isActive={true} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="completed" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3 pb-24">
                <AnimatePresence>
                  {completedQuests.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <CheckCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-300 mb-2">No Completed Quests</h3>
                      <p className="text-gray-400">Complete some quests to see them here!</p>
                    </motion.div>
                  ) : (
                    completedQuests.map((quest) => (
                      <QuestCard key={quest.id} quest={quest} isActive={false} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>

      {/* Add Quest Sheet */}
      <AddQuestSheet
        isOpen={showAddQuest}
        onClose={() => setShowAddQuest(false)}
        onAdd={addQuest}
      />
    </div>
  );
}