
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { HabitProvider } from './src/contexts/HabitContext';
import { theme } from './src/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <HabitProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#1a1a2e" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName: keyof typeof Ionicons.glyphMap;

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'Quests') {
                    iconName = focused ? 'target' : 'target-outline';
                  } else if (route.name === 'Achievements') {
                    iconName = focused ? 'trophy' : 'trophy-outline';
                  } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                  } else {
                    iconName = 'help-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#8b5cf6',
                tabBarInactiveTintColor: '#6b7280',
                tabBarStyle: {
                  backgroundColor: '#1f2937',
                  borderTopColor: '#374151',
                  paddingBottom: 8,
                  paddingTop: 8,
                  height: 70,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '600',
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Quests" component={QuestsScreen} />
              <Tab.Screen name="Achievements" component={AchievementsScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </HabitProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
