import Colors from '@/constants/colors';
import { usePlayerStore } from '@/store/playerStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pause, Play, SkipForward } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, playNext, progress, duration } = usePlayerStore();
  const router = useRouter();
  const [progressWidth, setProgressWidth] = useState(0);
  
  useEffect(() => {
    if (duration > 0) {
      setProgressWidth((progress / duration) * 100);
    } else {
      setProgressWidth(0);
    }
  }, [progress, duration]);
  
  if (!currentSong) {
    return null;
  }
  
  const handlePress = () => {
    router.push('/player');
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progressWidth}%` }
          ]} 
        />
      </View>
      
      <View style={styles.content}>
        <Image
          source={{ uri: currentSong.coverArt }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={togglePlay}
          >
            {isPlaying ? (
              <Pause color={Colors.dark.text} size={24} />
            ) : (
              <Play color={Colors.dark.text} size={24} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={playNext}
          >
            <SkipForward color={Colors.dark.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.dark.player,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  progressBar: {
    height: 2,
    backgroundColor: Colors.dark.border,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  artist: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
  },
});

export default MiniPlayer;
