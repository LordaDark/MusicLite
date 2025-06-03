import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Modal, StyleSheet, View, useColorScheme } from 'react-native'; // Import useColorScheme directly

import FullScreenPlayer from '@/components/FullScreenPlayer';
import MiniPlayer from '@/components/MiniPlayer';
import { PlayerProvider, usePlayer } from '@/contexts/PlayerContext';

function AppLayout() {
  const { currentSong, isPlaying, playbackPosition, togglePlayPause, playNext, playPrevious, seekPlayback, closeFullScreenPlayer } = usePlayer();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { showFullScreenPlayer } = usePlayer();
  const pathname = usePathname();

  const showMiniPlayer = !pathname.startsWith('/settings') && !pathname.startsWith('/settings/') && !showFullScreenPlayer;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      {showMiniPlayer && (
        <View style={styles.miniPlayerContainer}>
          <MiniPlayer />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showFullScreenPlayer}
      >
        <FullScreenPlayer currentSong={currentSong} isPlaying={isPlaying} progress={playbackPosition} onPlayPause={togglePlayPause} onNext={playNext} onPrevious={playPrevious} onSeek={seekPlayback} onClose={closeFullScreenPlayer} />
      </Modal>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <PlayerProvider>
      <AppLayout />
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 50, // Adjust as needed, considering tab bar height
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it's above other content but below modals
  },
});
