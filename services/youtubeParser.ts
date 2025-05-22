import { Song } from '@/types';

// Parse YouTube search results into our Song format
export const parseYouTubeResults = (items: any[], videoDetails: any[]): Song[] => {
  return items.map((item, index) => {
    const videoId = item.id.videoId;
    const details = videoDetails.find(detail => detail.id === videoId);
    
    // Extract duration in ISO 8601 format (PT1H2M3S) and convert to seconds
    let duration = 0;
    if (details?.contentDetails?.duration) {
      const match = details.contentDetails.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (match) {
        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        const seconds = parseInt(match[3] || '0', 10);
        duration = hours * 3600 + minutes * 60 + seconds;
      }
    }
    
    // Try to extract artist and title from video title
    const videoTitle = item.snippet.title;
    let artist = '';
    let title = videoTitle;
    
    // Common patterns: "Artist - Title", "Artist: Title", "Artist | Title"
    const separators = [' - ', ': ', ' | '];
    for (const separator of separators) {
      if (videoTitle.includes(separator)) {
        [artist, title] = videoTitle.split(separator, 2);
        break;
      }
    }
    
    // If no pattern matched, use channel name as artist
    if (!artist) {
      artist = item.snippet.channelTitle;
    }
    
    // Clean up title (remove things like "Official Video", "Lyrics", etc.)
    const cleanupPatterns = [
      /\(Official Video\)/i,
      /\(Official Music Video\)/i,
      /\(Official Audio\)/i,
      /\(Lyrics\)/i,
      /\[Lyrics\]/i,
      /\(Lyric Video\)/i,
      /\(Visualizer\)/i,
      /\(Audio\)/i,
      /\[Audio\]/i,
      /\(Official Visualizer\)/i,
      /\(Official Lyric Video\)/i,
      /\(HD\)/i,
      /\[HD\]/i,
      /\(HQ\)/i,
      /\[HQ\]/i,
      /\(4K\)/i,
      /\[4K\]/i,
    ];
    
    for (const pattern of cleanupPatterns) {
      title = title.replace(pattern, '').trim();
    }
    
    return {
      id: videoId,
      title: title,
      artist: artist,
      album: 'YouTube Music',
      duration: duration,
      coverUrl: item.snippet.thumbnails.high.url,
      genre: 'Unknown',
      playCount: 0,
      downloadUrl: null,
      isDownloaded: false,
      fileSize: 0,
      lastPlayed: '',
    };
  });
};

// Format duration for display (e.g. 3:45)
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export default {
  parseYouTubeResults,
  formatDuration,
  extractVideoId,
};