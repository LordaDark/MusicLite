import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import axios from "axios";

// Google API Key
const GOOGLE_API_KEY = 'AIzaSyDJEMQDBr3qo-c26SixXIs7jGYnkh2eFj4';

// YouTube API client
const youtubeClient = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
  params: {
    key: GOOGLE_API_KEY,
  },
});

export default publicProcedure
  .input(z.object({ 
    query: z.string(),
    maxResults: z.number().default(20)
  }))
  .query(async ({ input }) => {
    try {
      // Search for videos
      const searchResponse = await youtubeClient.get('/search', {
        params: {
          part: 'snippet',
          maxResults: input.maxResults,
          q: input.query + ' music',
          type: 'video',
          videoCategoryId: '10', // Music category
        },
      });
      
      const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId);
      
      // Get video details
      const detailsResponse = await youtubeClient.get('/videos', {
        params: {
          part: 'contentDetails,statistics,snippet',
          id: videoIds.join(','),
        },
      });
      
      // Combine search results with video details
      const results = searchResponse.data.items.map((item: any) => {
        const videoId = item.id.videoId;
        const details = detailsResponse.data.items.find((detail: any) => detail.id === videoId);
        
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
        };
      });
      
      return {
        results,
        totalResults: searchResponse.data.pageInfo.totalResults,
      };
    } catch (error) {
      console.error('YouTube search error:', error);
      throw new Error('Failed to search YouTube');
    }
  });