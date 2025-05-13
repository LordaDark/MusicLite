import MiniPlayer from '@/components/MiniPlayer';
import Colors from '@/constants/colors';
import { Tabs } from 'expo-router';
import { Home, Library, Search, Settings } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.dark.primary,
          tabBarInactiveTintColor: Colors.dark.subtext,
          tabBarStyle: {
            backgroundColor: Colors.dark.background,
            borderTopColor: Colors.dark.border,
            height: 60,
            paddingBottom: 10,
          },
          headerStyle: {
            backgroundColor: Colors.dark.background,
            borderBottomColor: Colors.dark.border,
            borderBottomWidth: 1,
          },
          headerTitleStyle: {
            color: Colors.dark.text,
            fontWeight: 'bold',
          },
          headerTintColor: Colors.dark.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color }) => <Library size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          }}
        />
      </Tabs>
      <MiniPlayer />
    </View>
  );
}
