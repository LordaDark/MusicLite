import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ChevronDown, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePlayerStore } from '@/store/playerStore';
import { useLibraryStore } from '@/store/libraryStore';
import PlayerControls from '@/components/PlayerControls';
import { useTheme } from '@/hooks/useTheme';

export default function PlayerScreen() {
  const router = useRouter();
  const { currentSong, isPlaying, restorePlayer } = usePlayerStore();
  const { toggleLikeSong, isLiked } = useLibraryStore();
  const { colors } = useTheme();
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    if (currentSong) {
      setLiked(isLiked(currentSong.id));
      // Ensure the mini player is restored when navigating to the full player
      restorePlayer();
    }
  }, [currentSong, isLiked, restorePlayer]);
  
  const handleLike = () => {
    if (currentSong) {
      toggleLikeSong(currentSong.id);
      setLiked(!liked);
    }
  };
  
  if (!currentSong) {
    router.back();
    return null;
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', colors.background]}
        style={styles.gradient}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronDown size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Now Playing</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.albumContainer}>
        <Image
          source={{ uri: currentSong.coverArt }}
          style={styles.albumArt}
          contentFit="cover"
          transition={300}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <View>
            <Text style={[styles.songTitle, { color: colors.text }]}>{currentSong.title}</Text>
            <Text style={[styles.artistName, { color: colors.subtext }]}>{currentSong.artist}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={handleLike}
          >
            <Heart 
              size={24} 
              color={liked ? colors.primary : colors.text} 
              fill={liked ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        
        <PlayerControls />
        
        <View style={styles.additionalInfo}>
          <Text style={[styles.albumName, { color: colors.subtext }]}>
            Album: {currentSong.album}
          </Text>
          <Text style={[styles.genreText, { color: colors.subtext }]}>
            Genre: {currentSong.genre}
          </Text>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  albumContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  albumArt: {
    width: width - 80,
    height: width - 80,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 18,
    marginTop: 4,
  },
  likeButton: {
    padding: 8,
  },
  additionalInfo: {
    marginTop: 32,
  },
  albumName: {
    fontSize: 14,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 14,
  },
});
