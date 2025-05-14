import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { Song } from '@/constants/mockData';

// App directory structure
const APP_DIRECTORY = 'MusicLite';
const DOWNLOADS_DIRECTORY = 'Downloads';
const PLAYLISTS_DIRECTORY = 'Playlists';
const METADATA_FILE = 'metadata.json';

// Full paths
export const getAppDirectory = async (): Promise<string> => {
  // On Android, we can create a directory in the external storage
  // On iOS, we need to use the app's documents directory
  if (Platform.OS === 'ios') {
    return `${FileSystem.documentDirectory}${APP_DIRECTORY}`;
  } else {
    // Android
    return `${FileSystem.documentDirectory}${APP_DIRECTORY}`;
  }
};

export const getDownloadsDirectory = async (): Promise<string> => {
  const appDir = await getAppDirectory();
  return `${appDir}/${DOWNLOADS_DIRECTORY}`;
};

export const getPlaylistsDirectory = async (): Promise<string> => {
  const appDir = await getAppDirectory();
  return `${appDir}/${PLAYLISTS_DIRECTORY}`;
};

// Initialize app directories
export const initializeFileSystem = async (): Promise<boolean> => {
  try {
    // Request permissions first
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Media library permission not granted');
      return false;
    }

    // Create app directory
    const appDir = await getAppDirectory();
    const appDirInfo = await FileSystem.getInfoAsync(appDir);
    if (!appDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(appDir, { intermediates: true });
    }

    // Create downloads directory
    const downloadsDir = await getDownloadsDirectory();
    const downloadsDirInfo = await FileSystem.getInfoAsync(downloadsDir);
    if (!downloadsDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
    }

    // Create playlists directory
    const playlistsDir = await getPlaylistsDirectory();
    const playlistsDirInfo = await FileSystem.getInfoAsync(playlistsDir);
    if (!playlistsDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(playlistsDir, { intermediates: true });
    }

    // Initialize metadata file if it doesn't exist
    const metadataPath = `${appDir}/${METADATA_FILE}`;
    const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
    if (!metadataInfo.exists) {
      await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify({
        songs: [],
        playlists: [],
        lastScan: null
      }));
    }

    return true;
  } catch (error) {
    console.error('Error initializing file system:', error);
    return false;
  }
};

// Scan for music files in the device
export const scanDeviceForMusic = async (): Promise<Song[]> => {
  try {
    // Get all media from the device
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 1000, // Limit to 1000 files for performance
    });

    // Process each audio file
    const songs: Song[] = [];
    for (const asset of media.assets) {
      // Get full asset info
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
      
      // Create a song object
      const song: Song = {
        id: asset.id,
        title: asset.filename.replace(/\.[^/.]+$/, "") || 'Unknown Title',
        artist: assetInfo.albumId ? 'Unknown Artist' : 'Unknown Artist',
        album: assetInfo.albumId ? 'Unknown Album' : 'Unknown Album', // Using albumId to check if album info exists
        duration: asset.duration || 0,
        coverArt: asset.uri, // This might not be the actual cover art
        genre: 'Unknown',
        isDownloaded: true, // It's on the device, so it's "downloaded"
        uri: asset.uri
      };
      
      songs.push(song);
    }

    // Save the scanned songs to metadata
    await updateMetadata({ songs, lastScan: new Date().toISOString() });

    return songs;
  } catch (error) {
    console.error('Error scanning device for music:', error);
    return [];
  }
};

// Save a file to the downloads directory
export const saveFileToDownloads = async (fileUri: string, fileName: string): Promise<string | null> => {
  try {
    const downloadsDir = await getDownloadsDirectory();
    const destinationUri = `${downloadsDir}/${fileName}`;
    
    await FileSystem.copyAsync({
      from: fileUri,
      to: destinationUri
    });
    
    return destinationUri;
  } catch (error) {
    console.error('Error saving file to downloads:', error);
    return null;
  }
};

// Delete a file from the downloads directory
export const deleteFileFromDownloads = async (fileName: string): Promise<boolean> => {
  try {
    const downloadsDir = await getDownloadsDirectory();
    const fileUri = `${downloadsDir}/${fileName}`;
    
    await FileSystem.deleteAsync(fileUri);
    return true;
  } catch (error) {
    console.error('Error deleting file from downloads:', error);
    return false;
  }
};

// Get all downloaded files
export const getDownloadedFiles = async (): Promise<string[]> => {
  try {
    const downloadsDir = await getDownloadsDirectory();
    const files = await FileSystem.readDirectoryAsync(downloadsDir);
    return files;
  } catch (error) {
    console.error('Error getting downloaded files:', error);
    return [];
  }
};

// Metadata management
interface AppMetadata {
  songs?: Song[];
  playlists?: any[];
  lastScan?: string;
  [key: string]: any;
}

export const getMetadata = async (): Promise<AppMetadata> => {
  try {
    const appDir = await getAppDirectory();
    const metadataPath = `${appDir}/${METADATA_FILE}`;
    const metadataString = await FileSystem.readAsStringAsync(metadataPath);
    return JSON.parse(metadataString);
  } catch (error) {
    console.error('Error getting metadata:', error);
    return {};
  }
};

export const updateMetadata = async (newData: Partial<AppMetadata>): Promise<boolean> => {
  try {
    const appDir = await getAppDirectory();
    const metadataPath = `${appDir}/${METADATA_FILE}`;
    
    // Get current metadata
    const currentMetadata = await getMetadata();
    
    // Merge with new data
    const updatedMetadata = { ...currentMetadata, ...newData };
    
    // Write back to file
    await FileSystem.writeAsStringAsync(
      metadataPath, 
      JSON.stringify(updatedMetadata)
    );
    
    return true;
  } catch (error) {
    console.error('Error updating metadata:', error);
    return false;
  }
};

// Calculate storage usage
export const getStorageUsage = async (): Promise<{ total: number; used: number }> => {
  try {
    const downloadsDir = await getDownloadsDirectory();
    const downloadsDirInfo = await FileSystem.getInfoAsync(downloadsDir);
    
    // This only works on Android
    if (Platform.OS === 'android' && downloadsDirInfo.exists) {
      // Get all files in the downloads directory
      const files = await FileSystem.readDirectoryAsync(downloadsDir);
      
      // Calculate total size
      let totalSize = 0;
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${downloadsDir}/${file}`);
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
        }
      }
      
      return {
        total: downloadsDirInfo.size || 0,
        used: totalSize
      };
    }
    
    // Fallback for iOS or if the above fails
    return {
      total: 0,
      used: 0
    };
  } catch (error) {
    console.error('Error getting storage usage:', error);
    return {
      total: 0,
      used: 0
    };
  }
};
