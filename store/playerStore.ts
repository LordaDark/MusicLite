import { Song } from '@/constants/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  repeatMode: 'off' | 'all' | 'one';
  shuffleMode: boolean;
  progress: number;
  duration: number;
  
  // Actions
  setCurrentSong: (song: Song | null) => void;
  setQueue: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      queue: [],
      isPlaying: false,
      repeatMode: 'off',
      shuffleMode: false,
      progress: 0,
      duration: 0,
      
      setCurrentSong: (song) => set({ currentSong: song, progress: 0, duration: song?.duration || 0 }),
      
      setQueue: (songs) => set({ queue: songs }),
      
      addToQueue: (song) => set((state) => ({ 
        queue: [...state.queue, song] 
      })),
      
      removeFromQueue: (songId) => set((state) => ({ 
        queue: state.queue.filter(song => song.id !== songId) 
      })),
      
      playNext: () => {
        const { queue, currentSong, repeatMode } = get();
        
        if (queue.length === 0) {
          if (repeatMode === 'one') {
            // Just restart the current song
            set({ progress: 0 });
            return;
          } else if (repeatMode === 'all' && currentSong) {
            // Do nothing, we'll handle this in the component
            return;
          }
          
          // No more songs to play
          set({ isPlaying: false });
          return;
        }
        
        // Play the next song in queue
        const nextSong = queue[0];
        const newQueue = queue.slice(1);
        
        set({ 
          currentSong: nextSong, 
          queue: newQueue,
          progress: 0,
          duration: nextSong.duration,
          isPlaying: true
        });
      },
      
      playPrevious: () => {
        const { currentSong, progress } = get();
        
        // If we're more than 3 seconds into the song, restart it
        if (progress > 3) {
          set({ progress: 0 });
          return;
        }
        
        // Otherwise, we'd need history to go back
        // For now, just restart the current song
        set({ progress: 0 });
      },
      
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      
      setProgress: (progress) => set({ progress }),
      
      toggleShuffle: () => set((state) => ({ shuffleMode: !state.shuffleMode })),
      
      toggleRepeat: () => set((state) => {
        const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(state.repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        return { repeatMode: modes[nextIndex] };
      }),
      
      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
