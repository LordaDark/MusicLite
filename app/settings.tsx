import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Moon, 
  Sun, 
  Wifi, 
  BarChart2, 
  HardDrive, 
  Info, 
  ChevronRight,
  Download,
  Trash2
} from 'lucide-react-native';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { formatFileSize } from '@/utils/formatters';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';
import { getTotalStorageUsed } from '@/services/downloadManager';
import { Platform } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    theme: appTheme, 
    setTheme,
    downloadOverMobile,
    setDownloadOverMobile,
    downloadQuality,
    setDownloadQuality,
    autoDownload,
    setAutoDownload,
    storageLimit,
    setStorageLimit,
    resetSettings
  } = useSettingsStore();
  
  const { getDownloadedSongs, clearLibrary } = useLibraryStore();
  const { clearAnalytics } = useAnalyticsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const downloadedSongs = getDownloadedSongs();
  const [totalDownloadSize, setTotalDownloadSize] = React.useState(0);
  
  // Get total download size
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      getTotalStorageUsed().then(size => {
        setTotalDownloadSize(size);
      }).catch(err => {
        console.error('Error getting total storage used:', err);
      });
    }
  }, [downloadedSongs.length]);
  
  const handleThemeToggle = () => {
    setTheme(appTheme === 'dark' ? 'light' : 'dark');
  };
  
  const handleViewAnalytics = () => {
    router.push('/analytics');
  };
  
  const handleQualityChange = (quality: 'low' | 'medium' | 'high') => {
    setDownloadQuality(quality);
  };
  
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your songs, playlists, and settings. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: () => {
            clearLibrary();
            clearAnalytics();
            resetSettings();
            Alert.alert("Data Cleared", "All your data has been cleared.");
          }
        }
      ]
    );
  };
  
  const handleStorageLimitChange = () => {
    Alert.alert(
      "Storage Limit",
      "Set the maximum storage space for downloaded songs (in MB)",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "500 MB",
          onPress: () => setStorageLimit(500)
        },
        {
          text: "1 GB",
          onPress: () => setStorageLimit(1024)
        },
        {
          text: "2 GB",
          onPress: () => setStorageLimit(2048)
        },
        {
          text: "5 GB",
          onPress: () => setStorageLimit(5120)
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Appearance
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              {appTheme === 'dark' ? (
                <Moon size={24} color={themeColors.text} style={styles.settingIcon} />
              ) : (
                <Sun size={24} color={themeColors.text} style={styles.settingIcon} />
              )}
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Dark Theme
              </Text>
            </View>
            <Switch
              value={appTheme === 'dark'}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#767577', true: themeColors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>
        
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Downloads
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Wifi size={24} color={themeColors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Download over mobile data
              </Text>
            </View>
            <Switch
              value={downloadOverMobile}
              onValueChange={setDownloadOverMobile}
              trackColor={{ false: '#767577', true: themeColors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Download size={24} color={themeColors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Auto-download liked songs
              </Text>
            </View>
            <Switch
              value={autoDownload}
              onValueChange={setAutoDownload}
              trackColor={{ false: '#767577', true: themeColors.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          <Text style={[styles.subsectionTitle, { color: themeColors.text }]}>
            Download Quality
          </Text>
          
          <View style={styles.qualityOptions}>
            <TouchableOpacity
              style={[
                styles.qualityOption,
                downloadQuality === 'low' && styles.selectedQuality,
                downloadQuality === 'low' && { borderColor: themeColors.primary }
              ]}
              onPress={() => handleQualityChange('low')}
            >
              <Text 
                style={[
                  styles.qualityLabel, 
                  { color: themeColors.text },
                  downloadQuality === 'low' && { color: themeColors.primary }
                ]}
              >
                Low
              </Text>
              <Text style={[styles.qualityDesc, { color: themeColors.subtext }]}>
                ~32 kbps
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.qualityOption,
                downloadQuality === 'medium' && styles.selectedQuality,
                downloadQuality === 'medium' && { borderColor: themeColors.primary }
              ]}
              onPress={() => handleQualityChange('medium')}
            >
              <Text 
                style={[
                  styles.qualityLabel, 
                  { color: themeColors.text },
                  downloadQuality === 'medium' && { color: themeColors.primary }
                ]}
              >
                Medium
              </Text>
              <Text style={[styles.qualityDesc, { color: themeColors.subtext }]}>
                ~128 kbps
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.qualityOption,
                downloadQuality === 'high' && styles.selectedQuality,
                downloadQuality === 'high' && { borderColor: themeColors.primary }
              ]}
              onPress={() => handleQualityChange('high')}
            >
              <Text 
                style={[
                  styles.qualityLabel, 
                  { color: themeColors.text },
                  downloadQuality === 'high' && { color: themeColors.primary }
                ]}
              >
                High
              </Text>
              <Text style={[styles.qualityDesc, { color: themeColors.subtext }]}>
                ~320 kbps
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.section, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Data & Storage
          </Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleViewAnalytics}
          >
            <View style={styles.settingInfo}>
              <BarChart2 size={24} color={themeColors.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Analytics & Usage Data
              </Text>
            </View>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleStorageLimitChange}
          >
            <View style={styles.settingInfo}>
              <HardDrive size={24} color={themeColors.text} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  Storage Limit
                </Text>
                <Text style={[styles.settingSubtext, { color: themeColors.subtext }]}>
                  {storageLimit} MB
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={themeColors.subtext} />
          </TouchableOpacity>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <HardDrive size={24} color={themeColors.text} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  Storage Used
                </Text>
                <Text style={[styles.settingSubtext, { color: themeColors.subtext }]}>
                  {formatFileSize(totalDownloadSize)} of {storageLimit} MB
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            About
          </Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Info size={24} color={themeColors.text} style={styles.settingIcon} />
              <View>
                <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                  MusicLite
                </Text>
                <Text style={[styles.settingSubtext, { color: themeColors.subtext }]}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: themeColors.error }]}
            onPress={resetSettings}
          >
            <Text style={styles.resetButtonText}>
              Reset All Settings
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.clearDataButton, { backgroundColor: themeColors.error }]}
            onPress={handleClearData}
          >
            <Trash2 size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.resetButtonText}>
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 80, // Space for mini player
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: theme.typography.fontSizes.sm,
    marginTop: 2,
  },
  qualityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qualityOption: {
    width: '30%',
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: 12,
    alignItems: 'center',
  },
  selectedQuality: {
    borderWidth: 2,
  },
  qualityLabel: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
    marginBottom: 4,
  },
  qualityDesc: {
    fontSize: theme.typography.fontSizes.xs,
  },
  resetButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  clearDataButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
});