import SongItem from '@/components/SongItem';
import Colors from '@/constants/colors';
import { playlists } from '@/constants/mockData';
import { usePlayerStore } from '@/store/playerStore';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MoreVertical, Play } from 'lucide-react-native';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { setCurrentSong, setQueue } = usePlayerStore();
  
  const playlist = playlists.find(p => p.id === id);
  
  if (!playlist) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Playlist not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      setCurrentSong(playlist.songs[0]);
      setQueue(playlist.songs.slice(1));
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
          <View style={styles.playlistHeader}>
            <Image
              source={{ uri: playlist.coverArt }}
              style={styles.playlistImage}
              contentFit="cover"
              transition={300}
            />
            
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistName}>{playlist.name}</Text>
              <Text style={styles.playlistDescription}>{playlist.description}</Text>
              <Text style={styles.playlistStats}>
                {playlist.songs.length} songs
              </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Heart size={24} color={Colors.dark.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <MoreVertical size={24} color={Colors.dark.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayAll}
            >
              <Play color={Colors.dark.background} size={24} />
              <Text style={styles.playButtonText}>Play All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.songsContainer}>
            <FlatList
              data={playlist.songs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SongItem song={item} />}
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
  playlistHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  playlistImage: {
    width: 180,
    height: 180,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playlistInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  playlistName: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playlistDescription: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  playlistStats: {
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
  iconButton: {
    padding: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginLeft: 16,
  },
  playButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  songsContainer: {
    marginTop: 24,
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
