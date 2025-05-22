import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Download, Check, Trash2 } from 'lucide-react-native';
import { useDownload } from '@/hooks/useDownload';
import { Song } from '@/types';
import { theme } from '@/constants/theme';

interface DownloadButtonProps {
  song: Song;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  onComplete?: () => void;
}

export default function DownloadButton({ 
  song, 
  size = 'medium', 
  showText = true,
  onComplete
}: DownloadButtonProps) {
  const { isDownloading, progress, error, startDownload, removeDownload } = useDownload();
  
  const handlePress = async () => {
    if (song.isDownloaded) {
      const success = await removeDownload(song);
      if (success && onComplete) {
        onComplete();
      }
    } else {
      const success = await startDownload(song);
      if (success && onComplete) {
        onComplete();
      }
    }
  };
  
  // Determine icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      case 'medium':
      default: return 20;
    }
  };
  
  // Determine button size
  const getButtonSize = () => {
    switch (size) {
      case 'small': return { width: 32, height: 32 };
      case 'large': return { width: 48, height: 48 };
      case 'medium':
      default: return { width: 40, height: 40 };
    }
  };
  
  const iconSize = getIconSize();
  const buttonSize = getButtonSize();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonSize,
          song.isDownloaded ? styles.downloadedButton : styles.downloadButton
        ]}
        onPress={handlePress}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : song.isDownloaded ? (
          <Trash2 size={iconSize} color="#fff" />
        ) : (
          <Download size={iconSize} color="#fff" />
        )}
      </TouchableOpacity>
      
      {showText && (
        <Text style={styles.text}>
          {isDownloading 
            ? `${Math.round(progress)}%` 
            : song.isDownloaded 
              ? 'Remove' 
              : 'Download'}
        </Text>
      )}
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: theme.colors.dark.primary,
  },
  downloadedButton: {
    backgroundColor: theme.colors.dark.error,
  },
  text: {
    marginTop: 4,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.dark.text,
  },
  errorText: {
    marginTop: 4,
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.dark.error,
    textAlign: 'center',
  },
});