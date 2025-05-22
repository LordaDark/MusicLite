import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsData } from '@/types';
import { mockAnalytics } from '@/constants/mockData';

interface AnalyticsStore {
  data: AnalyticsData;
  
  // Actions
  recordPlay: (songId: string, artist: string, genre: string, duration: number) => void;
  recordDownload: (size: number) => void;
  clearAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      data: mockAnalytics,
      
      recordPlay: (songId, artist, genre, duration) => {
        const hourOfDay = new Date().getHours();
        
        set(state => {
          // Update activity by hour
          const newActivityByHour = [...state.data.activityByHour];
          newActivityByHour[hourOfDay] += 1;
          
          // Update listening time (convert duration from seconds to hours)
          const durationInHours = duration / 3600;
          const newDaily = [...state.data.listeningTime.daily];
          newDaily[new Date().getDay()] += durationInHours;
          
          // Update top artists
          const topArtists = [...state.data.topArtists];
          const artistIndex = topArtists.findIndex(a => a.name === artist);
          if (artistIndex >= 0) {
            topArtists[artistIndex] = {
              ...topArtists[artistIndex],
              count: topArtists[artistIndex].count + 1
            };
          } else {
            topArtists.push({ name: artist, count: 1 });
          }
          // Sort by count in descending order
          topArtists.sort((a, b) => b.count - a.count);
          
          // Update top genres
          const topGenres = [...state.data.topGenres];
          const genreIndex = topGenres.findIndex(g => g.name === genre);
          if (genreIndex >= 0) {
            topGenres[genreIndex] = {
              ...topGenres[genreIndex],
              count: topGenres[genreIndex].count + 1
            };
          } else {
            topGenres.push({ name: genre, count: 1 });
          }
          // Sort by count in descending order
          topGenres.sort((a, b) => b.count - a.count);
          
          return {
            data: {
              ...state.data,
              listeningTime: {
                ...state.data.listeningTime,
                daily: newDaily,
              },
              topArtists: topArtists.slice(0, 10), // Keep top 10
              topGenres: topGenres.slice(0, 10), // Keep top 10
              activityByHour: newActivityByHour,
            }
          };
        });
      },
      
      recordDownload: (size) => set(state => ({
        data: {
          ...state.data,
          downloads: {
            count: state.data.downloads.count + 1,
            size: state.data.downloads.size + size,
          }
        }
      })),
      
      clearAnalytics: () => set({
        data: {
          listeningTime: {
            daily: [0, 0, 0, 0, 0, 0, 0],
            weekly: [0, 0, 0, 0],
            monthly: [0, 0, 0, 0, 0, 0],
          },
          topArtists: [],
          topGenres: [],
          downloads: {
            count: 0,
            size: 0,
          },
          activityByHour: Array(24).fill(0),
        }
      }),
    }),
    {
      name: 'music-analytics-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);