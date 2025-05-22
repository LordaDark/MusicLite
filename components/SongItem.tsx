import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Play, Pause, MoreVertical, Download, Check, Trash2, Heart } from 'lucide-react-native';
import { Song } from '@/types';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useDownload } from '@/hooks/useDownload';
import { formatDuration } from '@/utils/formatters';
import { theme } from '@/constants/theme';

interface SongItemProps {
  song: Song;
  showArtist?: boolean;
  onOptionsPress?: () => void;
}

export default function SongItem({ song, showArtist = true, onOptionsPress }: SongItemProps) {
  const { playSong, currentSongId, isPlaying, pauseSong, resumeSong } = usePlayerStore();
  const { favorites, toggleFavorite } = useLibraryStore();
  const { isDownloading, progress, startDownload, removeDownload } = useDownload();
  const [showOptions, setShowOptions] = useState(false);
  const [isDownloadingThis, setIsDownloadingThis] = useState(false);
  
  const isCurrentSong = currentSongId === song.id;
  const isFavorite = favorites.includes(song.id);
  
  const handlePress = () => {
    if (isCurrentSong) {
      isPlaying ? pauseSong() : resumeSong();
    } else {
      playSong(song);
    }
  };
  
  const handleOptionsPress = () => {
    if (onOptionsPress) {
      onOptionsPress();
    } else {
      setShowOptions(!showOptions);
    }
  };
  
  const handleDownload = async () => {
    if (song.isDownloaded) {
      Alert.alert(
        "Remove Download",
        "Are you sure you want to remove this download?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Remove", 
            style: "destructive",
            onPress: async () => {
              await removeDownload(song);
            }
          }
        ]
      );
    } else {
      setIsDownloadingThis(true);
      try {
        await startDownload(song);
      } finally {
        setIsDownloadingThis(false);
      }
    }
  };
  
  const handleFavoriteToggle = () => {
    toggleFavorite(song.id);
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.container} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: song.coverUrl }}
            style={styles.cover}
            contentFit="cover"
            transition={200}
          />
          
          {isCurrentSong && (
            <View style={styles.playingIndicator}>
              {isPlaying ? (
                <Pause size={16} color="#000" />
              ) : (
                <Play size={16} color="#000" />
              )}
            </View>
          )}
        </View>
        
        <View style={styles.info}>
          <Text style={[
            styles.title, 
            isCurrentSong && styles.activeText
          ]} numberOfLines={1}>
            {song.title}
          </Text>
          
          {showArtist && (
            <Text style={styles.artist} numberOfLines={1}>{song.artist}</Text>
          )}
        </View>
        
        <View style={styles.actions}>
          {song.isDownloaded ? (
            <Check size={16} color={theme.colors.dark.primary} />
          ) : isDownloadingThis ? (
            <ActivityIndicator size="small" color={theme.colors.dark.primary} />
          ) : (
            <TouchableOpacity onPress={handleDownload}>
              <Download size={16} color={theme.colors.dark.subtext} />
            </TouchableOpacity>
          )}
          
          <Text style={styles.duration}>
            {formatDuration(song.duration)}
          </Text>
          
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={handleOptionsPress}
          >
            <MoreVertical size={20} color={theme.colors.dark.subtext} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleFavoriteToggle}
          >
            <Heart 
              size={20} 
              color={isFavorite ? theme.colors.dark.primary : theme.colors.dark.text} 
              fill={isFavorite ? theme.colors.dark.primary : 'transparent'}
            />
            <Text style={styles.optionText}>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleDownload}
          >
            {song.isDownloaded ? (
              <>
                <Trash2 size={20} color={theme.colors.dark.text} />
                <Text style={styles.optionText}>Remove Download</Text>
              </>
            ) : (
              <>
                <Download size={20} color={theme.colors.dark.text} />
                <Text style={styles.optionText}>Download</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  coverContainer: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  playingIndicator: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.dark.text,
    marginBottom: 2,
  },
  activeText: {
    color: theme.colors.dark.primary,
  },
  artist: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
    minWidth: 35,
    textAlign: 'right',
  },
  moreButton: {
    padding: 4,
  },
  optionsContainer: {
    backgroundColor: theme.colors.dark.card,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.dark.border,
  },
  optionText: {
    marginLeft: 12,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dark.text,
  },
});