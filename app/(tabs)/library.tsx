import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, RefreshCw } from 'lucide-react-native';
import { useLibraryStore } from '@/store/libraryStore';
import MusicCard from '@/components/MusicCard';
import SongItem from '@/components/SongItem';
import SectionHeader from '@/components/SectionHeader';
import { useTheme } from '@/hooks/useTheme';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';

export default function LibraryScreen() {
  const router = useRouter();
  const { downloadedSongs, userPlaylists, likedSongs } = useLibraryStore();
  const [activeTab, setActiveTab] = useState<'playlists' | 'downloads' | 'liked'>('playlists');
  const { colors } = useTheme();
  const { isLoading, hasPermission, refreshLibrary, localSongs } = useMusicLibrary();
  const [refreshing, setRefreshing] = useState(false);
  
  const handlePlaylistPress = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };
  
  const handleCreatePlaylist = () => {
    // In un'app reale, questo aprirebbe una modale per creare una nuova playlist
    Alert.alert(
      "Crea Playlist",
      "Inserisci un nome per la tua nuova playlist",
      [
        {
          text: "Annulla",
          style: "cancel"
        },
        {
          text: "Crea",
          onPress: () => console.log("Crea playlist")
        }
      ]
    );
  };
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshLibrary(true); // Scansione completa
    setRefreshing(false);
  }, [refreshLibrary]);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: colors.text }]}>
            Caricamento della musica...
          </Text>
        </View>
      );
    }
    
    if (!hasPermission) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: colors.text }]}>
            Permesso richiesto
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
            MusicLite ha bisogno di accedere alla tua libreria multimediale per trovare e riprodurre la tua musica.
          </Text>
          <TouchableOpacity 
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={() => refreshLibrary(true)}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>
              Concedi permesso
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    switch (activeTab) {
      case 'playlists':
        return (
          <>
            <View style={styles.createPlaylistContainer}>
              <TouchableOpacity 
                style={[styles.createPlaylistButton, { backgroundColor: colors.card }]}
                onPress={handleCreatePlaylist}
              >
                <Plus size={24} color={colors.text} />
                <Text style={[styles.createPlaylistText, { color: colors.text }]}>Crea Playlist</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.playlistsGrid}>
              {userPlaylists.map((playlist) => (
                <MusicCard
                  key={playlist.id}
                  item={playlist}
                  songs={playlist.songs}
                  onPress={() => handlePlaylistPress(playlist.id)}
                  size="medium"
                />
              ))}
            </View>
          </>
        );
      
      case 'downloads':
        return localSongs.length > 0 ? (
          <>
            <View style={styles.refreshContainer}>
              <TouchableOpacity 
                style={[styles.refreshButton, { backgroundColor: colors.card }]}
                onPress={() => refreshLibrary(true)}
              >
                <RefreshCw size={18} color={colors.text} />
                <Text style={[styles.refreshText, { color: colors.text }]}>Aggiorna libreria</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={localSongs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SongItem 
                  song={item} 
                  showDownload={false}
                />
              )}
              scrollEnabled={false}
            />
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              Nessuna musica trovata
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Aggiungi musica al tuo dispositivo o aggiorna la tua libreria
            </Text>
            <TouchableOpacity 
              style={[styles.refreshButton, { backgroundColor: colors.card, marginTop: 16 }]}
              onPress={() => refreshLibrary(true)}
            >
              <RefreshCw size={18} color={colors.text} />
              <Text style={[styles.refreshText, { color: colors.text }]}>Aggiorna libreria</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'liked':
        const likedSongsList = localSongs.filter(song => likedSongs.includes(song.id));
        
        return likedSongsList.length > 0 ? (
          <FlatList
            data={likedSongsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SongItem song={item} />}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              Nessuna canzone piaciuta
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.subtext }]}>
              Le canzoni che ti piacciono appariranno qui
            </Text>
          </View>
        );
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'playlists' && [styles.activeTabButton, { backgroundColor: colors.card }]
          ]}
          onPress={() => setActiveTab('playlists')}
        >
          <Text 
            style={[
              styles.tabText,
              { color: colors.subtext },
              activeTab === 'playlists' && { color: colors.text }
            ]}
          >
            Playlist
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'downloads' && [styles.activeTabButton, { backgroundColor: colors.card }]
          ]}
          onPress={() => setActiveTab('downloads')}
        >
          <Text 
            style={[
              styles.tabText,
              { color: colors.subtext },
              activeTab === 'downloads' && { color: colors.text }
            ]}
          >
            Download
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'liked' && [styles.activeTabButton, { backgroundColor: colors.card }]
          ]}
          onPress={() => setActiveTab('liked')}
        >
          <Text 
            style={[
              styles.tabText,
              { color: colors.subtext },
              activeTab === 'liked' && { color: colors.text }
            ]}
          >
            Preferiti
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTabButton: {
    
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  createPlaylistContainer: {
    padding: 16,
  },
  createPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  createPlaylistText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  playlistsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  refreshContainer: {
    padding: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  refreshText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
