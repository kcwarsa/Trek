"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { ScrollArea } from "../ui/scroll-area";
import { 
  User, 
  Settings, 
  Crown, 
  Star, 
  Trophy, 
  Shield,
  Zap,
  Moon,
  Bell,
  Palette,
  Download,
  Share,
  HelpCircle,
  ChevronRight,
  Focus
} from "lucide-react";
import { PlayerStats, Habit } from "../MobileHabitTracker";
import { motion } from "motion/react";

interface ProfileScreenProps {
  stats: PlayerStats;
  habits: Habit[];
  onStatsUpdate: (stats: PlayerStats) => void;
}

export function ProfileScreen({ stats, habits, onStatsUpdate }: ProfileScreenProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const toggleFocusMode = () => {
    onStatsUpdate({
      ...stats,
      focusMode: !stats.focusMode
    });
  };

  const getRankConfig = (rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S') => {
    const configs = {
      'E': { color: 'from-gray-400 to-gray-600', name: 'Novice Hunter' },
      'D': { color: 'from-green-400 to-green-600', name: 'Apprentice Hunter' },
      'C': { color: 'from-blue-400 to-blue-600', name: 'Skilled Hunter' },
      'B': { color: 'from-purple-400 to-purple-600', name: 'Elite Hunter' },
      'A': { color: 'from-orange-400 to-red-600', name: 'Master Hunter' },
      'S': { color: 'from-yellow-300 to-orange-500', name: 'Legendary Hunter' },
    };
    return configs[rank];
  };

  const rankConfig = getRankConfig(stats.hunterRank);
  const totalDays = Math.floor((new Date().getTime() - new Date(stats.joinDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const settingSections = [
    {
      title: 'Hunter Preferences',
      items: [
        {
          icon: Focus,
          label: 'Focus Mode',
          description: 'Hide distractions while completing quests',
          action: 'toggle',
          value: stats.focusMode,
          onToggle: toggleFocusMode,
        },
        {
          icon: Bell,
          label: 'Quest Reminders',
          description: 'Get notified about pending quests',
          action: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: Moon,
          label: 'Dark Theme',
          description: 'Perfect for night hunters',
          action: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
      ],
    },
    {
      title: 'Hunter Tools',
      items: [
        {
          icon: Palette,
          label: 'Customize Avatar',
          description: 'Personalize your hunter appearance',
          action: 'navigate',
        },
        {
          icon: Download,
          label: 'Export Quest Data',
          description: 'Download your progress history',
          action: 'navigate',
        },
        {
          icon: Share,
          label: 'Share Achievements',
          description: 'Show off your progress',
          action: 'navigate',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Tutorial',
          description: 'Learn how to become a better hunter',
          action: 'navigate',
        },
        {
          icon: Settings,
          label: 'Advanced Settings',
          description: 'Fine-tune your experience',
          action: 'navigate',
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2">
        <h1 className="text-2xl font-bold text-white">Hunter Profile</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 pb-24">
          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-700/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${rankConfig.color} flex items-center justify-center relative`}
                >
                  <Crown className="h-10 w-10 text-white" />
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${rankConfig.color} border-2 border-white flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{stats.hunterRank}</span>
                  </div>
                </motion.div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">Shadow Hunter</h2>
                  <p className="text-gray-300">{rankConfig.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`bg-gradient-to-r ${rankConfig.color} text-white`}>
                      Level {stats.level}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {stats.currentTitle}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Star className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-400">{stats.totalXp.toLocaleString()}</div>
                  <div className="text-xs text-blue-300">Total XP</div>
                </div>
                
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Trophy className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-400">{stats.completedHabits}</div>
                  <div className="text-xs text-green-300">Quests Completed</div>
                </div>
                
                <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Shield className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-orange-400">{stats.longestStreak}</div>
                  <div className="text-xs text-orange-300">Best Streak</div>
                </div>
                
                <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Zap className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-purple-400">{totalDays}</div>
                  <div className="text-xs text-purple-300">Days Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hunter Journey */}
          <Card className="bg-gray-900/90 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white">Hunter's Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Journey began</span>
                <span className="text-white">{new Date(stats.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Current streak</span>
                <span className="text-orange-400 font-bold">{stats.currentStreak} days</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Hunter rank</span>
                <span className={`font-bold bg-gradient-to-r ${rankConfig.color} bg-clip-text text-transparent`}>
                  {stats.hunterRank}-Rank
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Achievements unlocked</span>
                <span className="text-yellow-400 font-bold">{stats.achievements.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="bg-gray-900/90 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={itemIndex}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 cursor-pointer"
                    >
                      <div className="p-2 bg-gray-700/50 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-300" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-white">{item.label}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                      
                      {item.action === 'toggle' ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onToggle}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          ))}

          {/* App Info */}
          <Card className="bg-gray-900/90 border-gray-700/50">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-gray-400">
                Solo Leveling Habit Tracker v1.0
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Made with ❤️ for ambitious hunters
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}