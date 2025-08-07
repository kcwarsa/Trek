
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, FAB } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { useHabits } from '../contexts/HabitContext';
import { getRankConfig } from '../utils';
import { Habit } from '../types';

export default function QuestsScreen() {
  const { habits, completeHabit, updateHabits } = useHabits();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const today = new Date().toISOString().split('T')[0];
  const activeQuests = habits.filter(h => !h.completions.includes(today));
  const completedQuests = habits.filter(h => h.completions.includes(today));

  const handleDeleteQuest = (questId: string) => {
    Alert.alert(
      'Delete Quest',
      'Are you sure you want to delete this quest?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newHabits = habits.filter(h => h.id !== questId);
            updateHabits(newHabits);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const QuestCard = ({ quest, isActive = true }: { quest: Habit; isActive?: boolean }) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const rankConfig = getRankConfig(quest.rank);

    const gestureHandler = useAnimatedGestureHandler({
      onStart: () => {
        'worklet';
      },
      onActive: (event) => {
        'worklet';
        translateX.value = event.translationX;
      },
      onEnd: (event) => {
        'worklet';
        if (event.translationX > 100 && isActive) {
          // Swipe right to complete
          opacity.value = withSpring(0);
          runOnJS(completeHabit)(quest.id);
          runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
        } else if (event.translationX < -100) {
          // Swipe left to delete
          opacity.value = withSpring(0);
          runOnJS(handleDeleteQuest)(quest.id);
        } else {
          translateX.value = withSpring(0);
        }
      },
    });

    const cardStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    }));

    const rightActionStyle = useAnimatedStyle(() => ({
      opacity: translateX.value > 50 ? 1 : 0,
    }));

    const leftActionStyle = useAnimatedStyle(() => ({
      opacity: translateX.value < -50 ? 1 : 0,
    }));

    return (
      <View style={styles.questContainer}>
        {/* Background actions */}
        <Animated.View style={[styles.rightAction, rightActionStyle]}>
          <Ionicons name="checkmark-circle" size={32} color="#10b981" />
          <Text style={styles.actionText}>Complete</Text>
        </Animated.View>
        
        <Animated.View style={[styles.leftAction, leftActionStyle]}>
          <Ionicons name="trash" size={32} color="#ef4444" />
          <Text style={styles.actionText}>Delete</Text>
        </Animated.View>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={cardStyle}>
            <Card style={[styles.questCard, !isActive && styles.completedQuestCard]}>
              <View style={styles.questContent}>
                <LinearGradient
                  colors={rankConfig.colors}
                  style={styles.questRank}
                >
                  <Text style={styles.questRankText}>{quest.rank}</Text>
                </LinearGradient>

                <View style={styles.questInfo}>
                  <Text style={[styles.questName, !isActive && styles.completedQuestName]}>
                    {quest.name}
                  </Text>
                  <View style={styles.questMeta}>
                    <Text style={styles.questXp}>+{quest.xpReward} XP</Text>
                    {quest.estimatedTime && (
                      <>
                        <Text style={styles.metaDivider}>•</Text>
                        <Text style={styles.questTime}>{quest.estimatedTime}min</Text>
                      </>
                    )}
                    {quest.category && (
                      <>
                        <Text style={styles.metaDivider}>•</Text>
                        <Text style={styles.questCategory}>{quest.category}</Text>
                      </>
                    )}
                  </View>
                  {quest.timeOfDay && quest.timeOfDay !== 'any' && (
                    <Text style={styles.questTimeOfDay}>Best time: {quest.timeOfDay}</Text>
                  )}
                </View>

                {isActive && (
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => completeHabit(quest.id)}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          </Animated.View>
        </PanGestureHandler>
      </View>
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
          <Text style={styles.headerTitle}>Quest Log</Text>
        </View>

        {/* Swipe hint */}
        <View style={styles.hintContainer}>
          <Ionicons name="swap-horizontal" size={16} color="#64748b" />
          <Text style={styles.hintText}>Swipe right to complete, left to delete</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active ({activeQuests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed ({completedQuests.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'active' ? (
            activeQuests.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="target" size={64} color="#64748b" />
                <Text style={styles.emptyTitle}>No Active Quests</Text>
                <Text style={styles.emptySubtitle}>
                  Create your first quest to begin your journey!
                </Text>
              </View>
            ) : (
              activeQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} isActive={true} />
              ))
            )
          ) : (
            completedQuests.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-circle" size={64} color="#64748b" />
                <Text style={styles.emptyTitle}>No Completed Quests</Text>
                <Text style={styles.emptySubtitle}>
                  Complete some quests to see them here!
                </Text>
              </View>
            ) : (
              completedQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} isActive={false} />
              ))
            )
          )}
        </ScrollView>

        {/* FAB */}
        <FAB
          style={styles.fab}
          icon="plus"
          color="white"
          onPress={() => {
            // TODO: Navigate to add quest screen
            Alert.alert('Add Quest', 'Add quest functionality coming soon!');
          }}
        />
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
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  hintText: {
    color: '#64748b',
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
  questContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  rightAction: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  leftAction: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  questCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
  },
  completedQuestCard: {
    opacity: 0.7,
  },
  questContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  completedQuestName: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  questMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  questXp: {
    color: '#eab308',
    fontSize: 12,
    fontWeight: '600',
  },
  metaDivider: {
    color: '#64748b',
    fontSize: 12,
  },
  questTime: {
    color: '#94a3b8',
    fontSize: 12,
  },
  questCategory: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  questTimeOfDay: {
    color: '#64748b',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  completeButton: {
    backgroundColor: '#10b981',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#8b5cf6',
  },
});
