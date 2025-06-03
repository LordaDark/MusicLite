from flask import Flask, request, jsonify
import yt_dlp
import json
import os

app = Flask(__name__)

@app.route('/extract-info', methods=['GET'])
def extract_info():
    video_url = request.args.get('url')
    if not video_url:
        return jsonify({'error': 'Missing URL parameter'}), 400

    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'bestaudio/best',
        'noplaylist': True,
        'extract_flat': 'in_playlist', # Faster for playlists, gets basic info
        'cookiesfrombrowser': ('chrome',),
        # 'dump_single_json': True, # Use this if you want to parse the full JSON output
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_url, download=False)
            
            # Simplified info to return
            # You can customize this to return more or less data
            # For example, to get all formats: info_dict.get('formats')
            # To get specific audio format URL: next((f['url'] for f in info_dict.get('formats', []) if f.get('acodec') != 'none' and f.get('vcodec') == 'none'), None)
            
            relevant_info = {
                'id': info_dict.get('id'),
                'title': info_dict.get('title'),
                'thumbnail': info_dict.get('thumbnail'),
                'duration': info_dict.get('duration'),
                'uploader': info_dict.get('uploader'),
                'channel_url': info_dict.get('channel_url'),
                'view_count': info_dict.get('view_count'),
                # Attempt to find a direct audio stream URL
                # This might need refinement based on yt-dlp output for various sites
                'audio_url': info_dict.get('url') if info_dict.get('acodec') != 'none' else None 
            }

            # If 'audio_url' wasn't directly available at the top level, try finding it in formats
            if not relevant_info['audio_url'] and 'formats' in info_dict:
                for f in reversed(info_dict['formats']): # Prioritize better quality by reversing
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none' and f.get('url'):
                        relevant_info['audio_url'] = f['url']
                        relevant_info['format_id'] = f.get('format_id')
                        relevant_info['ext'] = f.get('ext')
                        relevant_info['abr'] = f.get('abr') # Audio Bitrate
                        break
            
            return jsonify(relevant_info)

    except yt_dlp.utils.DownloadError as e:
        app.logger.error(f"yt-dlp DownloadError: {e}")
        return jsonify({'error': 'Failed to extract video info', 'details': str(e)}), 500
    except Exception as e:
        app.logger.error(f"General error: {e}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

# Optional: /formats endpoint
@app.route('/formats', methods=['GET'])
def get_formats():
    video_url = request.args.get('url')
    if not video_url:
        return jsonify({'error': 'Missing URL parameter'}), 400

    ydl_opts = {
        'listformats': True,
        'noplaylist': True,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(video_url, download=False)
            formats = result.get('formats', [])
            return jsonify(formats)
    except Exception as e:
        return jsonify({'error': 'Failed to get formats', 'details': str(e)}), 500
@app.route('/extract-info-secure', methods=['POST'])
def extract_info_secure():
    data = request.get_json()
    video_url = data.get('url')
    cookies_content = data.get('cookies')  # Contenuto del cookies.txt

    if not video_url or not cookies_content:
        return jsonify({'error': 'Missing URL or cookies'}), 400

    # Salva temporaneamente i cookies in un file
    cookie_path = 'temp_cookies.txt'
    try:
        with open(cookie_path, 'w', encoding='utf-8') as f:
            f.write(cookies_content)

        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'format': 'bestaudio/best',
            'noplaylist': True,
            'cookiefile': cookie_path
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_url, download=False)

            relevant_info = {
                'id': info_dict.get('id'),
                'title': info_dict.get('title'),
                'thumbnail': info_dict.get('thumbnail'),
                'duration': info_dict.get('duration'),
                'uploader': info_dict.get('uploader'),
                'channel_url': info_dict.get('channel_url'),
                'view_count': info_dict.get('view_count'),
                'audio_url': info_dict.get('url') if info_dict.get('acodec') != 'none' else None
            }

            if not relevant_info['audio_url'] and 'formats' in info_dict:
                for f in reversed(info_dict['formats']):
                    if f.get('acodec') != 'none' and f.get('vcodec') == 'none' and f.get('url'):
                        relevant_info['audio_url'] = f['url']
                        relevant_info['format_id'] = f.get('format_id')
                        relevant_info['ext'] = f.get('ext')
                        relevant_info['abr'] = f.get('abr')
                        break

            return jsonify(relevant_info)
    except yt_dlp.utils.DownloadError as e:
        app.logger.error(f"yt-dlp DownloadError: {e}")
        return jsonify({'error': 'Failed to extract video info', 'details': str(e)}), 500
    except Exception as e:
        app.logger.error(f"General error: {e}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
    finally:
        if os.path.exists(cookie_path):
            os.remove(cookie_path)


if __name__ == '__main__':
    # For local development. Render will use a Gunicorn or similar WSGI server.
    app.run(debug=True, port=5000)