import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const paddingTop = Platform.OS === 'android' ? 25 : 0;
  const colorScheme = useColorScheme() ?? 'light';
  const [isWifiOnlyDownload, setIsWifiOnlyDownload] = useState(true);
  const [allowMobileData, setAllowMobileData] = useState(false);
  // For theme, we'd typically use the useColorScheme hook and a setter if we allow manual override
  // For simplicity, we'll just display the current theme and a placeholder for switching
  const [currentTheme, setCurrentTheme] = useState(colorScheme);

  const usedSpace = 6.7; // GB, placeholder
  const totalSpace = 15; // GB, placeholder
  const spacePercentage = (usedSpace / totalSpace) * 100;
  const appVersion = 'v1.0.0';

  const currentColors = Colors[colorScheme];

  const toggleWifiOnly = () => setIsWifiOnlyDownload(previousState => !previousState);
  const toggleMobileData = () => setAllowMobileData(previousState => !previousState);
  // const toggleTheme = () => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light'); // Placeholder

  const renderSectionHeader = (title: string) => (
    <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
  );

  const renderSettingItem = (title: string, value?: string, onPress?: () => void, control?: React.ReactNode) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.settingItem}>
      <ThemedText style={styles.settingText}>{title}</ThemedText>
      {value && <ThemedText style={styles.settingValue}>{value}</ThemedText>}
      {control}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentColors.background }}>
      <ThemedView style={[styles.screenContainer, { paddingTop }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderSectionHeader('Download')}
        {renderSettingItem(
          'Solo con Wi-Fi',
          undefined,
          toggleWifiOnly,
          <Switch
            trackColor={{ false: currentColors.icon, true: currentColors.primary }}
            thumbColor={isWifiOnlyDownload ? currentColors.background : currentColors.background}
            ios_backgroundColor={currentColors.icon}
            onValueChange={toggleWifiOnly}
            value={isWifiOnlyDownload}
            style={{ transform: Platform.OS === 'ios' ? [] : [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        )}
        {renderSettingItem(
          'Consenti dati mobili',
          undefined,
          toggleMobileData,
          <Switch
            trackColor={{ false: currentColors.icon, true: currentColors.primary }}
            thumbColor={allowMobileData ? currentColors.background : currentColors.background}
            ios_backgroundColor={currentColors.icon}
            onValueChange={toggleMobileData}
            value={allowMobileData}
            style={{ transform: Platform.OS === 'ios' ? [] : [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
          />
        )}

        {renderSectionHeader('Tema')}
        <View style={styles.themeSelectorContainer}>
          <TouchableOpacity 
            style={[styles.themeButton, currentTheme === 'light' && { backgroundColor: currentColors.primary, borderColor: currentColors.primary }]} 
            // onPress={() => setCurrentTheme('light')} // Add logic to change theme globally
          >
            <MaterialIcons name="wb-sunny" size={20} color={currentTheme === 'light' ? currentColors.background : currentColors.text} style={styles.themeIcon} />
            <ThemedText style={[styles.themeButtonText, currentTheme === 'light' && { color: currentColors.background }]}>Chiaro</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.themeButton, currentTheme === 'dark' && { backgroundColor: currentColors.primary, borderColor: currentColors.primary }]} 
            // onPress={() => setCurrentTheme('dark')} // Add logic to change theme globally
          >
            <MaterialIcons name="brightness-3" size={20} color={currentTheme === 'dark' ? currentColors.background : currentColors.text} style={styles.themeIcon} />
            <ThemedText style={[styles.themeButtonText, currentTheme === 'dark' && { color: currentColors.background }]}>Scuro</ThemedText>
          </TouchableOpacity>
        </View>

        {renderSectionHeader('Statistiche')}
        {renderSettingItem(
          'Spazio usato',
          `${usedSpace.toFixed(1)} GB di ${totalSpace} GB`,
          undefined,
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${spacePercentage}%`, backgroundColor: currentColors.primary }]} />
          </View>
        )}
         <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.primary }]} onPress={() => alert('Visualizza dati raccolti (funzionalità non implementata)')}>
          <ThemedText style={[styles.buttonText, { color: currentColors.background }]}>Visualizza dati raccolti</ThemedText>
        </TouchableOpacity>

        {renderSectionHeader('Info')}
        {renderSettingItem('Versione App', appVersion)}

      </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20, // Ensure space for last items
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    // color: '#666', // Adjust with theme
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    // textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#ccc', // Adjust with theme
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    // color: '#333', // Adjust with theme
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#ccc', // Adjust with theme
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    // borderColor: 'grey', // Adjust with theme
  },
  themeIcon: {
    marginRight: 8,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 8,
    flex: 1, // Take available space
    backgroundColor: '#e0e0e0', // Adjust with theme
    borderRadius: 4,
    marginLeft: 16, // Space from text
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  button: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});