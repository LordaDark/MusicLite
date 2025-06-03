import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
// import { Ionicons } from '@expo/vector-icons'; // Assuming you'll use icons

interface MiniPlayerProps {
  // TODO: Define props: currentSong, isPlaying, onPlayPause, onNext, onPrevious, onOpenFullScreenPlayer
  // For now, let's assume a simple state for no song playing
  currentSong?: {
    title: string;
    artist?: string;
  } | null;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onPlayRandom?: () => void;
  onOpenFullScreenPlayer?: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentSong = null, // Default to null for now
  isPlaying = false,
  onPlayPause,
  onNext,
  onPrevious,
  onPlayRandom,
  onOpenFullScreenPlayer
}) => {
  if (!currentSong) {
    return (
      <ThemedView style={styles.containerNoSong}>
        <ThemedText style={styles.noSongText}>Nessuna canzone in riproduzione</ThemedText>
        <TouchableOpacity style={styles.randomButton} onPress={onPlayRandom}>
          <ThemedText style={styles.randomButtonText}>Riproduci Casuale</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} onTouchEnd={onOpenFullScreenPlayer}>
      <View style={styles.songInfo}>
        <ThemedText style={styles.titleText} numberOfLines={1}>{currentSong.title}</ThemedText>
        {/* <ThemedText style={styles.artistText} numberOfLines={1}>{currentSong.artist || 'Unknown Artist'}</ThemedText> */}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={onPrevious} style={styles.controlButton}>
          {/* <Ionicons name="play-skip-back" size={24} color="white" /> */}
          <ThemedText>Prev</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlayPause} style={styles.controlButton}>
          {/* <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" /> */}
          <ThemedText>{isPlaying ? 'Pause' : 'Play'}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.controlButton}>
          {/* <Ionicons name="play-skip-forward" size={24} color="white" /> */}
          <ThemedText>Next</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#222', // Example background, adapt with ThemedView later
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
    position: 'absolute',
    bottom: 0, // Or wherever your tab bar is, adjust accordingly
  },
  containerNoSong: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#222',
    borderTopWidth: 1,
    borderTopColor: '#333',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  noSongText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#ccc',
  },
  randomButton: {
    backgroundColor: '#1DB954', // Spotify green for example
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  randomButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  songInfo: {
    flex: 1,
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  artistText: {
    fontSize: 12,
    color: '#aaa',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 5,
  },
});

export default MiniPlayer;