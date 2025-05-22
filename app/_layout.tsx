import { RorkErrorBoundary } from "../.rorkai/rork-error-boundary";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import MiniPlayer from "@/components/MiniPlayer";
import FullPlayer from "@/components/FullPlayer";
import { useSettingsStore } from "@/stores/settingsStore";
import { colors } from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

// Create a client
const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </trpc.Provider>
    
  );
}

function RootLayoutNav() {
  const { theme: appTheme } = useSettingsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar style={appTheme === 'dark' ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: themeColors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="playlist/[id]" 
          options={{ 
            title: "Playlist",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="song/[id]" 
          options={{ 
            title: "Song",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="artist/[id]" 
          options={{ 
            title: "Artist",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="genre/[id]" 
          options={{ 
            title: "Genre",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="analytics" 
          options={{ 
            title: "Analytics",
            headerBackTitle: "Back",
          }} 
        />
      </Stack>
      <MiniPlayer />
      <FullPlayer />
    </View>
  );
}