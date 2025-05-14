import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import SearchBar from '@/components/SearchBar';
import SongItem from '@/components/SongItem';
import MusicCard from '@/components/MusicCard';
import SectionHeader from '@/components/SectionHeader';
import { artists, genres } from '@/constants/mockData';
import { useTheme } from '@/hooks/useTheme';
import { searchYouTubeSongs } from '@/services/metadataService';
import { ActivityIndicator } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Funzione per cercare su YouTube
  const searchOnYouTube = useCallback(async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchYouTubeSongs(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Errore nella ricerca:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  // Debounce per la ricerca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        searchOnYouTube(searchQuery);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, searchOnYouTube]);
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  const handleGenrePress = (genre: string) => {
    // In un'app reale, questo navigherebbe a una pagina specifica per il genere
    setSearchQuery(genre);
  };
  
  const handleArtistPress = (artistId: string) => {
    router.push(`/artist/${artistId}`);
  };
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (searchQuery.trim().length > 2) {
      await searchOnYouTube(searchQuery);
    }
    setRefreshing(false);
  }, [searchQuery, searchOnYouTube]);
  
  const renderGenreItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[styles.genreItem, { backgroundColor: colors.card }]}
      onPress={() => handleGenrePress(item)}
    >
      <Text style={[styles.genreText, { color: colors.text }]}>{item}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
        placeholder="Cerca canzoni, artisti o album su YouTube"
      />
      
      {searchQuery.trim() === '' ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SectionHeader title="Sfoglia per genere" />
          <FlatList
            data={genres}
            keyExtractor={(item) => item}
            renderItem={renderGenreItem}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.genreList}
          />
          
          <SectionHeader title="Artisti popolari" />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {artists.map((artist) => (
              <MusicCard
                key={artist.id}
                item={{
                  id: artist.id,
                  name: artist.name,
                  coverArt: artist.image,
                  description: artist.genres.join(', ')
                }}
                onPress={() => handleArtistPress(artist.id)}
                size="medium"
              />
            ))}
          </ScrollView>
          
          <View style={{ height: 80 }} />
        </ScrollView>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Ricerca in corso...
              </Text>
            </View>
          ) : (
            <>
              {searchResults.length > 0 ? (
                <>
                  <SectionHeader title="Risultati da YouTube" />
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => item.id || `result-${index}`}
                    renderItem={({ item }) => <SongItem song={item} />}
                    scrollEnabled={false}
                  />
                </>
              ) : (
                searchQuery.trim().length > 2 && (
                  <View style={styles.noResultsContainer}>
                    <Text style={[styles.noResultsText, { color: colors.text }]}>
                      Nessun risultato trovato per "{searchQuery}"
                    </Text>
                    <Text style={[styles.noResultsSubtext, { color: colors.subtext }]}>
                      Prova a cercare canzoni, artisti o album
                    </Text>
                  </View>
                )
              )}
            </>
          )}
          
          <View style={{ height: 80 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  horizontalList: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  genreList: {
    paddingHorizontal: 8,
  },
  genreItem: {
    flex: 1,
    margin: 8,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
