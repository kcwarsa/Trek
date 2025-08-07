"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { PlayerStats, Habit } from "./HabitTracker";
import { BarChart3, Calendar, Target, Flame, Star, Trophy, TrendingUp, Clock } from "lucide-react";

interface StatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  habits: Habit[];
}

export function StatsDialog({ isOpen, onClose, stats, habits }: StatsDialogProps) {
  const totalDaysActive = Math.floor((new Date().getTime() - new Date(stats.joinDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const completionRate = totalDaysActive > 0 ? Math.round((stats.completedHabits / (habits.length * totalDaysActive)) * 100) : 0;
  
  const getWeeklyStats = () => {
    const weeklyCompletions = Array(7).fill(0);
    const today = new Date();
    
    habits.forEach(habit => {
      habit.completions.forEach(completion => {
        const completionDate = new Date(completion);
        const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 0 && daysDiff < 7) {
          weeklyCompletions[6 - daysDiff]++;
        }
      });
    });
    
    return weeklyCompletions;
  };

  const weeklyStats = getWeeklyStats();
  const thisWeekTotal = weeklyStats.reduce((sum, day) => sum + day, 0);
  const dailyAverage = thisWeekTotal / 7;

  const getHabitStats = () => {
    return habits.map(habit => ({
      name: habit.name,
      completions: habit.completions.length,
      rank: habit.rank,
      xpEarned: habit.completions.length * habit.xpReward,
      streak: calculateHabitStreak(habit),
    })).sort((a, b) => b.completions - a.completions);
  };

  const calculateHabitStreak = (habit: Habit) => {
    if (habit.completions.length === 0) return 0;
    
    const sortedCompletions = [...habit.completions].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    const today = currentDate.toISOString().split('T')[0];
    if (!habit.completions.includes(today)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
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

  const habitStats = getHabitStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Hero Statistics
          </DialogTitle>
          <DialogDescription>
            Detailed overview of your quest progress and achievements
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Star className="h-8 w-8 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold">{stats.level}</div>
                <div className="text-sm text-muted-foreground text-center">Current Level</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Trophy className="h-8 w-8 text-purple-500 mb-2" />
                <div className="text-2xl font-bold">{stats.totalXp.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground text-center">Total XP</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Target className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold">{stats.completedHabits}</div>
                <div className="text-sm text-muted-foreground text-center">Quests Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-4">
                <Flame className="h-8 w-8 text-orange-500 mb-2" />
                <div className="text-2xl font-bold">{stats.longestStreak}</div>
                <div className="text-sm text-muted-foreground text-center">Best Streak</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Level {stats.level}</span>
                    <span>Level {stats.level + 1}</span>
                  </div>
                  <Progress value={(stats.xp / stats.xpToNextLevel) * 100} className="h-3" />
                  <div className="text-center text-sm text-muted-foreground">
                    {stats.xp} / {stats.xpToNextLevel} XP
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{completionRate}%</div>
                    <div className="text-xs text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{dailyAverage.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Daily Average</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Week's Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-muted-foreground mb-2">{day}</div>
                        <div className={`h-8 rounded flex items-center justify-center text-sm font-medium ${
                          weeklyStats[index] > 0 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {weeklyStats[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-2 border-t">
                    <div className="text-lg font-bold">{thisWeekTotal}</div>
                    <div className="text-sm text-muted-foreground">Quests completed this week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quest Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quest Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {habitStats.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No quests created yet. Start your journey by creating your first quest!
                  </div>
                ) : (
                  habitStats.map((habit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{habit.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {habit.rank}-Rank
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{habit.completions} completions</span>
                          <span>{habit.streak} day streak</span>
                          <span>{habit.xpEarned} XP earned</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Journey Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hero's Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Journey started</span>
                  <span>{new Date(stats.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Days active</span>
                  <span>{totalDaysActive} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Current streak</span>
                  <span>{stats.currentStreak} days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Longest streak</span>
                  <span>{stats.longestStreak} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}