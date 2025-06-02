import { MaterialIcons } from '@expo/vector-icons'; // Using MaterialIcons for standard icons
import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].primary, // Fluorescent color for active tab
        tabBarInactiveTintColor: Colors[colorScheme].icon, // Default icon color
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopColor: Colors[colorScheme].background, // Match background for a cleaner look
        },
        tabBarLabelStyle: {
          fontSize: 10, // Reduced text size for labels
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={28} color={focused ? Colors[colorScheme].primary : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Cerca',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="search" size={28} color={focused ? Colors[colorScheme].primary : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Libreria',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="library-music" size={28} color={focused ? Colors[colorScheme].primary : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Impostazioni',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="settings" size={28} color={focused ? Colors[colorScheme].primary : color} />
          ),
        }}
      />
    </Tabs>
  );
}
