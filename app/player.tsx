import PlayerControls from '@/components/PlayerControls';
import Colors from '@/constants/colors';
import { useLibraryStore } from '@/store/libraryStore';
import { usePlayerStore } from '@/store/playerStore';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronDown, Heart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PlayerScreen() {
  const router = useRouter();
  const { currentSong, isPlaying } = usePlayerStore();
  const { toggleLikeSong, isLiked } = useLibraryStore();
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    if (currentSong) {
      setLiked(isLiked(currentSong.id));
    }
  }, [currentSong, isLiked]);
  
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
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', Colors.dark.background]}
        style={styles.gradient}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronDown size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Now Playing</Text>
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
            <Text style={styles.songTitle}>{currentSong.title}</Text>
            <Text style={styles.artistName}>{currentSong.artist}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={handleLike}
          >
            <Heart 
              size={24} 
              color={liked ? Colors.dark.primary : Colors.dark.text} 
              fill={liked ? Colors.dark.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        
        <PlayerControls />
        
        <View style={styles.additionalInfo}>
          <Text style={styles.albumName}>
            Album: {currentSong.album}
          </Text>
          <Text style={styles.genreText}>
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
    backgroundColor: Colors.dark.background,
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
    color: Colors.dark.text,
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
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  artistName: {
    color: Colors.dark.subtext,
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
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 4,
  },
  genreText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
});
