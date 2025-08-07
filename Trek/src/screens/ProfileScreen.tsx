
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Switch, Divider } from 'react-native-paper';

import { useHabits } from '../contexts/HabitContext';
import { getRankConfig } from '../utils';

export default function ProfileScreen() {
  const { playerStats, updatePlayerStats } = useHabits();
  const [focusMode, setFocusMode] = useState(playerStats.focusMode);
  const [notifications, setNotifications] = useState(true);

  const rankConfig = getRankConfig(playerStats.hunterRank);

  const handleToggleFocusMode = () => {
    const newValue = !focusMode;
    setFocusMode(newValue);
    updatePlayerStats({ ...playerStats, focusMode: newValue });
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: 'moon',
          label: 'Focus Mode',
          subtitle: 'Minimize distractions during quests',
          type: 'toggle',
          value: focusMode,
          onToggle: handleToggleFocusMode,
        },
        {
          icon: 'notifications',
          label: 'Push Notifications',
          subtitle: 'Get reminders for your quests',
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: 'palette',
          label: 'Theme',
          subtitle: 'Dark mode enabled',
          type: 'action',
          onPress: () => Alert.alert('Theme', 'Theme customization coming soon!'),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          icon: 'download',
          label: 'Export Data',
          subtitle: 'Download your quest history',
          type: 'action',
          onPress: () => Alert.alert('Export', 'Data export feature coming soon!'),
        },
        {
          icon: 'share',
          label: 'Share Progress',
          subtitle: 'Share your achievements',
          type: 'action',
          onPress: () => Alert.alert('Share', 'Sharing feature coming soon!'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          label: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          type: 'action',
          onPress: () => Alert.alert('Help', 'Help center coming soon!'),
        },
        {
          icon: 'mail',
          label: 'Contact Support',
          subtitle: 'Get in touch with our team',
          type: 'action',
          onPress: () => Alert.alert('Contact', 'Contact support coming soon!'),
        },
      ],
    },
  ];

  const stats = [
    { label: 'Total XP', value: playerStats.totalXp.toLocaleString(), icon: 'flash' },
    { label: 'Quests Completed', value: playerStats.completedHabits, icon: 'checkmark-circle' },
    { label: 'Current Streak', value: `${playerStats.currentStreak} days`, icon: 'flame' },
    { label: 'Longest Streak', value: `${playerStats.longestStreak} days`, icon: 'trending-up' },
    { label: 'Gems Earned', value: playerStats.gems, icon: 'diamond' },
    { label: 'Days Active', value: Math.floor((new Date().getTime() - new Date(playerStats.joinDate).getTime()) / (1000 * 60 * 60 * 24)), icon: 'calendar' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hunter Profile Card */}
          <Card style={styles.profileCard}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'rgba(59, 130, 246, 0.1)']}
              style={styles.profileGradient}
            >
              <View style={styles.profileHeader}>
                <LinearGradient
                  colors={rankConfig.colors}
                  style={styles.profileAvatar}
                >
                  <Ionicons name="person" size={32} color="white" />
                  <View style={[styles.rankBadge, { backgroundColor: rankConfig.colors[0] }]}>
                    <Text style={styles.rankText}>{playerStats.hunterRank}</Text>
                  </View>
                </LinearGradient>
                
                <View style={styles.profileInfo}>
                  <Text style={styles.hunterName}>Shadow Hunter</Text>
                  <Text style={styles.currentTitle}>{playerStats.currentTitle}</Text>
                  <View style={styles.levelContainer}>
                    <Ionicons name="star" size={16} color="#eab308" />
                    <Text style={styles.level}>Level {playerStats.level}</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.joinDate}>
                Hunter since {new Date(playerStats.joinDate).toLocaleDateString()}
              </Text>
            </LinearGradient>
          </Card>

          {/* Statistics Grid */}
          <Card style={styles.statsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="bar-chart" size={24} color="#3b82f6" />
              <Text style={styles.cardTitle}>Statistics</Text>
            </View>
            
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Ionicons name={stat.icon as any} size={20} color="#8b5cf6" />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Settings */}
          {settingsGroups.map((group, groupIndex) => (
            <Card key={groupIndex} style={styles.settingsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{group.title}</Text>
              </View>
              
              <View style={styles.settingsGroup}>
                {group.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <TouchableOpacity
                      style={styles.settingItem}
                      onPress={item.type === 'action' ? item.onPress : undefined}
                      disabled={item.type === 'toggle'}
                    >
                      <View style={styles.settingLeft}>
                        <View style={styles.settingIconContainer}>
                          <Ionicons name={item.icon as any} size={20} color="#8b5cf6" />
                        </View>
                        <View style={styles.settingInfo}>
                          <Text style={styles.settingLabel}>{item.label}</Text>
                          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>
                      
                      {item.type === 'toggle' ? (
                        <Switch
                          value={item.value}
                          onValueChange={item.onToggle}
                          thumbColor={item.value ? '#8b5cf6' : '#6b7280'}
                          trackColor={{ false: '#374151', true: 'rgba(139, 92, 246, 0.3)' }}
                        />
                      ) : (
                        <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                      )}
                    </TouchableOpacity>
                    
                    {itemIndex < group.items.length - 1 && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </Card>
          ))}

          {/* App Info */}
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Text style={styles.appVersion}>Shadow Hunter v1.0.0</Text>
              <Text style={styles.appSubtitle}>Made with ❤️ for ambitious hunters</Text>
            </View>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  rankText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  hunterName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  currentTitle: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  level: {
    color: '#eab308',
    fontSize: 14,
    fontWeight: '600',
  },
  joinDate: {
    color: '#94a3b8',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    marginBottom: 16,
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
    minWidth: 90,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
  },
  settingsGroup: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  divider: {
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    marginVertical: 4,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 20,
  },
  infoContent: {
    alignItems: 'center',
  },
  appVersion: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 4,
  },
  appSubtitle: {
    color: '#64748b',
    fontSize: 12,
  },
});
