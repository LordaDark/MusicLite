import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import SearchBar from '@/components/SearchBar';
import SongItem from '@/components/SongItem';
import GenreItem from '@/components/GenreItem';
import ArtistItem from '@/components/ArtistItem';
import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useSearch } from '@/hooks/useSearch';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { Song, Artist, Genre } from '@/types';

export default function SearchScreen() {
  const router = useRouter();
  const { songs, artists, genres } = useLibraryStore();
  const { theme: appTheme } = useSettingsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    error, 
    searchHistory,
    clearSearch,
    clearHistory,
    removeFromHistory
  } = useSearch();
  
  const [localResults, setLocalResults] = useState<{
    songs: Song[];
    artists: Artist[];
    genres: Genre[];
  }>({
    songs: [],
    artists: [],
    genres: [],
  });
  
  // Handle local search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setLocalResults({
        songs: [],
        artists: [],
        genres: [],
      });
      return;
    }
    
    const searchQuery = query.toLowerCase();
    
    // Search in local library
    const filteredSongs = songs.filter(song => 
      song.title.toLowerCase().includes(searchQuery) || 
      song.artist.toLowerCase().includes(searchQuery) ||
      song.album.toLowerCase().includes(searchQuery)
    );
    
    const filteredArtists = artists.filter(artist => 
      artist.name.toLowerCase().includes(searchQuery)
    );
    
    const filteredGenres = genres.filter(genre => 
      genre.name.toLowerCase().includes(searchQuery)
    );
    
    setLocalResults({
      songs: filteredSongs,
      artists: filteredArtists,
      genres: filteredGenres,
    });
  }, [query, songs, artists, genres]);
  
  const handleClearSearch = () => {
    clearSearch();
  };
  
  const handleHistoryItemPress = (term: string) => {
    setQuery(term);
  };
  
  const handleRemoveHistoryItem = (term: string) => {
    removeFromHistory(term);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
        Search for music
      </Text>
      <Text style={[styles.emptySubtitle, { color: themeColors.subtext }]}>
        Find your favorite songs, artists, and playlists
      </Text>
    </View>
  );
  
  const renderNoResults = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
        No results found
      </Text>
      <Text style={[styles.emptySubtitle, { color: themeColors.subtext }]}>
        Try searching for something else
      </Text>
    </View>
  );
  
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={themeColors.primary} />
      <Text style={[styles.loadingText, { color: themeColors.text }]}>
        Searching...
      </Text>
    </View>
  );
  
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={[styles.errorText, { color: themeColors.error }]}>
        {error}
      </Text>
      <TouchableOpacity 
        style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
        onPress={() => setQuery(query)}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderSearchHistory = () => (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: themeColors.text }]}>
          Recent Searches
        </Text>
        {searchHistory.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={[styles.clearHistoryText, { color: themeColors.primary }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {searchHistory.length > 0 ? (
        searchHistory.map((term) => (
          <View key={term} style={styles.historyItem}>
            <TouchableOpacity 
              style={styles.historyItemContent}
              onPress={() => handleHistoryItemPress(term)}
            >
              <Text style={[styles.historyItemText, { color: themeColors.text }]}>
                {term}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleRemoveHistoryItem(term)}
              style={styles.historyItemRemove}
            >
              <X size={16} color={themeColors.subtext} />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={[styles.noHistoryText, { color: themeColors.subtext }]}>
          No recent searches
        </Text>
      )}
    </View>
  );
  
  const hasLocalResults = query.trim() !== '' && (
    localResults.songs.length > 0 || 
    localResults.artists.length > 0 || 
    localResults.genres.length > 0
  );
  
  const hasOnlineResults = results.length > 0;
  const showNoResults = query.trim() !== '' && !hasLocalResults && !hasOnlineResults && !isLoading;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onClear={handleClearSearch}
        autoFocus={false}
      />
      
      {!query.trim() ? (
        <View style={styles.browseContainer}>
          {renderSearchHistory()}
          
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Browse All
          </Text>
          
          <Text style={[styles.subSectionTitle, { color: themeColors.text }]}>
            Genres
          </Text>
          <FlatList
            data={genres}
            renderItem={({ item }) => <GenreItem genre={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genresContainer}
          />
          
          <Text style={[styles.subSectionTitle, { color: themeColors.text }]}>
            Popular Artists
          </Text>
          <FlatList
            data={artists}
            renderItem={({ item }) => <ArtistItem artist={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistsContainer}
          />
        </View>
      ) : (
        <FlatList
          data={[...localResults.songs, ...results]}
          renderItem={({ item }) => <SongItem song={item} />}
          keyExtractor={item => item.id}
          ListHeaderComponent={() => (
            <>
              {localResults.artists.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={[styles.resultSectionTitle, { color: themeColors.text }]}>
                    Artists in Your Library
                  </Text>
                  <FlatList
                    data={localResults.artists}
                    renderItem={({ item }) => <ArtistItem artist={item} />}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.artistsContainer}
                  />
                </View>
              )}
              
              {localResults.genres.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={[styles.resultSectionTitle, { color: themeColors.text }]}>
                    Genres in Your Library
                  </Text>
                  <FlatList
                    data={localResults.genres}
                    renderItem={({ item }) => <GenreItem genre={item} />}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.genresContainer}
                  />
                </View>
              )}
              
              {localResults.songs.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={[styles.resultSectionTitle, { color: themeColors.text }]}>
                    Songs in Your Library
                  </Text>
                </View>
              )}
              
              {results.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={[styles.resultSectionTitle, { color: themeColors.text }]}>
                    Online Results
                  </Text>
                </View>
              )}
              
              {isLoading && renderLoading()}
              {error && renderError()}
            </>
          )}
          ListEmptyComponent={showNoResults ? renderNoResults : null}
          contentContainerStyle={styles.searchResultsContainer}
        />
      )}
      
      {!hasLocalResults && !hasOnlineResults && !showNoResults && !isLoading && !query.trim() && renderEmptyState()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  browseContainer: {
    flex: 1,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 24,
  },
  subSectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  genresContainer: {
    paddingHorizontal: 16,
  },
  artistsContainer: {
    paddingHorizontal: 16,
  },
  searchResultsContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Space for mini player
  },
  resultSection: {
    marginBottom: 16,
  },
  resultSectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: theme.typography.fontSizes.md,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 10,
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  historyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '600',
  },
  clearHistoryText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemText: {
    fontSize: theme.typography.fontSizes.md,
  },
  historyItemRemove: {
    padding: 4,
  },
  noHistoryText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    paddingVertical: 16,
  },
});