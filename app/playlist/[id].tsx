import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { Play, Heart, MoreVertical, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SongItem from '@/components/SongItem';
import { playlists } from '@/constants/mockData';
import { usePlayerStore } from '@/store/playerStore';
import { useTheme } from '@/hooks/useTheme';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { setCurrentSong, setQueue } = usePlayerStore();
  const { colors } = useTheme();
  
  const playlist = playlists.find(p => p.id === id);
  
  if (!playlist) {
    return (
      <View style={[styles.notFoundContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.text }]}>Playlist not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
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
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={['rgba(30,30,30,0.8)', colors.background]}
          style={styles.gradient}
        />
        
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
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
              <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
              <Text style={[styles.playlistDescription, { color: colors.subtext }]}>{playlist.description}</Text>
              <Text style={[styles.playlistStats, { color: colors.subtext }]}>
                {playlist.songs.length} songs
              </Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Heart size={24} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <MoreVertical size={24} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: colors.primary }]}
              onPress={handlePlayAll}
            >
              <Play color={colors.background} size={24} />
              <Text style={[styles.playButtonText, { color: colors.background }]}>Play All</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playlistDescription: {
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  playlistStats: {
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginLeft: 16,
  },
  playButtonText: {
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
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
  },
  backLink: {
    fontSize: 16,
    marginTop: 16,
  },
});
