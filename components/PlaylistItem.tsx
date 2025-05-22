import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { Playlist } from '@/types';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { theme } from '@/constants/theme';

interface PlaylistItemProps {
  playlist: Playlist;
  size?: 'small' | 'medium' | 'large';
}

export default function PlaylistItem({ playlist, size = 'medium' }: PlaylistItemProps) {
  const router = useRouter();
  const { songs } = useLibraryStore();
  const { playSong } = usePlayerStore();

  const handlePress = () => {
    router.push(`/playlist/${playlist.id}`);
  };

  const handlePlayPress = (e: any) => {
    e.stopPropagation();
    if (playlist.songs.length > 0) {
      const firstSongId = playlist.songs[0];
      const song = songs.find(s => s.id === firstSongId);
      if (song) {
        playSong(song);
      }
    }
  };

  // Determine dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 140, height: 140 };
      case 'large':
        return { width: 180, height: 180 };
      case 'medium':
      default:
        return { width: 160, height: 160 };
    }
  };

  const dimensions = getDimensions();

  return (
    <TouchableOpacity 
      style={[styles.container, { width: dimensions.width }]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { width: dimensions.width, height: dimensions.width }]}>
        <Image
          source={{ uri: playlist.coverUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <TouchableOpacity 
          style={styles.playButton}
          onPress={handlePlayPress}
        >
          <Play size={20} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {playlist.title}
        </Text>
        <Text style={styles.songCount} numberOfLines={1}>
          {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    marginBottom: 16,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  playButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  info: {
    marginTop: 8,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.dark.text,
    marginBottom: 2,
  },
  songCount: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
  },
});