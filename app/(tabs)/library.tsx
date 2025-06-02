import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors'; // Import Colors
import { useColorScheme } from '@/hooks/useColorScheme'; // Import useColorScheme
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const currentColors = Colors[colorScheme];
  const paddingTop = Platform.OS === 'android' ? 25 : 0;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentColors.background }}>
      <ThemedView style={[styles.container, { paddingTop }]}>
      <ThemedText type="title">Library</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});