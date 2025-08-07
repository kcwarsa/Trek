
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, ProgressBar } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useHabits } from '../contexts/HabitContext';
import { getRankConfig, getTimeOfDay } from '../utils';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { habits, playerStats, completeHabit } = useHabits();
  const [refreshing, setRefreshing] = useState(false);
  const pulseValue = useSharedValue(1);

  const today = new Date().toISOString().split('T')[0];
  const todaysQuests = habits.filter(h => !h.completions.includes(today));
  const completedToday = habits.filter(h => h.completions.includes(today));

  const xpProgress = (playerStats.xp / playerStats.xpToNextLevel) * 100;
  const manaProgress = (playerStats.manaPoints / playerStats.maxMana) * 100;
  const dailyProgress = completedToday.length / Math.max(1, habits.length) * 100;

  const handleCompleteQuest = async (questId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    pulseValue.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    completeHabit(questId);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  const rankConfig = getRankConfig(playerStats.hunterRank);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.View style={[styles.avatarContainer, animatedStyle]}>
              <LinearGradient
                colors={rankConfig.colors}
                style={styles.avatar}
              >
                <Ionicons name="person" size={24} color="white" />
              </LinearGradient>
              <View style={[styles.rankBadge, { backgroundColor: rankConfig.colors[0] }]}>
                <Text style={styles.rankText}>{playerStats.hunterRank}</Text>
              </View>
            </Animated.View>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
              <Text style={styles.hunterName}>Shadow Hunter</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={20} color="#f97316" />
              <Text style={styles.streakText}>{playerStats.dailyLoginStreak}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={24} color="#64748b" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Player Stats Card */}
          <Card style={styles.statsCard}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(59, 130, 246, 0.1)']}
              style={styles.statsGradient}
            >
              <View style={styles.statsHeader}>
                <Text style={styles.statsTitle}>Hunter Profile</Text>
                <Text style={styles.level}>Level {playerStats.level}</Text>
              </View>
              
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Experience Points</Text>
                  <Text style={styles.progressValue}>
                    {playerStats.xp} / {playerStats.xpToNextLevel}
                  </Text>
                </View>
                <ProgressBar
                  progress={xpProgress / 100}
                  color="#8b5cf6"
                  style={styles.progressBar}
                />
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Mana Points</Text>
                  <Text style={styles.progressValue}>
                    {playerStats.manaPoints} / {playerStats.maxMana}
                  </Text>
                </View>
                <ProgressBar
                  progress={manaProgress / 100}
                  color="#06b6d4"
                  style={styles.progressBar}
                />
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Ionicons name="target" size={20} color="#10b981" />
                  <Text style={styles.statValue}>{playerStats.completedHabits}</Text>
                  <Text style={styles.statLabel}>Total Quests</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="flame" size={20} color="#f97316" />
                  <Text style={styles.statValue}>{playerStats.currentStreak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="diamond" size={20} color="#eab308" />
                  <Text style={styles.statValue}>{playerStats.gems}</Text>
                  <Text style={styles.statLabel}>Gems</Text>
                </View>
              </View>
            </LinearGradient>
          </Card>

          {/* Today's Progress */}
          <Card style={styles.progressCard}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.1)', 'rgba(59, 130, 246, 0.1)']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={24} color="#a855f7" />
                <Text style={styles.cardTitle}>Today's Progress</Text>
              </View>
              
              <View style={styles.dailyStats}>
                <Text style={styles.dailyStatsText}>
                  {completedToday.length} / {habits.length} Completed
                </Text>
                <Text style={styles.dailyPercentage}>{Math.round(dailyProgress)}%</Text>
              </View>
              
              <ProgressBar
                progress={dailyProgress / 100}
                color="#a855f7"
                style={styles.dailyProgressBar}
              />
            </LinearGradient>
          </Card>

          {/* Active Quests */}
          <Card style={styles.questsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="shield" size={24} color="#3b82f6" />
              <Text style={styles.cardTitle}>Active Quests</Text>
              <Text style={styles.questCount}>({todaysQuests.length} remaining)</Text>
            </View>

            {todaysQuests.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                <Text style={styles.emptyTitle}>All quests completed!</Text>
                <Text style={styles.emptySubtitle}>Great work, Hunter!</Text>
              </View>
            ) : (
              todaysQuests.slice(0, 3).map((quest) => {
                const questRankConfig = getRankConfig(quest.rank);
                return (
                  <TouchableOpacity
                    key={quest.id}
                    style={styles.questItem}
                    onPress={() => handleCompleteQuest(quest.id)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={questRankConfig.colors}
                      style={styles.questRank}
                    >
                      <Text style={styles.questRankText}>{quest.rank}</Text>
                    </LinearGradient>
                    
                    <View style={styles.questInfo}>
                      <Text style={styles.questName}>{quest.name}</Text>
                      <View style={styles.questMeta}>
                        <Text style={styles.questXp}>+{quest.xpReward} XP</Text>
                        {quest.estimatedTime && (
                          <Text style={styles.questTime}>{quest.estimatedTime}min</Text>
                        )}
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleCompleteQuest(quest.id)}
                    >
                      <Text style={styles.completeButtonText}>Complete</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}

            {todaysQuests.length > 3 && (
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>
                  View All Quests ({todaysQuests.length - 3} more)
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#64748b" />
              </TouchableOpacity>
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  rankText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    color: '#94a3b8',
    fontSize: 14,
  },
  hunterName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  streakText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  statsCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  level: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  progressValue: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  progressCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  dailyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyStatsText: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  dailyPercentage: {
    color: '#a855f7',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dailyProgressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
  },
  questsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
  },
  questCount: {
    color: '#94a3b8',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  questRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questRankText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questInfo: {
    flex: 1,
  },
  questName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  questMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  questXp: {
    color: '#eab308',
    fontSize: 12,
    fontWeight: '600',
  },
  questTime: {
    color: '#94a3b8',
    fontSize: 12,
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  viewAllText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
