import Colors from '@/constants/colors';
import { Song } from '@/constants/mockData';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/utils/timeUtils';
import { Image } from 'expo-image';
import { Check, Download, MoreVertical } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SongItemProps {
  song: Song;
  onPress?: () => void;
  showArtist?: boolean;
  showAlbum?: boolean;
  showDownload?: boolean;
}

const SongItem: React.FC<SongItemProps> = ({ 
  song, 
  onPress, 
  showArtist = true,
  showAlbum = false,
  showDownload = true
}) => {
  const { setCurrentSong, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { addDownloadedSong, downloadedSongs } = useLibraryStore();
  
  const isCurrentSong = currentSong?.id === song.id;
  const isDownloaded = downloadedSongs.some(s => s.id === song.id) || song.isDownloaded;
  
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    
    if (isCurrentSong) {
      togglePlay();
    } else {
      setCurrentSong(song);
    }
  };
  
  const handleDownload = () => {
    addDownloadedSong(song);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: song.coverArt }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      <View style={styles.infoContainer}>
        <Text 
          style={[
            styles.title, 
            isCurrentSong && styles.activeText
          ]} 
          numberOfLines={1}
        >
          {song.title}
        </Text>
        
        {showArtist && (
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist} {showAlbum ? `• ${song.album}` : ''}
          </Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {showDownload && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleDownload}
            disabled={isDownloaded}
          >
            {isDownloaded ? (
              <Check size={18} color={Colors.dark.primary} />
            ) : (
              <Download size={18} color={Colors.dark.subtext} />
            )}
          </TouchableOpacity>
        )}
        
        <Text style={styles.duration}>
          {formatDuration(song.duration)}
        </Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <MoreVertical size={18} color={Colors.dark.subtext} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.dark.background,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: Colors.dark.primary,
  },
  artist: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  duration: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginRight: 8,
  },
});

export default SongItem;
