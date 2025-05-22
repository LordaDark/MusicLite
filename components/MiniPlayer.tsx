import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause, SkipForward, X } from 'lucide-react-native';
import { usePlayerStore } from '@/stores/playerStore';
import { theme } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function MiniPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    pauseSong, 
    resumeSong, 
    nextSong,
    showFullPlayer,
    miniPlayerVisible,
    hideMiniPlayer,
    stopPlayback
  } = usePlayerStore();

  if (!currentSong || !miniPlayerVisible) return null;

  const handlePlayPause = () => {
    isPlaying ? pauseSong() : resumeSong();
  };

  const handleNextSong = () => {
    nextSong();
  };

  const handleOpenPlayer = () => {
    showFullPlayer();
  };
  
  const handleClose = () => {
    stopPlayback();
    hideMiniPlayer();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.playerContent}
        activeOpacity={0.95}
        onPress={handleOpenPlayer}
      >
        <Image
          source={{ uri: currentSong.coverUrl }}
          style={styles.cover}
          contentFit="cover"
          transition={200}
        />
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={24} color={theme.colors.dark.text} />
            ) : (
              <Play size={24} color={theme.colors.dark.text} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={handleNextSong}
          >
            <SkipForward size={24} color={theme.colors.dark.text} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={handleClose}
      >
        <X size={20} color={theme.colors.dark.subtext} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80, // Raised above tab bar
    left: 0,
    right: 0,
    backgroundColor: theme.colors.dark.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.dark.border,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.dark.border,
  },
  playerContent: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
    color: theme.colors.dark.text,
    marginBottom: 2,
  },
  artist: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});