import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { Song } from '@/types';
import { useLibraryStore } from '@/stores/libraryStore';
import { useAnalyticsStore } from '@/stores/analyticsStore';

// Directory for storing downloaded songs
const MUSIC_DIRECTORY = FileSystem.documentDirectory + 'music/';

// Ensure the music directory exists
export const ensureMusicDirectoryExists = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    console.log('File system operations not supported on web');
    return;
  }
  
  try {
    const dirInfo = await FileSystem.getInfoAsync(MUSIC_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(MUSIC_DIRECTORY, { intermediates: true });
    }
  } catch (error) {
    console.error('Error creating music directory:', error);
    throw error;
  }
};

// Download a song
export const downloadSong = async (song: Song): Promise<Song> => {
  if (Platform.OS === 'web') {
    console.log('Downloads not supported on web');
    throw new Error('Downloads not supported on web');
  }
  
  try {
    // Ensure directory exists
    await ensureMusicDirectoryExists();
    
    // Create file path
    const fileName = `${song.id}.mp3`;
    const filePath = MUSIC_DIRECTORY + fileName;
    
    // Check if file already exists
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      console.log('File already exists:', filePath);
      
      // Update song with download info
      const updatedSong: Song = {
        ...song,
        isDownloaded: true,
        filePath: filePath,
        fileSize: fileInfo.size || 0,
      };
      
      return updatedSong;
    }
    
    // For demonstration purposes, we'll download a placeholder MP3 file
    // In a real app, you would download the actual song from a server
    const placeholderUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    
    // Download the file with progress tracking
    const downloadResumable = FileSystem.createDownloadResumable(
      placeholderUrl,
      filePath,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Download progress: ${progress * 100}%`);
      }
    );
    
    const downloadResult = await downloadResumable.downloadAsync();
    
    if (!downloadResult) {
      throw new Error('Download failed');
    }
    
    // Get file info
    const updatedFileInfo = await FileSystem.getInfoAsync(filePath);
    
    // Update song with download info
    const updatedSong: Song = {
      ...song,
      isDownloaded: true,
      filePath: filePath,
      fileSize: updatedFileInfo.exists ? updatedFileInfo.size || 0 : 0,
    };
    
    // Record download in analytics
    const { recordDownload } = useAnalyticsStore.getState();
    recordDownload(updatedSong.fileSize || 0);
    
    return updatedSong;
  } catch (error) {
    console.error('Error downloading song:', error);
    throw error;
  }
};

// Delete a downloaded song
export const deleteSong = async (song: Song): Promise<void> => {
  if (Platform.OS === 'web' || !song.filePath) {
    console.log('Delete not supported on web or song not downloaded');
    return;
  }
  
  try {
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(song.filePath);
    
    if (fileInfo.exists) {
      // Delete the file
      await FileSystem.deleteAsync(song.filePath);
    }
  } catch (error) {
    console.error('Error deleting song:', error);
    throw error;
  }
};

// Get all downloaded songs
export const getDownloadedSongs = async (): Promise<string[]> => {
  if (Platform.OS === 'web') {
    console.log('File system operations not supported on web');
    return [];
  }
  
  try {
    await ensureMusicDirectoryExists();
    
    const files = await FileSystem.readDirectoryAsync(MUSIC_DIRECTORY);
    return files.filter(file => file.endsWith('.mp3')).map(file => file.replace('.mp3', ''));
  } catch (error) {
    console.error('Error getting downloaded songs:', error);
    return [];
  }
};

// Get total storage used by downloads
export const getTotalStorageUsed = async (): Promise<number> => {
  if (Platform.OS === 'web') {
    console.log('File system operations not supported on web');
    return 0;
  }
  
  try {
    await ensureMusicDirectoryExists();
    
    const files = await FileSystem.readDirectoryAsync(MUSIC_DIRECTORY);
    let totalSize = 0;
    
    for (const file of files) {
      if (file.endsWith('.mp3')) {
        const fileInfo = await FileSystem.getInfoAsync(MUSIC_DIRECTORY + file);
        if (fileInfo.exists && fileInfo.size !== undefined) {
          totalSize += fileInfo.size;
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating storage used:', error);
    return 0;
  }
};

export default {
  ensureMusicDirectoryExists,
  downloadSong,
  deleteSong,
  getDownloadedSongs,
  getTotalStorageUsed,
};