import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ImageBackground, ListRenderItem, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react-native';
import { useLibraryStore } from '@/stores/libraryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import SongItem from '@/components/SongItem';
import { formatDuration } from '@/utils/formatters';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { Song } from '@/types';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { playlists, songs, deletePlaylist, updatePlaylist } = useLibraryStore();
  const { playSong } = usePlayerStore();
  const { theme: appTheme } = useSettingsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const [showOptions, setShowOptions] = useState(false);
  
  const playlist = playlists.find(p => p.id === id);
  
  if (!playlist) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Playlist not found
        </Text>
      </View>
    );
  }
  
  const playlistSongs = playlist.songs
    .map(songId => songs.find(s => s.id === songId))
    .filter(Boolean) as Song[];
  
  const totalDuration = playlistSongs.reduce((total, song) => total + (song?.duration || 0), 0);
  
  const handlePlayAll = () => {
    if (playlistSongs.length > 0 && playlistSongs[0]) {
      playSong(playlistSongs[0]);
    }
  };
  
  const handleDeletePlaylist = () => {
    Alert.alert(
      "Delete Playlist",
      `Are you sure you want to delete "${playlist.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePlaylist(playlist.id);
            router.back();
          }
        }
      ]
    );
  };
  
  const handleEditPlaylist = () => {
    // In a real app, you would navigate to an edit screen
    Alert.prompt(
      "Edit Playlist",
      "Enter a new name for this playlist",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Save",
          onPress: (newTitle) => {
            if (newTitle && newTitle.trim()) {
              updatePlaylist(playlist.id, { title: newTitle.trim() });
            }
          }
        }
      ],
      "plain-text",
      playlist.title
    );
  };

  const renderSongItem: ListRenderItem<Song> = ({ item }) => {
    if (!item) return null;
    return <SongItem song={item} />;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={playlistSongs}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        renderItem={renderSongItem}
        ListHeaderComponent={() => (
          <View>
            <ImageBackground
              source={{ uri: playlist.coverUrl }}
              style={styles.headerImage}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
              >
                <View style={styles.headerContent}>
                  <Text style={styles.playlistTitle}>{playlist.title}</Text>
                  <Text style={styles.playlistDescription}>{playlist.description}</Text>
                  <Text style={styles.playlistInfo}>
                    {playlistSongs.length} songs • {formatDuration(totalDuration)}
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.playButton, { backgroundColor: themeColors.primary }]}
                onPress={handlePlayAll}
              >
                <Play size={24} color="#000" />
                <Text style={styles.playButtonText}>Play All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.optionsButton}
                onPress={() => setShowOptions(!showOptions)}
              >
                <MoreVertical size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            {showOptions && (
              <View style={[styles.optionsMenu, { backgroundColor: themeColors.card }]}>
                <TouchableOpacity 
                  style={styles.optionItem}
                  onPress={handleEditPlaylist}
                >
                  <Edit size={20} color={themeColors.text} style={styles.optionIcon} />
                  <Text style={[styles.optionText, { color: themeColors.text }]}>
                    Edit Playlist
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.optionItem}
                  onPress={handleDeletePlaylist}
                >
                  <Trash2 size={20} color={themeColors.error} style={styles.optionIcon} />
                  <Text style={[styles.optionText, { color: themeColors.error }]}>
                    Delete Playlist
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={[styles.listHeader, { borderBottomColor: themeColors.border }]}>
              <Text style={[styles.listHeaderTitle, { color: themeColors.text }]}>
                Songs
              </Text>
              <Clock size={16} color={themeColors.subtext} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: themeColors.text }]}>
              This playlist is empty
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    height: 240,
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '100%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  headerContent: {
    marginBottom: 16,
  },
  playlistTitle: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: theme.typography.fontSizes.md,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  playlistInfo: {
    fontSize: theme.typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.6)',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: theme.radius.round,
  },
  playButtonText: {
    color: '#000',
    fontWeight: '700',
    marginLeft: 8,
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  optionsMenu: {
    marginHorizontal: 16,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  listHeaderTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 140, // Space for mini player and tab bar
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    textAlign: 'center',
    marginTop: 64,
  },
});