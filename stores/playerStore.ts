import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlaybackState, Song } from '@/types';

interface PlayerStore extends PlaybackState {
  miniPlayerVisible: boolean;
  fullPlayerVisible: boolean;
  currentSong: Song | null;
  
  // Actions
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (songId: string) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  showMiniPlayer: () => void;
  hideMiniPlayer: () => void;
  showFullPlayer: () => void;
  hideFullPlayer: () => void;
  updateCurrentTime: (time: number) => void;
  stopPlayback: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentSongId: null,
      currentSong: null,
      currentTime: 0,
      duration: 0,
      volume: 1,
      repeat: 'off',
      shuffle: false,
      queue: [],
      miniPlayerVisible: false,
      fullPlayerVisible: false,

      playSong: (song) => {
        set({
          currentSongId: song.id,
          currentSong: song,
          isPlaying: true,
          currentTime: 0,
          duration: song.duration,
          miniPlayerVisible: true,
          queue: [song.id],
        });
      },

      pauseSong: () => set({ isPlaying: false }),
      
      resumeSong: () => set({ isPlaying: true }),
      
      nextSong: () => {
        const { queue, currentSongId, shuffle } = get();
        if (queue.length === 0) return;
        
        const currentIndex = queue.findIndex(id => id === currentSongId);
        let nextIndex = currentIndex + 1;
        
        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
          // Ensure we don't play the same song again
          if (nextIndex === currentIndex && queue.length > 1) {
            nextIndex = (nextIndex + 1) % queue.length;
          }
        } else if (nextIndex >= queue.length) {
          // Loop back to the beginning if we're at the end
          nextIndex = 0;
        }
        
        set({ currentSongId: queue[nextIndex], currentTime: 0 });
      },
      
      previousSong: () => {
        const { queue, currentSongId, currentTime } = get();
        if (queue.length === 0) return;
        
        // If we're more than 3 seconds into the song, restart it instead of going to previous
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }
        
        const currentIndex = queue.findIndex(id => id === currentSongId);
        let prevIndex = currentIndex - 1;
        
        if (prevIndex < 0) {
          // Loop to the end if we're at the beginning
          prevIndex = queue.length - 1;
        }
        
        set({ currentSongId: queue[prevIndex], currentTime: 0 });
      },
      
      seekTo: (time) => set({ currentTime: time }),
      
      setVolume: (volume) => set({ volume }),
      
      toggleRepeat: () => {
        const { repeat } = get();
        const nextRepeat = repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off';
        set({ repeat: nextRepeat });
      },
      
      toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),
      
      addToQueue: (songId) => set(state => ({ queue: [...state.queue, songId] })),
      
      removeFromQueue: (songId) => set(state => ({
        queue: state.queue.filter(id => id !== songId)
      })),
      
      clearQueue: () => set({ queue: [] }),
      
      showMiniPlayer: () => set({ miniPlayerVisible: true }),
      
      hideMiniPlayer: () => set({ miniPlayerVisible: false }),
      
      showFullPlayer: () => set({ fullPlayerVisible: true }),
      
      hideFullPlayer: () => set({ fullPlayerVisible: false }),
      
      updateCurrentTime: (time) => set({ currentTime: time }),
      
      stopPlayback: () => set({
        isPlaying: false,
        currentSongId: null,
        currentSong: null,
        currentTime: 0,
        duration: 0,
        miniPlayerVisible: false,
        fullPlayerVisible: false,
        queue: [],
      }),
    }),
    {
      name: 'music-player-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        volume: state.volume,
        repeat: state.repeat,
        shuffle: state.shuffle,
      }),
    }
  )
);