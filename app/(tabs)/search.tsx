import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'; // Import axios for API calls
// import ytdl from 'react-native-ytdl'; // Replaced with backend API call
import { getVideoInfo, VideoInfo } from '@/app/services/api'; // Import the API service
// TODO: expo-av is deprecated, consider migrating to expo-audio / expo-video in SDK 54+
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder data
const personalizedSuggestions = ['Rock', 'Pop', 'Jazz', 'Elettronica', 'Classica', 'Hip Hop'];
const lastSearches = ['Queen', 'Beethoven sonatas', 'Lofi beats to study'];

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export default function SearchScreen() {
  const paddingTop = Platform.OS === 'android' ? 25 : 0;
  const colorScheme = useColorScheme() ?? 'light';
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null); // videoId of current playing song

  const currentColors = Colors[colorScheme];

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(YOUTUBE_API_URL, {
        params: {
          part: 'snippet',
          q: searchText,
          key: YOUTUBE_API_KEY,
          type: 'video',
          maxResults: 10,
        },
      });
      setSearchResults(response.data.items || []);
      // Add to last searches (simplified, consider more robust storage)
      if (!lastSearches.includes(searchText)) {
        lastSearches.unshift(searchText);
        if (lastSearches.length > 5) lastSearches.pop();
      }
    } catch (err) {
      console.error('Error fetching YouTube data:', err);
      setError('Impossibile recuperare i risultati della ricerca. Riprova.');
      setSearchResults([]);
    }
    setIsLoading(false);
  };

  async function playSong(videoId: string, title: string) {
    if (sound) {
      console.log('Unloading previous sound...');
      await sound.unloadAsync();
      setSound(null);
      setCurrentPlaying(null);
    }

    if (currentPlaying === videoId) { // If same song is tapped, stop it
      console.log('Stopping currently playing song');
      return;
    }

    console.log(`Attempting to play: ${title} (ID: ${videoId})`);
    Alert.alert("Caricamento audio", `Tentativo di caricare: ${title}`);
    setIsLoading(true); // Indicate loading when fetching from backend

    try {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const videoDetails: VideoInfo | null = await getVideoInfo(videoUrl);

      if (!videoDetails || !videoDetails.audio_url) {
        Alert.alert('Errore', 'Impossibile ottenere lo stream audio dal backend.');
        console.error('Failed to get audio stream from backend for video ID:', videoId, videoDetails);
        setIsLoading(false);
        return;
      }
      const audioStreamUrl = videoDetails.audio_url;

      console.log('Loading Sound from URL (via backend):', audioStreamUrl);
      // Update title if backend provides a more accurate one
      const displayTitle = videoDetails.title || title;
      Alert.alert("Caricamento audio", `Pronto per riprodurre: ${displayTitle}`);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true, // Important for background playback
        interruptionModeIOS: InterruptionModeIOS.DoNotMix, // Use imported enum
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix, // Use imported enum
        playThroughEarpieceAndroid: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioStreamUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentPlaying(videoId);
      console.log('Playback started');
      setIsLoading(false);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('Playback finished');
          newSound.unloadAsync();
          setSound(null);
          setCurrentPlaying(null);
        }
      });

    } catch (e: any) { // Catch any error type
      console.error('Error playing sound (after backend call): ', e);
      let errorMessage = 'Impossibile riprodurre la canzone selezionata.';
      // Note: AxiosError check might not be relevant here if getVideoInfo handles it
      if (e.message) {
        errorMessage = e.message;
      }
      Alert.alert('Errore di Riproduzione', errorMessage);
      if (sound) {
        sound.unloadAsync();
        setSound(null);
        setCurrentPlaying(null);
      }
      setIsLoading(false);
    }
  }

  // Effect to unload sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading sound on component unmount');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentColors.background }}>
      <ThemedView style={[styles.screenContainer, { paddingTop }]}>
      <View style={[styles.searchBarContainer, isFocused && { borderColor: currentColors.primary }]}>
        <MaterialIcons name="search" size={24} color={currentColors.icon} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: currentColors.text }]}
          placeholder="Canzoni, artisti, podcast..."
          placeholderTextColor={currentColors.icon} // Use a less prominent color for placeholder
          value={searchText}
          onSubmitEditing={handleSearch} // Trigger search on submit
          onChangeText={setSearchText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={currentColors.primary} // Cursor color
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialIcons name="clear" size={24} color={currentColors.icon} style={styles.clearIcon} />
          </TouchableOpacity>
        ) : (
          <MaterialIcons name="mic" size={24} color={currentColors.icon} style={styles.micIcon} />
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={currentColors.primary} style={styles.loader} />
      ) : error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.videoId}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.resultItem, currentPlaying === item.id.videoId && { backgroundColor: currentColors.tint }]} // Apply playingItem style inline
              onPress={() => playSong(item.id.videoId, item.snippet.title)} 
              accessibilityLabel={`Riproduci ${item.snippet.title}`}>
              <Image source={{ uri: item.snippet.thumbnails.default.url }} style={styles.resultThumbnail} />
              <View style={styles.resultInfo}>
                <ThemedText style={styles.resultTitle} numberOfLines={2}>{item.snippet.title}</ThemedText>
                <ThemedText style={styles.resultChannel}>{item.snippet.channelTitle}</ThemedText>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Suggerimenti per te</ThemedText>
        <View style={styles.chipContainer}>
          {personalizedSuggestions.map((suggestion, index) => (
            <TouchableOpacity key={`suggestion-${suggestion}-${index}`} style={[styles.chip, { backgroundColor: currentColors.secondary, borderColor: currentColors.secondary }]} onPress={() => { setSearchText(suggestion); handleSearch();}} accessibilityLabel={`Cerca ${suggestion}`}>
              <ThemedText style={[styles.chipText, { color: currentColors.background }]}>{suggestion}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Ultime ricerche</ThemedText>
        {/* Replaced FlatList with map to avoid VirtualizedList nesting error for small list */}
        {lastSearches.map((item, index) => (
            <TouchableOpacity key={`last-search-${item}-${index}`} style={styles.lastSearchItem} onPress={() => { setSearchText(item); handleSearch(); }} accessibilityLabel={`Cerca ${item}`}>
              <MaterialIcons name="history" size={20} color={currentColors.icon} style={styles.historyIcon}/>
              <ThemedText style={styles.lastSearchText}>{item}</ThemedText>
            </TouchableOpacity>
        ))}
      </ScrollView>
      )}
      {/* End of conditional rendering for search results/suggestions */}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    // paddingTop: 16, // Padding will be handled by SafeAreaView and conditional paddingTop
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25, // Rounded search bar
    borderWidth: 1.5,
    // borderColor will be set dynamically based on focus and theme
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40, // Ensure consistent height
  },
  clearIcon: {
    marginLeft: 8,
  },
  micIcon: {
    marginLeft: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
  },
  lastSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee', // Adjust with theme
  },
  historyIcon: {
    marginRight: 10,
  },
  lastSearchText: {
    fontSize: 16,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red', // Consider using theme color for errors
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee', // Adjust with theme
    alignItems: 'center',
  },
  resultThumbnail: {
    width: 80,
    height: 45, // 16:9 aspect ratio
    borderRadius: 4,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  resultChannel: {
    fontSize: 13,
    // color: '#666', // Adjust with theme
  },
  // playingItem style will be applied inline now
  // playingItem: {
  //   backgroundColor: Colors[colorScheme].tint, // Highlight currently playing item
  // },
});