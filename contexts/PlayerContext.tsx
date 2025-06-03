import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { getVideoInfo, VideoInfo } from '../services/api';

interface Song extends VideoInfo {
  title: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isLoadingSong: boolean;
  playbackPosition: number | null; // in milliseconds
  playbackDuration: number | null; // in milliseconds
  playSong: (songIdOrUrl: string) => Promise<void>;
  togglePlayPause: () => void;
  seekPlayback: (positionMillis: number) => Promise<void>;
  playNext: () => void; // Placeholder
  playPrevious: () => void; // Placeholder
  isPlayerVisible: boolean;
  showFullScreenPlayer: boolean;
  openFullScreenPlayer: () => void;
  closeFullScreenPlayer: () => void;
  playRandomSong: () => Promise<void>; // Placeholder
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingSong, setIsLoadingSong] = useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = useState<number | null>(null);
  const [playbackDuration, setPlaybackDuration] = useState<number | null>(null);
  const [showFullScreenPlayer, setShowFullScreenPlayer] = useState<boolean>(false);
  
  const soundRef = useRef<Audio.Sound | null>(null);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPlaybackPosition(status.positionMillis || null);
      setPlaybackDuration(status.durationMillis || null);
      if (status.didJustFinish) {
        // Handle song finishing, e.g., play next or stop
        console.log('Song finished');
        // For now, just reset
        soundRef.current?.unloadAsync();
        setCurrentSong(null);
        setIsPlaying(false);
      }
    } else {
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
        setIsPlaying(false);
        // Potentially setCurrentSong(null) or show an error to the user
      }
    }
  };

  const playSong = async (songIdOrUrl: string) => {
    if (isLoadingSong) return;
    setIsLoadingSong(true);

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    try {
      // Assuming songIdOrUrl is a YouTube video URL or ID for now
      // If it's an ID, construct the URL: `https://www.youtube.com/watch?v=${songIdOrUrl}`
      const videoUrl = songIdOrUrl.startsWith('http') ? songIdOrUrl : `https://www.youtube.com/watch?v=${songIdOrUrl}`;
      const songInfo = await getVideoInfo(videoUrl);

      if (songInfo && songInfo.audio_url) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: songInfo.audio_url },
          { shouldPlay: true }, // Start playing immediately
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setCurrentSong(songInfo as Song);
        setIsPlaying(true);
      } else {
        console.error('Failed to get song info or audio URL');
        setCurrentSong(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing song:', error);
      setCurrentSong(null);
      setIsPlaying(false);
    } finally {
      setIsLoadingSong(false);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const seekPlayback = async (positionMillis: number) => {
    if (soundRef.current && playbackDuration && positionMillis <= playbackDuration) {
      await soundRef.current.setPositionAsync(positionMillis);
    }
  };

  // Placeholder functions
  const playNext = () => console.log('Play Next (not implemented)');
  const playPrevious = () => console.log('Play Previous (not implemented)');
  const playRandomSong = async () => {
    console.log('Play Random Song (not implemented)');
    // Example: play a predefined song
    // await playSong('dQw4w9WgXcQ'); // Rick Astley for testing random :)
  };

  const openFullScreenPlayer = () => setShowFullScreenPlayer(true);
  const closeFullScreenPlayer = () => setShowFullScreenPlayer(false);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const isPlayerVisible = !!currentSong || isLoadingSong;

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      isLoadingSong,
      playbackPosition,
      playbackDuration,
      playSong,
      togglePlayPause,
      seekPlayback,
      playNext,
      playPrevious,
      isPlayerVisible,
      showFullScreenPlayer,
      openFullScreenPlayer,
      closeFullScreenPlayer,
      playRandomSong
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};