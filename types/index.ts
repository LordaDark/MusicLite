export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  genre: string;
  playCount: number;
  downloadUrl: string | null;
  isDownloaded: boolean;
  filePath?: string; // local file path if downloaded
  fileSize?: number; // in bytes
  lastPlayed?: string; // ISO date string
  streamUrl?: string; // URL for streaming
  viewCount?: number; // YouTube view count
  publishedAt?: string; // Publication date
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  songs: string[]; // array of song IDs
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  songCount: number;
}

export interface Genre {
  id: string;
  name: string;
  count: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  downloadOverMobile: boolean;
  downloadQuality: 'low' | 'medium' | 'high';
  autoDownload: boolean;
  storageLimit: number; // in MB
}

export interface PlaybackState {
  isPlaying: boolean;
  currentSongId: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  queue: string[]; // array of song IDs
}

export interface AnalyticsData {
  listeningTime: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  topArtists: Array<{ name: string; count: number }>;
  topGenres: Array<{ name: string; count: number }>;
  downloads: {
    count: number;
    size: number; // in MB
  };
  activityByHour: number[]; // 24 hours
}