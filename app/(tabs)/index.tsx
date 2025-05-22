import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import HeroBanner from '@/components/HeroBanner';
import SongItem from '@/components/SongItem';
import PlaylistItem from '@/components/PlaylistItem';
import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePlayerStore } from '@/stores/playerStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { getTrendingMusic } from '@/services/api';
import { Song } from '@/types';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';

export default function HomeScreen() {
  const router = useRouter();
  const { songs, playlists, recentlyPlayed, favorites } = useLibraryStore();
  const { theme: appTheme } = useSettingsStore();
  const { playSong } = usePlayerStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  
  // Get featured playlist (first one for now)
  const featuredPlaylist = playlists.length > 0 ? playlists[0] : null;
  
  // Get top 5 songs by play count
  const topSongs = [...songs]
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 5);
  
  // Get recently played songs
  const recentSongs = recentlyPlayed
    .map(id => songs.find(song => song.id === id))
    .filter(Boolean)
    .slice(0, 5) as Song[];
  
  // Get favorite songs
  const favoriteSongs = favorites
    .map(id => songs.find(song => song.id === id))
    .filter(Boolean) as Song[];
  
  // Load trending songs
  const loadTrendingSongs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const trending = await getTrendingMusic(10);
      setTrendingSongs(trending);
    } catch (err) {
      console.error('Error loading trending songs:', err);
      setError('Could not load trending songs. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load trending songs on mount
  useEffect(() => {
    loadTrendingSongs();
  }, []);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadTrendingSongs();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[themeColors.primary]}
          tintColor={themeColors.primary}
        />
      }
    >
      <SafeAreaView>
        <Text style={[styles.greeting, { color: themeColors.text }]}>
          Good {getGreeting()}
        </Text>
        
        {featuredPlaylist && (
          <HeroBanner playlist={featuredPlaylist} />
        )}
        
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>
              Loading trending songs...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: themeColors.error }]}>
              {error}
            </Text>
          </View>
        ) : trendingSongs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Trending Now
            </Text>
            <View style={styles.songsList}>
              {trendingSongs.slice(0, 5).map(song => (
                <SongItem key={song.id} song={song} />
              ))}
            </View>
          </View>
        )}
        
        {topSongs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Your Top Tracks
            </Text>
            <View style={styles.songsList}>
              {topSongs.map(song => (
                <SongItem key={song.id} song={song} />
              ))}
            </View>
          </View>
        )}
        
        {recentSongs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Recently Played
            </Text>
            <View style={styles.songsList}>
              {recentSongs.map(song => (
                <SongItem key={song.id} song={song} />
              ))}
            </View>
          </View>
        )}
        
        {favoriteSongs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Your Favorites
            </Text>
            <View style={styles.songsList}>
              {favoriteSongs.slice(0, 5).map(song => (
                <SongItem key={song.id} song={song} />
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Your Playlists
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowCreatePlaylist(true)}
            >
              <Plus size={20} color={themeColors.primary} />
            </TouchableOpacity>
          </View>
          
          {playlists.length > 0 ? (
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playlistsContainer}
            >
              {playlists.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyPlaylistsContainer}>
              <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
                You haven't created any playlists yet
              </Text>
              <TouchableOpacity 
                style={[styles.createPlaylistButton, { backgroundColor: themeColors.primary }]}
                onPress={() => setShowCreatePlaylist(true)}
              >
                <Text style={styles.createPlaylistButtonText}>Create Playlist</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
      
      <CreatePlaylistModal 
        visible={showCreatePlaylist}
        onClose={() => setShowCreatePlaylist(false)}
      />
    </ScrollView>
  );
}

// Helper function to get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 140, // Space for mini player and tab bar
  },
  greeting: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(57, 255, 20, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songsList: {
    marginBottom: 8,
  },
  playlistsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: theme.typography.fontSizes.md,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
  emptyPlaylistsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    marginBottom: 16,
  },
  createPlaylistButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
  },
  createPlaylistButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});