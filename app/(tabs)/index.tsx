import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, RefreshControl } from 'react-native';
import { usePlayerStore } from '@/store/playerStore';
import MusicCard from '@/components/MusicCard';
import SongItem from '@/components/SongItem';
import SectionHeader from '@/components/SectionHeader';
import { playlists, recentlyPlayed } from '@/constants/mockData';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import { ActivityIndicator } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { setCurrentSong, setQueue } = usePlayerStore();
  const { colors } = useTheme();
  const { localSongs, refreshLibrary, isLoading, lastScanTime } = useMusicLibrary();
  const [refreshing, setRefreshing] = useState(false);
  
  const generatedPlaylists = playlists.filter(playlist => playlist.isGenerated);
  const userPlaylists = playlists.filter(playlist => !playlist.isGenerated);
  
  const handlePlaylistPress = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };
  
  const handleSongPress = (index: number) => {
    if (localSongs && localSongs.length > 0) {
      setCurrentSong(localSongs[index]);
      setQueue(localSongs.slice(index + 1));
    } else if (recentlyPlayed.length > 0) {
      setCurrentSong(recentlyPlayed[index]);
      setQueue(recentlyPlayed.slice(index + 1));
    }
  };
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshLibrary(false); // Scansione incrementale
    setRefreshing(false);
  }, [refreshLibrary]);
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.welcomeSection}>
        <Text style={[styles.greeting, { color: colors.text }]}>Buongiorno</Text>
        <Text style={[styles.welcomeText, { color: colors.subtext }]}>Benvenuto su MusicLite</Text>
      </View>
      
      <SectionHeader title="La tua musica" />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Scansione della libreria musicale...
          </Text>
        </View>
      ) : localSongs && localSongs.length > 0 ? (
        <FlatList
          data={localSongs.slice(0, 5)} // Mostra solo le prime 5 canzoni
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SongItem 
              song={item} 
              onPress={() => handleSongPress(index)}
            />
          )}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: colors.text }]}>
            Nessuna canzone trovata
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
            Aggiungi musica al tuo dispositivo o cerca su YouTube
          </Text>
        </View>
      )}
      
      {lastScanTime && (
        <Text style={[styles.lastScanText, { color: colors.subtext }]}>
          Ultima scansione: {new Date(lastScanTime).toLocaleString()}
        </Text>
      )}
      
      <SectionHeader 
        title="Creati per te" 
        onSeeAll={() => router.push('/playlists/generated')}
      />
      
      {localSongs && localSongs.length > 5 ? (
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
      ) : (
        <View style={styles.notEnoughDataContainer}>
          <Text style={[styles.notEnoughDataText, { color: colors.text }]}>
            Dati insufficienti per i suggerimenti
          </Text>
          <Text style={[styles.notEnoughDataSubtext, { color: colors.subtext }]}>
            Ascolta più musica per ricevere suggerimenti personalizzati
          </Text>
        </View>
      )}
      
      <SectionHeader 
        title="Le tue playlist" 
        onSeeAll={() => router.push('/playlists/user')}
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
  },
  contentContainer: {
    paddingBottom: 20,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 16,
    marginTop: 4,
  },
  horizontalList: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  lastScanText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  notEnoughDataContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  notEnoughDataText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notEnoughDataSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
