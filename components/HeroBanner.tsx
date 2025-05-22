import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import { Playlist } from '@/types';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { theme } from '@/constants/theme';

interface HeroBannerProps {
  playlist: Playlist;
}

const { width } = Dimensions.get('window');

export default function HeroBanner({ playlist }: HeroBannerProps) {
  const router = useRouter();
  const { songs } = useLibraryStore();
  const { playSong } = usePlayerStore();

  const handlePlayPlaylist = () => {
    if (playlist.songs.length > 0) {
      const firstSongId = playlist.songs[0];
      const song = songs.find(s => s.id === firstSongId);
      if (song) {
        playSong(song);
      }
    }
  };

  const handleOpenPlaylist = () => {
    router.push(`/playlist/${playlist.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      activeOpacity={0.9}
      onPress={handleOpenPlaylist}
    >
      <Image
        source={{ uri: playlist.coverUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>{playlist.title}</Text>
            <Text style={styles.description}>{playlist.description}</Text>
          </View>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayPlaylist}
          >
            <Play size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: width - 32,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.typography.fontSizes.sm,
    maxWidth: width - 100,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});