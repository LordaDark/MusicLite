import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
// import { Ionicons } from '@expo/vector-icons'; // Assuming you'll use icons
// import Slider from '@react-native-community/slider'; // For song progress

interface FullScreenPlayerProps {
  // TODO: Define props: currentSong, isPlaying, progress, duration, onPlayPause, onNext, onPrevious, onSeek, onClose
  currentSong: {
    title: string;
    artist?: string;
    albumArtUrl?: string; // Large image
    duration?: number | null; // in seconds
    // Add other details like album, year etc. if available from backend
  } | null;
  isPlaying?: boolean;
  progress?: number | null; // current playback time in seconds
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (value: number) => void;
  onClose?: () => void; // To close the full screen player and return to mini player view
}

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  currentSong,
  isPlaying = false,
  progress = 0,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onClose,
}) => {
  if (!currentSong) {
    // This case should ideally be handled by not opening the FullScreenPlayer
    // if there's no song, but as a fallback:
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>Nessuna canzone selezionata.</ThemedText>
        <TouchableOpacity onPress={onClose} style={styles.closeButtonTop}>
          {/* <Ionicons name="close" size={30} color="white" /> */}
          <ThemedText>Close</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButtonTop}>
        {/* <Ionicons name="chevron-down" size={30} color="white" /> */}
        <ThemedText>Down</ThemedText>
      </TouchableOpacity>

      <Image 
        source={{ uri: currentSong.albumArtUrl || 'https://via.placeholder.com/300' }} 
        style={styles.albumArt}
      />
      
      <View style={styles.songDetailsContainer}>
        <ThemedText style={styles.titleText} numberOfLines={2}>{currentSong.title}</ThemedText>
        <ThemedText style={styles.artistText} numberOfLines={1}>{currentSong.artist || 'Artista Sconosciuto'}</ThemedText>
      </View>

      {/* Progress Slider */}
      <View style={styles.sliderContainer}>
        <ThemedText style={styles.timeText}>{formatTime(progress || 0)}</ThemedText>
        {/* <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={currentSong.duration || 0}
          value={progress}
          onSlidingComplete={onSeek}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#555"
          thumbTintColor="#1DB954"
        /> */}
        <ThemedText style={styles.timeText}>{formatTime(currentSong.duration || 0)}</ThemedText>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={onPrevious} style={styles.controlButton}>
          {/* <Ionicons name="play-skip-back-outline" size={35} color="white" /> */}
          <ThemedText>Prev</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlayPause} style={[styles.controlButton, styles.playPauseButton]}>
          {/* <Ionicons name={isPlaying ? "pause-circle-outline" : "play-circle-outline"} size={70} color="white" /> */}
          <ThemedText>{isPlaying ? 'Pause' : 'Play'}</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.controlButton}>
          {/* <Ionicons name="play-skip-forward-outline" size={35} color="white" /> */}
          <ThemedText>Next</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* TODO: Add other controls like shuffle, repeat, lyrics, queue etc. */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#121212', // Dark theme for player
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonTop: {
    position: 'absolute',
    top: 40, // Adjust based on status bar height
    left: 20,
    zIndex: 10,
  },
  albumArt: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  songDetailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%'
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    // color: 'white',
    marginBottom: 5,
  },
  artistText: {
    fontSize: 18,
    // color: '#aaa',
    textAlign: 'center',
  },
  sliderContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    // color: '#aaa',
    width: 40, // Ensure consistent width for time
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
  },
  playPauseButton: {
    // Larger touch area for play/pause
  },
});

export default FullScreenPlayer;