import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song, Playlist, Artist, Genre } from '@/types';

interface LibraryStore {
  songs: Song[];
  playlists: Playlist[];
  genres: Genre[];
  artists: Artist[];
  recentlyPlayed: string[]; // song IDs
  favorites: string[]; // song IDs
  
  // Actions
  addSong: (song: Song) => void;
  removeSong: (songId: string) => void;
  updateSong: (songId: string, updates: Partial<Song>) => void;
  createPlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt'>) => string;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  addToRecentlyPlayed: (songId: string) => void;
  toggleFavorite: (songId: string) => void;
  getDownloadedSongs: () => Song[];
  getSongsByGenre: (genreId: string) => Song[];
  getSongsByArtist: (artistId: string) => Song[];
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      // Start with empty arrays
      songs: [],
      playlists: [],
      genres: [],
      artists: [],
      recentlyPlayed: [],
      favorites: [],
      
      addSong: (song) => set(state => {
        // Check if song already exists
        const exists = state.songs.some(s => s.id === song.id);
        if (exists) return state;
        
        // Add song
        const newSongs = [...state.songs, song];
        
        // Update genres
        let newGenres = [...state.genres];
        const genreExists = newGenres.some(g => g.name === song.genre);
        
        if (genreExists) {
          newGenres = newGenres.map(genre => 
            genre.name === song.genre 
              ? { ...genre, count: genre.count + 1 } 
              : genre
          );
        } else {
          newGenres.push({
            id: Date.now().toString(),
            name: song.genre,
            count: 1
          });
        }
        
        // Update artists
        let newArtists = [...state.artists];
        const artistExists = newArtists.some(a => a.name === song.artist);
        
        if (artistExists) {
          newArtists = newArtists.map(artist => 
            artist.name === song.artist 
              ? { ...artist, songCount: artist.songCount + 1 } 
              : artist
          );
        } else {
          newArtists.push({
            id: Date.now().toString(),
            name: song.artist,
            imageUrl: song.coverUrl,
            songCount: 1
          });
        }
        
        return {
          songs: newSongs,
          genres: newGenres,
          artists: newArtists
        };
      }),
      
      removeSong: (songId) => set(state => {
        const songToRemove = state.songs.find(song => song.id === songId);
        if (!songToRemove) return state;
        
        return {
          songs: state.songs.filter(song => song.id !== songId),
          recentlyPlayed: state.recentlyPlayed.filter(id => id !== songId),
          favorites: state.favorites.filter(id => id !== songId),
          playlists: state.playlists.map(playlist => ({
            ...playlist,
            songs: playlist.songs.filter(id => id !== songId)
          })),
          genres: state.genres.map(genre => 
            genre.name === songToRemove.genre 
              ? { ...genre, count: Math.max(0, genre.count - 1) } 
              : genre
          ),
          artists: state.artists.map(artist => 
            artist.name === songToRemove.artist 
              ? { ...artist, songCount: Math.max(0, artist.songCount - 1) } 
              : artist
          )
        };
      }),
      
      updateSong: (songId, updates) => set(state => ({
        songs: state.songs.map(song => 
          song.id === songId ? { ...song, ...updates } : song
        )
      })),
      
      createPlaylist: (playlistData) => {
        const id = Date.now().toString();
        const newPlaylist = {
          ...playlistData,
          id,
          songs: [],
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          playlists: [...state.playlists, newPlaylist]
        }));
        
        return id;
      },
      
      updatePlaylist: (playlistId, updates) => set(state => ({
        playlists: state.playlists.map(playlist => 
          playlist.id === playlistId 
            ? { 
                ...playlist, 
                ...updates, 
                updatedAt: new Date().toISOString() 
              } 
            : playlist
        )
      })),
      
      deletePlaylist: (playlistId) => set(state => ({
        playlists: state.playlists.filter(playlist => playlist.id !== playlistId)
      })),
      
      addSongToPlaylist: (playlistId, songId) => set(state => ({
        playlists: state.playlists.map(playlist => 
          playlist.id === playlistId && !playlist.songs.includes(songId)
            ? { 
                ...playlist, 
                songs: [...playlist.songs, songId],
                updatedAt: new Date().toISOString() 
              } 
            : playlist
        )
      })),
      
      removeSongFromPlaylist: (playlistId, songId) => set(state => ({
        playlists: state.playlists.map(playlist => 
          playlist.id === playlistId
            ? { 
                ...playlist, 
                songs: playlist.songs.filter(id => id !== songId),
                updatedAt: new Date().toISOString() 
              } 
            : playlist
        )
      })),
      
      addToRecentlyPlayed: (songId) => set(state => {
        // Remove the song if it's already in the list
        const filteredRecent = state.recentlyPlayed.filter(id => id !== songId);
        // Add it to the beginning (most recent)
        return {
          recentlyPlayed: [songId, ...filteredRecent].slice(0, 50) // Keep only the 50 most recent
        };
      }),
      
      toggleFavorite: (songId) => set(state => {
        if (state.favorites.includes(songId)) {
          return { favorites: state.favorites.filter(id => id !== songId) };
        } else {
          return { favorites: [...state.favorites, songId] };
        }
      }),
      
      getDownloadedSongs: () => {
        return get().songs.filter(song => song.isDownloaded);
      },
      
      getSongsByGenre: (genreId) => {
        const genre = get().genres.find(g => g.id === genreId);
        if (!genre) return [];
        
        return get().songs.filter(song => song.genre === genre.name);
      },
      
      getSongsByArtist: (artistId) => {
        const artist = get().artists.find(a => a.id === artistId);
        if (!artist) return [];
        
        return get().songs.filter(song => song.artist === artist.name);
      },
      
      clearLibrary: () => set({
        songs: [],
        playlists: [],
        genres: [],
        artists: [],
        recentlyPlayed: [],
        favorites: [],
      }),
    }),
    {
      name: 'music-library-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);