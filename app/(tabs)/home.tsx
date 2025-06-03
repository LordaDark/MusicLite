import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder data - replace with actual data fetching
const recommendedPlaylists = [
  { id: '1', title: 'Chill Vibes', cover: 'https://via.placeholder.com/100?text=Chill' },
  { id: '2', title: 'Workout Hits', cover: 'https://via.placeholder.com/100?text=Workout' },
  { id: '3', title: 'Focus Flow', cover: 'https://via.placeholder.com/100?text=Focus' },
  { id: '4', title: 'Road Trip', cover: 'https://via.placeholder.com/100?text=Road' },
];

const topSongs = [
  { id: 's1', title: 'Song One', artist: 'Artist A' },
  { id: 's2', title: 'Song Two', artist: 'Artist B' },
  { id: 's3', title: 'Song Three', artist: 'Artist C' },
  { id: 's4', title: 'Song Four', artist: 'Artist D' },
  { id: 's5', title: 'Song Five', artist: 'Artist E' },
];

const userPlaylists = [
  { id: 'p1', name: 'My Favorites' },
  { id: 'p2', name: 'Old School' },
  { id: 'p3', name: 'Party Mix' },
  { id: 'p4', name: 'Relaxing Tunes' },
];

export default function HomeScreen() {
  // Use a more specific top padding for Android if needed, as SafeAreaView might behave differently
  const paddingTop = Platform.OS === 'android' ? 25 : 0;
  const colorScheme = useColorScheme() ?? 'light';
  const userName = 'Utente'; // Placeholder for user name

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
      <ThemedView style={[styles.screenContainer, { paddingTop }]}>
      <ThemedText style={styles.headerTitle}>Benvenuto, {userName}!</ThemedText>
      <ScrollView style={styles.scrollView}>
        {/* Recommended Playlists */}
        <View style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Playlist consigliate</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {recommendedPlaylists.map(playlist => (
              <TouchableOpacity key={playlist.id} style={styles.playlistCard}>
                <Image source={{ uri: playlist.cover }} style={styles.playlistCover} />
                <ThemedText style={styles.playlistTitle}>{playlist.title}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top 5 Songs */}
        <View style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Top 5 canzoni</ThemedText>
          {topSongs.map(song => (
            <View key={song.id} style={styles.songItem}>
              <Image source={{ uri: `https://via.placeholder.com/50?text=${song.title.charAt(0)}` }} style={styles.songThumbnail} />
              <View style={styles.songInfo}>
                <ThemedText style={styles.songTitle}>{song.title}</ThemedText>
                <ThemedText style={styles.songArtist}>{song.artist}</ThemedText>
              </View>
              <TouchableOpacity style={[styles.playButton, { backgroundColor: Colors[colorScheme].primary }]}>
                <ThemedText style={{ color: Colors[colorScheme].background }}>Play</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* User Playlists */}
        <View style={styles.sectionContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Le tue playlist</ThemedText>
          <View style={styles.gridContainer}>
            {userPlaylists.map(playlist => (
              <TouchableOpacity key={playlist.id} style={styles.gridItem}>
                <View style={[styles.playlistIcon, { backgroundColor: Colors[colorScheme].secondary }]} />
                <ThemedText style={styles.playlistName}>{playlist.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Mini Player (Fixed at bottom) */}
      <View style={[styles.miniPlayer, { backgroundColor: Colors[colorScheme].background, borderTopColor: Colors[colorScheme].primary }]}>
        <ThemedText>Mini Player: Titolo Canzone</ThemedText>
        <TouchableOpacity style={[styles.playPauseButton, { backgroundColor: Colors[colorScheme].primary }]}>
          <ThemedText style={{ color: Colors[colorScheme].background }}>Play/Pausa</ThemedText>
        </TouchableOpacity>
      </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  playlistCard: {
    marginRight: 16,
    alignItems: 'center',
    width: 120,
  },
  playlistCover: {
    width: 100,
    height: 100,
    borderRadius: 50, // Round covers
    marginBottom: 8,
  },
  playlistTitle: {
    textAlign: 'center',
    fontSize: 14,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    // backgroundColor: '#f0f0f0', // Example background, adjust with theme
  },
  songThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 14,
    // color: '#666',
  },
  playButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // Two columns
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    // backgroundColor: '#e9e9e9', // Example background, adjust with theme
  },
  playlistIcon: {
    width: 60,
    height: 60,
    borderRadius: 8, // Rounded corners for playlist icon
    marginBottom: 8,
    // backgroundColor: 'purple', // Placeholder color
  },
  playlistName: {
    textAlign: 'center',
    fontSize: 14,
  },
  miniPlayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    // borderTopColor: 'green', // Fluorescent color for border
  },
  playPauseButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
});
