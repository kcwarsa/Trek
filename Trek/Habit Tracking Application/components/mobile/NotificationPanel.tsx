"use client";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Bell, Clock, Zap, Trophy, Target, X } from "lucide-react";
import { PlayerStats, Habit } from "../MobileHabitTracker";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  habits: Habit[];
}

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'streak' | 'energy';
  title: string;
  message: string;
  time: string;
  icon: any;
  color: string;
  action?: () => void;
}

export function NotificationPanel({ isOpen, onClose, stats, habits }: NotificationPanelProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'reminder',
      title: 'Quest Reminder',
      message: 'Complete your morning meditation quest',
      time: '5m ago',
      icon: Target,
      color: 'text-blue-400',
    },
    {
      id: '2',
      type: 'energy',
      title: 'Mana Regenerated',
      message: 'Your mana is fully restored! Time for new quests.',
      time: '1h ago',
      icon: Zap,
      color: 'text-cyan-400',
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned "Week Warrior" for maintaining a 7-day streak',
      time: '2h ago',
      icon: Trophy,
      color: 'text-yellow-400',
    },
  ];

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Ready to conquer today's quests?";
    if (hour < 17) return "Good afternoon! How's your quest progress today?";
    return "Good evening! Time to complete any remaining quests!";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </SheetTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="space-y-4">
          {/* Daily Motivation */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">Daily Motivation</h4>
                  <p className="text-xs text-gray-300">{getTimeBasedGreeting()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Icon className={`h-5 w-5 ${notification.color}`} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                              <span className="text-xs text-gray-400">{notification.time}</span>
                            </div>
                            <p className="text-xs text-gray-300">{notification.message}</p>
                            <Badge 
                              variant="outline" 
                              className="text-xs capitalize border-gray-600 text-gray-400"
                            >
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Quick Stats */}
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <h4 className="font-bold text-white text-sm mb-3">Today's Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {habits.filter(h => h.completions.includes(new Date().toISOString().split('T')[0])).length}
                  </div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{stats.currentStreak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Quick Access */}
          <div className="space-y-2 pt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <Clock className="h-4 w-4 mr-2" />
              Quest Reminders
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notification Settings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}