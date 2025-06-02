# MusicLite Backend

This backend service provides an API to extract information from video URLs using `yt-dlp`.

## Features

- `/extract-info`: Retrieves video metadata (title, thumbnail, duration, uploader, etc.) and a direct audio stream URL.
- `/formats` (Optional): Lists all available formats for a given video URL.

## Setup and Running Locally

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    ```
    Activate it:
    -   Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    -   macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask application:**
    ```bash
    python app.py
    ```
    The server will start, typically on `http://127.0.0.1:5000`.

## API Endpoints

### `GET /extract-info`

Extracts information and audio stream URL for a video.

-   **Query Parameters:**
    -   `url` (string, required): The URL of the video (e.g., YouTube, Soundcloud).
-   **Success Response (200 OK):**
    ```json
    {
        "id": "VIDEO_ID",
        "title": "Video Title",
        "thumbnail": "URL_TO_THUMBNAIL",
        "duration": 180, // in seconds
        "uploader": "Channel Name",
        "channel_url": "URL_TO_CHANNEL",
        "view_count": 1000000,
        "audio_url": "DIRECT_AUDIO_STREAM_URL",
        "format_id": "specific_format_id_if_found_in_formats",
        "ext": "m4a", // or opus, mp3 etc.
        "abr": 128 // audio bitrate
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: If the `url` parameter is missing.
    -   `500 Internal Server Error`: If `yt-dlp` fails or an unexpected error occurs.

### `GET /formats` (Optional)

Lists all available download formats for a video.

-   **Query Parameters:**
    -   `url` (string, required): The URL of the video.
-   **Success Response (200 OK):**
    An array of format objects as provided by `yt-dlp`.
-   **Error Responses:**
    -   `400 Bad Request`: If the `url` parameter is missing.
    -   `500 Internal Server Error`: If an error occurs.

## Deployment (e.g., on Render)

1.  Push your `backend` folder (containing `app.py`, `requirements.txt`, and this `README.md`) to a Git repository (e.g., GitHub, GitLab).
2.  On Render (or a similar platform-as-a-service):
    -   Create a new Web Service.
    -   Connect your Git repository.
    -   Set the **Build Command** to: `pip install -r requirements.txt`
    -   Set the **Start Command** to: `gunicorn app:app` (Render typically uses Gunicorn for Python/Flask apps. You might need to add `gunicorn` to `requirements.txt` if it's not pre-installed in the Render environment, e.g., `gunicorn>=20.0`).
    -   Ensure the Python version selected on Render matches the one you developed with (or is compatible).
    -   Deploy the service.
3.  Once deployed, Render will provide you with a public URL for your backend API.

## Communicating from Frontend (React Native App)

In your React Native app (`search.tsx` or a dedicated API service file):

1.  **Define the backend URL:**
    ```typescript
    // Replace with your deployed backend URL or http://localhost:5000 for local testing
    const BACKEND_URL = 'YOUR_RENDER_BACKEND_URL_HERE'; 
    // const BACKEND_URL = 'http://localhost:5000'; // For local testing with backend running
    ```

2.  **Fetch data from `/extract-info`:**
    ```typescript
    async function getAudioStreamUrl(videoUrl: string): Promise<string | null> {
      try {
        const response = await fetch(`${BACKEND_URL}/extract-info?url=${encodeURIComponent(videoUrl)}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Backend Error:', errorData.error, errorData.details || '');
          // Handle specific errors or show a generic message
          return null;
        }
        const data = await response.json();
        if (data.audio_url) {
          return data.audio_url;
        } else {
          console.warn('No direct audio_url found in backend response:', data);
          return null;
        }
      } catch (error) {
        console.error('Network or other error fetching from backend:', error);
        return null;
      }
    }

    // Example usage in your playSong function:
    // const streamUrl = await getAudioStreamUrl(`https://www.youtube.com/watch?v=${videoId}`);
    // if (streamUrl) {
    //   // ... proceed to play with Expo AV ...
    // }
    ```