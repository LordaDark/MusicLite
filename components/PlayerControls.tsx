import Colors from '@/constants/colors';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/utils/timeUtils';
import Slider from '@react-native-community/slider';
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PlayerControls: React.FC = () => {
  const { 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious, 
    progress, 
    duration, 
    setProgress,
    repeatMode,
    toggleRepeat,
    shuffleMode,
    toggleShuffle
  } = usePlayerStore();
  
  const [localProgress, setLocalProgress] = useState(0);
  
  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);
  
  const handleSliderChange = (value: number) => {
    setLocalProgress(value);
  };
  
  const handleSliderComplete = (value: number) => {
    setProgress(value);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>
          {formatDuration(localProgress)}
        </Text>
        
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={localProgress}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor={Colors.dark.primary}
          maximumTrackTintColor={Colors.dark.border}
          thumbTintColor={Colors.dark.primary}
        />
        
        <Text style={styles.timeText}>
          {formatDuration(duration)}
        </Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.shuffleButton} 
          onPress={toggleShuffle}
        >
          <Shuffle 
            color={shuffleMode ? Colors.dark.primary : Colors.dark.subtext} 
            size={20} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={playPrevious}
        >
          <SkipBack color={Colors.dark.text} size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={togglePlay}
        >
          {isPlaying ? (
            <Pause color={Colors.dark.background} size={28} />
          ) : (
            <Play color={Colors.dark.background} size={28} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={playNext}
        >
          <SkipForward color={Colors.dark.text} size={24} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.repeatButton} 
          onPress={toggleRepeat}
        >
          {repeatMode === 'one' ? (
            <Repeat1 color={Colors.dark.primary} size={20} />
          ) : (
            <Repeat 
              color={repeatMode === 'all' ? Colors.dark.primary : Colors.dark.subtext} 
              size={20} 
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  timeText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shuffleButton: {
    padding: 10,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatButton: {
    padding: 10,
  },
});

export default PlayerControls;
