import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Artist } from '@/types';
import { theme } from '@/constants/theme';

interface ArtistItemProps {
  artist: Artist;
}

export default function ArtistItem({ artist }: ArtistItemProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/artist/${artist.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      <Image
        source={{ uri: artist.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
      <Text style={styles.songCount}>{artist.songCount} songs</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.dark.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  songCount: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark.subtext,
    textAlign: 'center',
  },
});