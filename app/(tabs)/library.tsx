import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import LibraryTabs from '@/components/LibraryTabs';
import SongItem from '@/components/SongItem';
import PlaylistItem from '@/components/PlaylistItem';
import GenreItem from '@/components/GenreItem';
import ArtistItem from '@/components/ArtistItem';
import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

const TABS = ['Songs', 'Playlists', 'Artists', 'Genres'];

export default function LibraryScreen() {
  const router = useRouter();
  const { songs, playlists, artists, genres, getDownloadedSongs, favorites } = useLibraryStore();
  const { theme: appTheme } = useSettingsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [showDownloaded, setShowDownloaded] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  
  const downloadedSongs = songs.filter(song => song.isDownloaded);
  const favoriteSongs = songs.filter(song => favorites.includes(song.id));
  
  const renderContent = () => {
    switch (activeTab) {
      case 'Songs':
        let displaySongs = songs;
        if (showDownloaded) {
          displaySongs = downloadedSongs;
        } else if (showFavorites) {
          displaySongs = favoriteSongs;
        }
        
        return (
          <FlatList
            key="songs-list"
            data={displaySongs}
            renderItem={({ item }) => <SongItem song={item} />}
            keyExtractor={item => item.id}
            ListHeaderComponent={() => (
              <View style={styles.filterContainer}>
                <Text 
                  style={[
                    styles.filterOption, 
                    !showDownloaded && !showFavorites && styles.activeFilter,
                    { color: !showDownloaded && !showFavorites ? themeColors.primary : themeColors.subtext }
                  ]}
                  onPress={() => {
                    setShowDownloaded(false);
                    setShowFavorites(false);
                  }}
                >
                  All Songs
                </Text>
                <Text 
                  style={[
                    styles.filterOption, 
                    showDownloaded && styles.activeFilter,
                    { color: showDownloaded ? themeColors.primary : themeColors.subtext }
                  ]}
                  onPress={() => {
                    setShowDownloaded(true);
                    setShowFavorites(false);
                  }}
                >
                  Downloaded
                </Text>
                <Text 
                  style={[
                    styles.filterOption, 
                    showFavorites && styles.activeFilter,
                    { color: showFavorites ? themeColors.primary : themeColors.subtext }
                  ]}
                  onPress={() => {
                    setShowDownloaded(false);
                    setShowFavorites(true);
                  }}
                >
                  Favorites
                </Text>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themeColors.text }]}>
                  {showDownloaded 
                    ? "You haven't downloaded any songs yet" 
                    : showFavorites
                      ? "You haven't favorited any songs yet"
                      : "Your library is empty"}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        );
        
      case 'Playlists':
        return (
          <FlatList
            key="playlists-grid"
            data={playlists}
            renderItem={({ item }) => <PlaylistItem playlist={item} size="large" />}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.playlistsRow}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themeColors.text }]}>
                  You haven't created any playlists yet
                </Text>
              </View>
            )}
            contentContainerStyle={styles.gridContent}
          />
        );
        
      case 'Artists':
        return (
          <FlatList
            key="artists-grid"
            data={artists}
            renderItem={({ item }) => <ArtistItem artist={item} />}
            keyExtractor={item => item.id}
            numColumns={3}
            columnWrapperStyle={styles.artistsRow}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themeColors.text }]}>
                  No artists found
                </Text>
              </View>
            )}
            contentContainerStyle={styles.gridContent}
          />
        );
        
      case 'Genres':
        return (
          <FlatList
            key="genres-grid"
            data={genres}
            renderItem={({ item }) => <GenreItem genre={item} />}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.genresRow}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: themeColors.text }]}>
                  No genres found
                </Text>
              </View>
            )}
            contentContainerStyle={styles.gridContent}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <LibraryTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterOption: {
    marginRight: 16,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  activeFilter: {
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 80, // Space for mini player
  },
  gridContent: {
    padding: 16,
    paddingBottom: 80, // Space for mini player
  },
  playlistsRow: {
    justifyContent: 'space-between',
  },
  artistsRow: {
    justifyContent: 'space-between',
  },
  genresRow: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
  },
});