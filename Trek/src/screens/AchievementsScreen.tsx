
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, ProgressBar } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useHabits } from '../contexts/HabitContext';
import { Achievement } from '../types';

const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
  const { habits, playerStats } = useHabits();
  const glowValue = useSharedValue(1);

  React.useEffect(() => {
    glowValue.value = withRepeat(
      withTiming(1.2, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const achievements: Achievement[] = [
    {
      id: 'first_quest',
      name: 'First Steps',
      description: 'Complete your first quest',
      icon: 'star',
      requirement: 1,
      progress: Math.min(playerStats.completedHabits, 1),
      unlocked: playerStats.completedHabits >= 1,
      tier: 'bronze',
      xpReward: 50,
    },
    {
      id: 'week_streak',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      requirement: 7,
      progress: Math.min(playerStats.longestStreak, 7),
      unlocked: playerStats.longestStreak >= 7,
      tier: 'bronze',
      xpReward: 100,
    },
    {
      id: 'level_5',
      name: 'Rising Hunter',
      description: 'Reach level 5',
      icon: 'trending-up',
      requirement: 5,
      progress: Math.min(playerStats.level, 5),
      unlocked: playerStats.level >= 5,
      tier: 'silver',
      xpReward: 200,
    },
    {
      id: 'month_streak',
      name: 'Legendary Persistence',
      description: 'Maintain a 30-day streak',
      icon: 'trophy',
      requirement: 30,
      progress: Math.min(playerStats.longestStreak, 30),
      unlocked: playerStats.longestStreak >= 30,
      tier: 'gold',
      xpReward: 500,
    },
    {
      id: 'perfect_week',
      name: 'Shadow Master',
      description: 'Complete all quests for 7 consecutive days',
      icon: 'diamond',
      requirement: 7,
      progress: Math.min(playerStats.currentStreak, 7),
      unlocked: playerStats.currentStreak >= 7,
      tier: 'legendary',
      xpReward: 1000,
    },
    {
      id: 'hundred_quests',
      name: 'Century Hunter',
      description: 'Complete 100 total quests',
      icon: 'checkmark-done-circle',
      requirement: 100,
      progress: Math.min(playerStats.completedHabits, 100),
      unlocked: playerStats.completedHabits >= 100,
      tier: 'gold',
      xpReward: 750,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercentage = (unlockedCount / achievements.length) * 100;

  const getTierConfig = (tier: string) => {
    const configs = {
      bronze: {
        colors: ['#cd7f32', '#b8860b'],
        bgColor: 'rgba(205, 127, 50, 0.1)',
        borderColor: 'rgba(205, 127, 50, 0.3)',
        textColor: '#cd7f32',
      },
      silver: {
        colors: ['#c0c0c0', '#a8a8a8'],
        bgColor: 'rgba(192, 192, 192, 0.1)',
        borderColor: 'rgba(192, 192, 192, 0.3)',
        textColor: '#c0c0c0',
      },
      gold: {
        colors: ['#ffd700', '#ffed4e'],
        bgColor: 'rgba(255, 215, 0, 0.1)',
        borderColor: 'rgba(255, 215, 0, 0.3)',
        textColor: '#ffd700',
      },
      legendary: {
        colors: ['#a855f7', '#ec4899'],
        bgColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        textColor: '#a855f7',
      },
    };
    return configs[tier] || configs.bronze;
  };

  const AchievementCard = ({ achievement, index }: { achievement: Achievement; index: number }) => {
    const tierConfig = getTierConfig(achievement.tier);
    const progressPercentage = (achievement.progress / achievement.requirement) * 100;
    
    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: achievement.unlocked ? glowValue.value : 1 }],
    }));

    return (
      <Animated.View
        style={[
          cardAnimatedStyle,
          {
            opacity: achievement.unlocked ? 1 : 0.7,
          },
        ]}
      >
        <Card style={[
          styles.achievementCard,
          achievement.unlocked && {
            borderColor: tierConfig.borderColor,
            borderWidth: 1,
            backgroundColor: tierConfig.bgColor,
          },
        ]}>
          <LinearGradient
            colors={achievement.unlocked ? ['rgba(0,0,0,0)', tierConfig.bgColor] : ['rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.achievementContent}>
              {/* Icon */}
              <View style={styles.achievementIconContainer}>
                <LinearGradient
                  colors={achievement.unlocked ? tierConfig.colors : ['#4b5563', '#6b7280']}
                  style={styles.achievementIcon}
                >
                  <Ionicons
                    name={achievement.unlocked ? achievement.icon as any : 'lock-closed'}
                    size={24}
                    color="white"
                  />
                </LinearGradient>
              </View>

              {/* Content */}
              <View style={styles.achievementInfo}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <View style={[
                    styles.tierBadge,
                    { backgroundColor: achievement.unlocked ? tierConfig.textColor : '#6b7280' },
                  ]}>
                    <Text style={styles.tierText}>{achievement.tier.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.achievementDescription}>{achievement.description}</Text>

                {achievement.unlocked ? (
                  <View style={styles.achievementReward}>
                    <Ionicons name="star" size={16} color="#eab308" />
                    <Text style={styles.rewardText}>+{achievement.xpReward} XP</Text>
                  </View>
                ) : (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressText}>Progress</Text>
                      <Text style={styles.progressValue}>
                        {achievement.progress} / {achievement.requirement}
                      </Text>
                    </View>
                    <ProgressBar
                      progress={progressPercentage / 100}
                      color={tierConfig.textColor}
                      style={styles.progressBar}
                    />
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Card>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Achievement Center</Text>
          <Text style={styles.headerSubtitle}>
            Unlock achievements by completing quests and reaching milestones
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Summary */}
          <Card style={styles.summaryCard}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(59, 130, 246, 0.1)']}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryHeader}>
                <Ionicons name="trophy" size={24} color="#eab308" />
                <Text style={styles.summaryTitle}>Achievement Progress</Text>
              </View>

              <View style={styles.summaryStats}>
                <Text style={styles.summaryLabel}>Completed</Text>
                <Text style={styles.summaryValue}>
                  {unlockedCount} / {achievements.length}
                </Text>
              </View>

              <ProgressBar
                progress={completionPercentage / 100}
                color="#8b5cf6"
                style={styles.summaryProgressBar}
              />

              <View style={styles.completionRate}>
                <Text style={styles.completionPercentage}>
                  {Math.round(completionPercentage)}%
                </Text>
                <Text style={styles.completionLabel}>Achievement Rate</Text>
              </View>
            </LinearGradient>
          </Card>

          {/* Achievement List */}
          <View style={styles.achievementList}>
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </View>

          {/* Motivational Card */}
          <Card style={styles.motivationCard}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.1)']}
              style={styles.motivationGradient}
            >
              <Ionicons name="flash" size={48} color="#10b981" />
              <Text style={styles.motivationTitle}>Keep Going, Hunter!</Text>
              <Text style={styles.motivationText}>
                Every quest completed brings you closer to unlocking new achievements.
                Stay consistent and watch your power grow!
              </Text>
            </LinearGradient>
          </Card>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  summaryValue: {
    color: '#8b5cf6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryProgressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    marginBottom: 16,
  },
  completionRate: {
    alignItems: 'center',
  },
  completionPercentage: {
    color: '#eab308',
    fontSize: 32,
    fontWeight: 'bold',
  },
  completionLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  achievementList: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  achievementIconContainer: {
    marginTop: 4,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  tierText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  achievementDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 8,
  },
  achievementReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    color: '#eab308',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  progressValue: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
  },
  motivationCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    marginTop: 20,
    overflow: 'hidden',
  },
  motivationGradient: {
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  motivationTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  motivationText: {
    color: '#10b981',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
