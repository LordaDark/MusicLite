import SongItem from '@/components/SongItem';
import Colors from '@/constants/colors';
import { artists, songs } from '@/constants/mockData';
import { usePlayerStore } from '@/store/playerStore';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { setCurrentSong, setQueue } = usePlayerStore();
  
  const artist = artists.find(a => a.id === id);
  const artistSongs = songs.filter(s => s.artist === artist?.name);
  
  if (!artist) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Artist not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const handlePlayAll = () => {
    if (artistSongs.length > 0) {
      setCurrentSong(artistSongs[0]);
      setQueue(artistSongs.slice(1));
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(30,30,30,0.8)', Colors.dark.background]}
          style={styles.gradient}
        />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.artistHeader}>
            <Image
              source={{ uri: artist.image }}
              style={styles.artistImage}
              contentFit="cover"
              transition={300}
            />
            
            <View style={styles.artistInfo}>
              <Text style={styles.artistName}>{artist.name}</Text>
              <Text style={styles.artistGenres}>
                {artist.genres.join(' • ')}
              </Text>
              <Text style={styles.artistStats}>
                {artistSongs.length} songs
              </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayAll}
            >
              <Play color={Colors.dark.background} size={24} />
              <Text style={styles.playButtonText}>Play All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.songsContainer}>
            <Text style={styles.sectionTitle}>Popular Songs</Text>
            
            <FlatList
              data={artistSongs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SongItem 
                  song={item} 
                  showArtist={false}
                />
              )}
              scrollEnabled={false}
            />
          </View>
          
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  artistHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  artistImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  artistInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  artistName: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  artistGenres: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  artistStats: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  playButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  songsContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  notFoundText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  backLink: {
    color: Colors.dark.primary,
    fontSize: 16,
    marginTop: 16,
  },
});
