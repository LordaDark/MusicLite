import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import SongItem from '@/components/SongItem';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

export default function ArtistScreen() {
  const { id } = useLocalSearchParams();
  const { artists, songs, getSongsByArtist } = useLibraryStore();
  const { playSong } = usePlayerStore();
  const { theme: appTheme } = useSettingsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const artist = artists.find(a => a.id === id);
  
  if (!artist) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Artist not found
        </Text>
      </View>
    );
  }
  
  const artistSongs = songs.filter(song => song.artist === artist.name);
  
  const handlePlayAll = () => {
    if (artistSongs.length > 0) {
      playSong(artistSongs[0]);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={artistSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongItem song={item} showArtist={false} />}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.headerContainer}>
              <Image
                source={{ uri: artist.imageUrl }}
                style={styles.artistImage}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={['transparent', themeColors.background]}
                style={styles.imageGradient}
              />
              <View style={styles.artistInfo}>
                <Text style={[styles.artistName, { color: themeColors.text }]}>
                  {artist.name}
                </Text>
                <Text style={[styles.songCount, { color: themeColors.subtext }]}>
                  {artist.songCount} songs
                </Text>
              </View>
            </View>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.playButton, { backgroundColor: themeColors.primary }]}
                onPress={handlePlayAll}
              >
                <Play size={24} color="#000" />
                <Text style={styles.playButtonText}>Play All</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Songs
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              No songs found for this artist
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 280,
    position: 'relative',
  },
  artistImage: {
    width: '100%',
    height: 240,
  },
  imageGradient: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  artistInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  artistName: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: 4,
  },
  songCount: {
    fontSize: theme.typography.fontSizes.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: theme.radius.round,
  },
  playButtonText: {
    color: '#000',
    fontWeight: theme.typography.fontWeights.bold,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 80, // Space for mini player
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    textAlign: 'center',
    marginTop: 64,
  },
});