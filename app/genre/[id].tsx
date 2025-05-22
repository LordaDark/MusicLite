import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import SongItem from '@/components/SongItem';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

// Generate a random pastel color based on the genre name
const getGenreColor = (genreName: string) => {
  // Simple hash function to generate a consistent color for each genre name
  let hash = 0;
  for (let i = 0; i < genreName.length; i++) {
    hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate pastel colors (lighter shades)
  const h = hash % 360;
  const s = 60 + (hash % 20); // 60-80% saturation
  const l = 65 + (hash % 15); // 65-80% lightness
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default function GenreScreen() {
  const { id } = useLocalSearchParams();
  const { genres, songs, getSongsByGenre } = useLibraryStore();
  const { playSong } = usePlayerStore();
  const { theme: appTheme } = useSettingsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const genre = genres.find(g => g.id === id);
  
  if (!genre) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Genre not found
        </Text>
      </View>
    );
  }
  
  const genreSongs = songs.filter(song => song.genre === genre.name);
  const genreColor = getGenreColor(genre.name);
  
  const handlePlayAll = () => {
    if (genreSongs.length > 0) {
      playSong(genreSongs[0]);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={genreSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongItem song={item} />}
        ListHeaderComponent={() => (
          <View>
            <View style={[styles.header, { backgroundColor: genreColor }]}>
              <Text style={styles.genreName}>{genre.name}</Text>
              <Text style={styles.songCount}>{genre.count} songs</Text>
              
              <TouchableOpacity 
                style={styles.playButton}
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
              No songs found in this genre
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
  header: {
    padding: 24,
    paddingBottom: 80,
  },
  genreName: {
    fontSize: theme.typography.fontSizes.xxxl,
    fontWeight: theme.typography.fontWeights.bold,
    color: '#000',
    marginBottom: 8,
  },
  songCount: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: 'rgba(0,0,0,0.7)',
    marginBottom: 24,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: theme.radius.round,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: theme.typography.fontWeights.bold,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    paddingHorizontal: 16,
    marginTop: 16,
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