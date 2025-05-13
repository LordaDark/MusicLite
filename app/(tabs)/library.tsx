import MusicCard from '@/components/MusicCard';
import SongItem from '@/components/SongItem';
import Colors from '@/constants/colors';
import { useLibraryStore } from '@/store/libraryStore';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LibraryScreen() {
  const router = useRouter();
  const { downloadedSongs, userPlaylists, likedSongs } = useLibraryStore();
  const [activeTab, setActiveTab] = useState<'playlists' | 'downloads' | 'liked'>('playlists');
  
  const handlePlaylistPress = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };
  
  const handleCreatePlaylist = () => {
    // In a real app, this would open a modal to create a new playlist
    console.log('Create new playlist');
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return (
          <>
            <View style={styles.createPlaylistContainer}>
              <TouchableOpacity 
                style={styles.createPlaylistButton}
                onPress={handleCreatePlaylist}
              >
                <Plus size={24} color={Colors.dark.text} />
                <Text style={styles.createPlaylistText}>Create Playlist</Text>
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
        return downloadedSongs.length > 0 ? (
          <FlatList
            data={downloadedSongs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SongItem 
                song={item} 
                showDownload={false}
              />
            )}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No downloaded songs yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Songs you download will appear here
            </Text>
          </View>
        );
      
      case 'liked':
        return likedSongs.length > 0 ? (
          <FlatList
            data={likedSongs}
            keyExtractor={(id) => id}
            renderItem={({ item: id }) => {
              const song = downloadedSongs.find(s => s.id === id);
              if (!song) return null;
              return <SongItem song={song} />;
            }}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No liked songs yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Songs you like will appear here
            </Text>
          </View>
        );
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'playlists' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('playlists')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'playlists' && styles.activeTabText
            ]}
          >
            Playlists
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'downloads' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('downloads')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'downloads' && styles.activeTabText
            ]}
          >
            Downloads
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'liked' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('liked')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'liked' && styles.activeTabText
            ]}
          >
            Liked
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
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
    backgroundColor: Colors.dark.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: Colors.dark.card,
  },
  tabText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 8,
  },
  createPlaylistText: {
    color: Colors.dark.text,
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
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: Colors.dark.subtext,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
