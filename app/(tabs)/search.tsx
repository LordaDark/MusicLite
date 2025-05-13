import MusicCard from '@/components/MusicCard';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import SongItem from '@/components/SongItem';
import Colors from '@/constants/colors';
import { artists, genres, songs } from '@/constants/mockData';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    songs: typeof songs;
    artists: typeof artists;
  }>({ songs: [], artists: [] });
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults({ songs: [], artists: [] });
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    const filteredSongs = songs.filter(
      song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
    );
    
    const filteredArtists = artists.filter(
      artist => artist.name.toLowerCase().includes(query)
    );
    
    setSearchResults({
      songs: filteredSongs,
      artists: filteredArtists
    });
  }, [searchQuery]);
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleGenrePress = (genre: string) => {
    // In a real app, this would navigate to a genre-specific page
    console.log(`Selected genre: ${genre}`);
  };
  
  const handleArtistPress = (artistId: string) => {
    router.push(`/artist/${artistId}`);
  };
  
  const renderGenreItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.genreItem}
      onPress={() => handleGenrePress(item)}
    >
      <Text style={styles.genreText}>{item}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={handleClearSearch}
      />
      
      {searchQuery.trim() === '' ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <SectionHeader title="Browse All" />
          <FlatList
            data={genres}
            keyExtractor={(item) => item}
            renderItem={renderGenreItem}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.genreList}
          />
          
          <SectionHeader title="Popular Artists" />
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
        >
          {searchResults.artists.length > 0 && (
            <>
              <SectionHeader title="Artists" />
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {searchResults.artists.map((artist) => (
                  <MusicCard
                    key={artist.id}
                    item={{
                      id: artist.id,
                      name: artist.name,
                      coverArt: artist.image,
                      description: artist.genres.join(', ')
                    }}
                    onPress={() => handleArtistPress(artist.id)}
                    size="small"
                  />
                ))}
              </ScrollView>
            </>
          )}
          
          {searchResults.songs.length > 0 && (
            <>
              <SectionHeader title="Songs" />
              <FlatList
                data={searchResults.songs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SongItem song={item} />}
                scrollEnabled={false}
              />
            </>
          )}
          
          {searchResults.songs.length === 0 && searchResults.artists.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No results found for "{searchQuery}"
              </Text>
              <Text style={styles.noResultsSubtext}>
                Try searching for songs, artists, or albums
              </Text>
            </View>
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
    backgroundColor: Colors.dark.background,
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
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreText: {
    color: Colors.dark.text,
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
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  noResultsSubtext: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
