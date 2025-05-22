import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Genre } from '@/types';
import { theme } from '@/constants/theme';

interface GenreItemProps {
  genre: Genre;
}

// Generate a random pastel color based on the genre name
const getGenreColor = (genreName: string) => {
  // Simple hash function to generate a consistent color for each genre name
  let hash = 0;
  for (let i = 0; i < genreName.length; i++) {
    hash = genreName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate pastel colors (lighter shades)
  const h = hash % 360;
  const s = 60 + (hash % 20); // 60-80% saturation
  const l = 65 + (hash % 15); // 65-80% lightness
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default function GenreItem({ genre }: GenreItemProps) {
  const router = useRouter();
  const backgroundColor = getGenreColor(genre.name);
  
  const handlePress = () => {
    router.push(`/genre/${genre.id}`);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]}
      onPress={handlePress}
    >
      <Text style={styles.name}>{genre.name}</Text>
      <Text style={styles.count}>{genre.count} songs</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 100,
    borderRadius: theme.radius.md,
    padding: 16,
    justifyContent: 'space-between',
    marginRight: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    color: '#000',
  },
  count: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.7)',
  },
});