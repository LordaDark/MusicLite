import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { Song } from '@/types';

export const useAudioPlayer = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    currentSongId, 
    currentSong,
    isPlaying, 
    currentTime,
    duration,
    volume,
    repeat,
    queue,
    updateCurrentTime,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
  } = usePlayerStore();
  
  const { addToRecentlyPlayed, updateSong } = useLibraryStore();
  const { recordPlay } = useAnalyticsStore();
  
  // Load and play a song
  const loadAndPlaySong = async (song: Song) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Determine source URL
      let sourceUri = '';
      
      if (Platform.OS !== 'web' && song.isDownloaded && song.filePath) {
        // Use local file if downloaded
        sourceUri = song.filePath;
      } else if (song.streamUrl) {
        // Use streaming URL
        sourceUri = song.streamUrl;
        
        // For web, we need to handle YouTube differently
        if (Platform.OS === 'web' && song.streamUrl.includes('youtube.com')) {
          console.log('Playing YouTube video on web:', song.title);
          
          // Create a dummy sound object for web YouTube playback
          const dummySound = new Audio.Sound();
          
          // Set up a timer to simulate playback progress
          const interval = setInterval(() => {
            if (currentTime < duration) {
              updateCurrentTime(currentTime + 1);
            } else {
              clearInterval(interval);
              nextSong();
            }
          }, 1000);
          
          // Add methods to control the dummy sound
          const enhancedDummySound = {
            ...dummySound,
            playAsync: async () => {
              console.log('Web YouTube playback: play');
              // Logic to control embedded YouTube player would go here
            },
            pauseAsync: async () => {
              console.log('Web YouTube playback: pause');
              // Logic to control embedded YouTube player would go here
            },
            stopAsync: async () => {
              console.log('Web YouTube playback: stop');
              clearInterval(interval);
            },
            unloadAsync: async () => {
              console.log('Web YouTube playback: unload');
              clearInterval(interval);
            },
            setPositionAsync: async (position: number) => {
              console.log('Web YouTube playback: seek to', position);
              updateCurrentTime(position / 1000);
            },
            setVolumeAsync: async (vol: number) => {
              console.log('Web YouTube playback: set volume', vol);
              // Logic to control embedded YouTube player would go here
            },
          };
          
          setSound(enhancedDummySound as unknown as Audio.Sound);
          setIsLoading(false);
          
          // Add to recently played
          addToRecentlyPlayed(song.id);
          
          // Record play in analytics
          recordPlay(song.id, song.artist, song.genre, song.duration);
          
          // Update play count
          updateSong(song.id, {
            ...song,
            playCount: song.playCount + 1,
            lastPlayed: new Date().toISOString(),
          });
          
          return;
        }
      } else {
        // Fallback to a placeholder audio for demo purposes
        setError('No playable source found for this song.');
        setIsLoading(false);
        return;
      }
      
      // Load the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: sourceUri },
        { shouldPlay: true, volume: volume },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      
      // Add to recently played
      addToRecentlyPlayed(song.id);
      
      // Record play in analytics
      recordPlay(song.id, song.artist, song.genre, song.duration);
      
      // Update play count
      updateSong(song.id, {
        ...song,
        playCount: song.playCount + 1,
        lastPlayed: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error loading sound:', err);
      setError('Could not play this song. Please try another.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle playback status updates
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    
    // Update current time
    if (status.positionMillis !== undefined) {
      updateCurrentTime(status.positionMillis / 1000);
    }
    
    // Handle playback completion
    if (status.didJustFinish) {
      if (repeat === 'one') {
        // Replay the same song
        sound?.replayAsync();
      } else {
        // Play next song
        nextSong();
      }
    }
  };
  
  // Effect to load song when currentSongId changes
  useEffect(() => {
    if (currentSong) {
      loadAndPlaySong(currentSong);
    }
  }, [currentSongId]);
  
  // Effect to handle play/pause
  useEffect(() => {
    if (!sound) return;
    
    if (isPlaying) {
      sound.playAsync().catch(err => {
        console.error('Error playing sound:', err);
        setError('Could not play this song. Please try another.');
      });
    } else {
      sound.pauseAsync().catch(err => {
        console.error('Error pausing sound:', err);
      });
    }
  }, [isPlaying, sound]);
  
  // Effect to handle volume changes
  useEffect(() => {
    if (!sound) return;
    
    sound.setVolumeAsync(volume).catch(err => {
      console.error('Error setting volume:', err);
    });
  }, [volume, sound]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(err => {
          console.error('Error unloading sound:', err);
        });
      }
    };
  }, [sound]);
  
  // Seek to a specific position
  const seekTo = async (seconds: number) => {
    if (!sound) return;
    
    try {
      await sound.setPositionAsync(seconds * 1000);
    } catch (err) {
      console.error('Error seeking:', err);
    }
  };
  
  return {
    isLoading,
    error,
    seekTo,
  };
};

export default useAudioPlayer;