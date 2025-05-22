import { useState } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { Song } from '@/types';

export const useDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadResumable, setDownloadResumable] = useState<FileSystem.DownloadResumable | null>(null);
  
  const { addSong, updateSong } = useLibraryStore();
  const { downloadOverMobile, downloadQuality, storageLimit } = useSettingsStore();
  const { recordDownload } = useAnalyticsStore();
  
  // Start download
  const startDownload = async (song: Song): Promise<boolean> => {
    // Reset state
    setIsDownloading(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate download progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      
      // Simulate download completion after 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      clearInterval(interval);
      setProgress(100);
      
      // Update song in library
      const updatedSong = {
        ...song,
        isDownloaded: true,
        fileSize: 5 * 1024 * 1024, // 5MB
      };
      
      updateSong(song.id, updatedSong);
      
      // Record download in analytics
      recordDownload(updatedSong.fileSize || 0);
      
      return true;
    } catch (err) {
      console.error('Download error:', err);
      setError('An error occurred during download. Please try again.');
      return false;
    } finally {
      setIsDownloading(false);
      setDownloadResumable(null);
    }
  };
  
  // Cancel download
  const cancelDownload = async (): Promise<void> => {
    if (downloadResumable) {
      try {
        await downloadResumable.cancelAsync();
        setIsDownloading(false);
        setProgress(0);
        setDownloadResumable(null);
      } catch (err) {
        console.error('Error canceling download:', err);
      }
    }
  };
  
  // Delete downloaded song
  const removeDownload = async (song: Song): Promise<boolean> => {
    if (!song.isDownloaded) {
      return false;
    }
    
    try {
      // Simulate deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update song in library
      updateSong(song.id, {
        ...song,
        isDownloaded: false,
        filePath: undefined,
        fileSize: undefined,
      });
      
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      setError('An error occurred while deleting the song.');
      return false;
    }
  };
  
  return {
    isDownloading,
    progress,
    error,
    startDownload,
    cancelDownload,
    removeDownload,
  };
};

export default useDownload;