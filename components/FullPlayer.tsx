import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  Modal,
  Pressable,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  ChevronDown, 
  Heart, 
  Download,
  Check,
  Share2,
  ListMusic
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useDownload } from '@/hooks/useDownload';
import { formatDuration } from '@/utils/formatters';
import { theme } from '@/constants/theme';
import { getRelatedVideos } from '@/services/api';
import { Song } from '@/types';

const { width, height } = Dimensions.get('window');

export default function FullPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    pauseSong, 
    resumeSong, 
    nextSong,
    previousSong,
    currentTime,
    duration,
    seekTo,
    repeat,
    shuffle,
    toggleRepeat,
    toggleShuffle,
    fullPlayerVisible,
    hideFullPlayer,
    queue,
    addToQueue
  } = usePlayerStore();

  const { favorites, toggleFavorite } = useLibraryStore();
  const { isDownloading, startDownload, removeDownload } = useDownload();

  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [relatedSongs, setRelatedSongs] = useState<Song[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  // Load related songs when current song changes
  useEffect(() => {
    if (currentSong && fullPlayerVisible) {
      loadRelatedSongs();
    }
  }, [currentSong?.id, fullPlayerVisible]);

  const loadRelatedSongs = async () => {
    if (!currentSong) return;
    
    setIsLoadingRelated(true);
    try {
      const related = await getRelatedVideos(currentSong.id, 10);
      setRelatedSongs(related);
    } catch (error) {
      console.error('Error loading related songs:', error);
      setRelatedSongs([]); // Set empty array on error
    } finally {
      setIsLoadingRelated(false);
    }
  };

  useEffect(() => {
    if (!isDragging && currentSong) {
      setSliderPosition(currentTime / (duration || 1));
    }
  }, [currentTime, duration, isDragging, currentSong]);

  if (!currentSong) return null;

  const isFavorite = favorites.includes(currentSong.id);

  const handlePlayPause = () => {
    isPlaying ? pauseSong() : resumeSong();
  };

  const handleClose = () => {
    hideFullPlayer();
    setShowQueue(false);
  };

  const handleSliderMove = (value: number) => {
    setIsDragging(true);
    setSliderPosition(value);
  };

  const handleSliderRelease = () => {
    setIsDragging(false);
    seekTo(sliderPosition * duration);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(currentSong.id);
  };

  const handleDownload = async () => {
    if (currentSong.isDownloaded) {
      await removeDownload(currentSong);
    } else {
      await startDownload(currentSong);
    }
  };

  const handleShare = () => {
    // In a real app, you would implement sharing functionality here
    console.log('Share song:', currentSong.title);
  };

  const handleAddToQueue = (song: Song) => {
    addToQueue(song.id);
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case 'one':
        return <Repeat1 size={24} color={theme.colors.dark.primary} />;
      case 'all':
        return <Repeat size={24} color={theme.colors.dark.primary} />;
      default:
        return <Repeat size={24} color={theme.colors.dark.subtext} />;
    }
  };

  return (
    <Modal
      visible={fullPlayerVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <LinearGradient
        colors={['#121212', '#1E1E1E']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <ChevronDown size={28} color={theme.colors.dark.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.queueButton}
            onPress={() => setShowQueue(!showQueue)}
          >
            <ListMusic size={24} color={theme.colors.dark.text} />
          </TouchableOpacity>
        </View>

        {!showQueue ? (
          <>
            <View style={styles.coverContainer}>
              <Image
                source={{ uri: currentSong.coverUrl }}
                style={styles.cover}
                contentFit="cover"
                transition={300}
              />
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {currentSong.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {currentSong.artist}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={handleFavoriteToggle}
              >
                <Heart 
                  size={24} 
                  color={isFavorite ? theme.colors.dark.primary : theme.colors.dark.subtext} 
                  fill={isFavorite ? theme.colors.dark.primary : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.progressContainer}>
              <Pressable 
                style={styles.progressBar}
                onPress={(e) => {
                  const { locationX } = e.nativeEvent;
                  const position = locationX / (width - 32);
                  seekTo(position * duration);
                }}
              >
                <View style={styles.progressBackground} />
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${sliderPosition * 100}%` }
                  ]} 
                />
                <View 
                  style={[
                    styles.progressThumb, 
                    { left: `${sliderPosition * 100}%` }
                  ]} 
                />
              </Pressable>
              
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatDuration(currentTime)}
                </Text>
                <Text style={styles.timeText}>
                  {formatDuration(duration)}
                </Text>
              </View>
            </View>

            <View style={styles.controlsContainer}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleShuffle}
              >
                <Shuffle 
                  size={24} 
                  color={shuffle ? theme.colors.dark.primary : theme.colors.dark.subtext} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={previousSong}
              >
                <SkipBack size={32} color={theme.colors.dark.text} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.playPauseButton}
                onPress={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause size={32} color="#000" />
                ) : (
                  <Play size={32} color="#000" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={nextSong}
              >
                <SkipForward size={32} color={theme.colors.dark.text} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleRepeat}
              >
                {getRepeatIcon()}
              </TouchableOpacity>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color={theme.colors.dark.primary} />
                ) : currentSong.isDownloaded ? (
                  <Check size={24} color={theme.colors.dark.primary} />
                ) : (
                  <Download size={24} color={theme.colors.dark.subtext} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={24} color={theme.colors.dark.subtext} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.queueContainer}>
            <Text style={styles.queueTitle}>Up Next</Text>
            
            {queue.length > 0 ? (
              <View style={styles.queueList}>
                {queue.map((songId, index) => {
                  const queueSong = useLibraryStore.getState().songs.find(s => s.id === songId);
                  if (!queueSong) return null;
                  
                  return (
                    <View key={songId} style={styles.queueItem}>
                      <Image
                        source={{ uri: queueSong.coverUrl }}
                        style={styles.queueItemCover}
                        contentFit="cover"
                      />
                      <View style={styles.queueItemInfo}>
                        <Text style={styles.queueItemTitle} numberOfLines={1}>
                          {queueSong.title}
                        </Text>
                        <Text style={styles.queueItemArtist} numberOfLines={1}>
                          {queueSong.artist}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.emptyQueueText}>No songs in queue</Text>
            )}
            
            <Text style={styles.relatedTitle}>Related Songs</Text>
            
            {isLoadingRelated ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.dark.primary} />
              </View>
            ) : relatedSongs.length > 0 ? (
              <View style={styles.relatedList}>
                {relatedSongs.map(song => (
                  <TouchableOpacity 
                    key={song.id} 
                    style={styles.relatedItem}
                    onPress={() => handleAddToQueue(song)}
                  >
                    <Image
                      source={{ uri: song.coverUrl }}
                      style={styles.relatedItemCover}
                      contentFit="cover"
                    />
                    <View style={styles.relatedItemInfo}>
                      <Text style={styles.relatedItemTitle} numberOfLines={1}>
                        {song.title}
                      </Text>
                      <Text style={styles.relatedItemArtist} numberOfLines={1}>
                        {song.artist}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.addToQueueButton}
                      onPress={() => handleAddToQueue(song)}
                    >
                      <Text style={styles.addToQueueText}>Add</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyRelatedText}>No related songs found</Text>
            )}
          </View>
        )}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 8,
  },
  queueButton: {
    padding: 8,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cover: {
    width: width - 80,
    height: width - 80,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.dark.text,
    marginBottom: 4,
  },
  artist: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dark.subtext,
  },
  favoriteButton: {
    padding: 8,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 20,
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    height: 4,
    backgroundColor: theme.colors.dark.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.dark.primary,
    marginLeft: -8,
    top: 2,
    transform: [{ translateY: -6 }],
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  controlButton: {
    padding: 12,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  actionButton: {
    padding: 12,
  },
  queueContainer: {
    flex: 1,
  },
  queueTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.dark.text,
    marginBottom: 16,
  },
  queueList: {
    marginBottom: 24,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  queueItemCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  queueItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  queueItemTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
    color: theme.colors.dark.text,
    marginBottom: 2,
  },
  queueItemArtist: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
  },
  emptyQueueText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
    color: theme.colors.dark.text,
    marginBottom: 16,
  },
  relatedList: {
    flex: 1,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  relatedItemCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  relatedItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  relatedItemTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
    color: theme.colors.dark.text,
    marginBottom: 2,
  },
  relatedItemArtist: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
  },
  addToQueueButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.dark.primary,
    borderRadius: theme.radius.md,
  },
  addToQueueText: {
    color: '#000',
    fontWeight: '500',
  },
  emptyRelatedText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.dark.subtext,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});