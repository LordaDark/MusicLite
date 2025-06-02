// TODO: Replace with your deployed backend URL or http://localhost:5000 for local testing
// const BACKEND_URL = 'YOUR_RENDER_BACKEND_URL_HERE';
const BACKEND_URL = 'http://127.0.0.1:5000'; // Default for local testing

export interface VideoInfo {
    id: string | null;
    title: string | null;
    thumbnail: string | null;
    duration: number | null;
    uploader: string | null;
    channel_url: string | null;
    view_count: number | null;
    audio_url: string | null;
    format_id?: string;
    ext?: string;
    abr?: number;
}

export interface BackendError {
    error: string;
    details?: string;
}

/**
 * Fetches video information and a direct audio stream URL from the backend.
 * @param videoUrl The URL of the video (e.g., YouTube, Soundcloud).
 * @returns A Promise that resolves to VideoInfo or null if an error occurs.
 */
export async function getVideoInfo(videoUrl: string): Promise<VideoInfo | null> {
    if (!videoUrl) {
        console.error('getVideoInfo: videoUrl is empty');
        return null;
    }
    try {
        const response = await fetch(`${BACKEND_URL}/extract-info?url=${encodeURIComponent(videoUrl)}`);
        
        if (!response.ok) {
            try {
                const errorData: BackendError = await response.json();
                console.error('Backend Error:', errorData.error, errorData.details || '');
            } catch (e) {
                console.error('Backend Error: Could not parse error response. Status:', response.status);
            }
            return null;
        }
        
        const data: VideoInfo = await response.json();
        
        if (data.audio_url) {
            return data;
        } else {
            console.warn('No direct audio_url found in backend response:', data);
            // Optionally, still return data if some info is useful even without audio_url
            // For now, returning null if no audio_url as it's critical for playback
            return null; 
        }
    } catch (error) {
        console.error('Network or other error fetching from backend:', error);
        return null;
    }
}

/**
 * Optional: Fetches available formats for a video from the backend.
 * @param videoUrl The URL of the video.
 * @returns A Promise that resolves to an array of format objects or null.
 */
export async function getVideoFormats(videoUrl: string): Promise<any[] | null> {
    if (!videoUrl) {
        console.error('getVideoFormats: videoUrl is empty');
        return null;
    }
    try {
        const response = await fetch(`${BACKEND_URL}/formats?url=${encodeURIComponent(videoUrl)}`);
        if (!response.ok) {
            try {
                const errorData: BackendError = await response.json();
                console.error('Backend Error (formats):', errorData.error, errorData.details || '');
            } catch (e) {
                console.error('Backend Error (formats): Could not parse error response. Status:', response.status);
            }
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Network or other error fetching formats from backend:', error);
        return null;
    }
}