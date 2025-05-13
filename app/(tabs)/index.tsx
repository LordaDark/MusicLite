import MusicCard from '@/components/MusicCard';
import SectionHeader from '@/components/SectionHeader';
import SongItem from '@/components/SongItem';
import Colors from '@/constants/colors';
import { playlists, recentlyPlayed } from '@/constants/mockData';
import { usePlayerStore } from '@/store/playerStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { setCurrentSong, setQueue } = usePlayerStore();
  
  const generatedPlaylists = playlists.filter(playlist => playlist.isGenerated);
  const userPlaylists = playlists.filter(playlist => !playlist.isGenerated);
  
  const handlePlaylistPress = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };
  
  const handleSongPress = (index: number) => {
    setCurrentSong(recentlyPlayed[index]);
    setQueue(recentlyPlayed.slice(index + 1));
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Good evening</Text>
        <Text style={styles.welcomeText}>Welcome to MusicLite</Text>
      </View>
      
      <SectionHeader title="Recently Played" />
      <FlatList
        data={recentlyPlayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SongItem 
            song={item} 
            onPress={() => handleSongPress(index)}
          />
        )}
        scrollEnabled={false}
      />
      
      <SectionHeader 
        title="Made For You" 
        onSeeAll={() => router.push('/(tabs)/playlists/generated' as any)}
      />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {generatedPlaylists.map((playlist) => (
          <MusicCard
            key={playlist.id}
            item={playlist}
            songs={playlist.songs}
            onPress={() => handlePlaylistPress(playlist.id)}
            size="medium"
          />
        ))}
      </ScrollView>
      
      <SectionHeader 
        title="Your Playlists" 
        onSeeAll={() => router.push('/(tabs)/playlists/user' as any)}
      />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {userPlaylists.map((playlist) => (
          <MusicCard
            key={playlist.id}
            item={playlist}
            songs={playlist.songs}
            onPress={() => handlePlaylistPress(playlist.id)}
            size="medium"
          />
        ))}
      </ScrollView>
      
      <View style={{ height: 80 }} />
    </ScrollView>
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
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  greeting: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    marginTop: 4,
  },
  horizontalList: {
    paddingLeft: 16,
    paddingRight: 4,
  },
});
