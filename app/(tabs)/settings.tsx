import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { ChevronRight, Wifi, Moon, Sun, Info, LogOut, Database, Trash2, BarChart2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore } from '@/store/themeStore';
import { getStorageUsage, initializeFileSystem } from '@/services/fileService';
import { formatBytes } from '@/utils/formatUtils';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { toggleTheme } = useThemeStore();
  const [downloadOnWifi, setDownloadOnWifi] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  
  // Carica l'utilizzo dello storage all'avvio
  useEffect(() => {
    loadStorageUsage();
  }, []);
  
  const loadStorageUsage = async () => {
    setIsLoading(true);
    try {
      // Inizializza prima il file system
      await initializeFileSystem();
      
      // Ottieni l'utilizzo dello storage
      const usage = await getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Errore nel caricamento dell\'utilizzo dello storage:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearCache = () => {
    Alert.alert(
      "Cancella cache",
      "Questo rimuoverà tutti i file temporanei. La tua musica scaricata non sarà influenzata.",
      [
        {
          text: "Annulla",
          style: "cancel"
        },
        {
          text: "Cancella",
          onPress: () => {
            // In un'app reale, questo cancellerebbe la cache
            Alert.alert("Cache cancellata", "Tutti i file temporanei sono stati rimossi.");
            loadStorageUsage();
          }
        }
      ]
    );
  };
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStorageUsage();
    setRefreshing(false);
  }, []);
  
  const handleViewAnalytics = () => {
    router.push('/analytics');
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Riproduzione</Text>
        
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingInfo}>
            <Wifi size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Scarica solo su Wi-Fi</Text>
          </View>
          <Switch
            value={downloadOnWifi}
            onValueChange={setDownloadOnWifi}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>
        
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingInfo}>
            <Wifi size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Modalità offline</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Display</Text>
        
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingInfo}>
            {isDark ? (
              <Moon size={20} color={colors.text} />
            ) : (
              <Sun size={20} color={colors.text} />
            )}
            <Text style={[styles.settingText, { color: colors.text }]}>Modalità scura</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Dati e analisi</Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleViewAnalytics}
        >
          <View style={styles.settingInfo}>
            <BarChart2 size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Visualizza analisi</Text>
          </View>
          <ChevronRight size={20} color={colors.subtext} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Storage</Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={loadStorageUsage}
        >
          <View style={styles.settingInfo}>
            <Database size={20} color={colors.text} />
            <View>
              <Text style={[styles.settingText, { color: colors.text }]}>Musica scaricata</Text>
              <Text style={[styles.settingSubtext, { color: colors.subtext }]}>
                {isLoading ? 'Caricamento...' : `${formatBytes(storageUsage.used)} utilizzati`}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.card }]}
          onPress={handleClearCache}
        >
          <View style={styles.settingInfo}>
            <Trash2 size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Cancella cache</Text>
          </View>
          <ChevronRight size={20} color={colors.subtext} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Informazioni</Text>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingInfo}>
            <Info size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Versione app</Text>
          </View>
          <Text style={[styles.versionText, { color: colors.subtext }]}>1.0.0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingInfo}>
            <Info size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Termini di servizio</Text>
          </View>
          <ChevronRight size={20} color={colors.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingInfo}>
            <Info size={20} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy policy</Text>
          </View>
          <ChevronRight size={20} color={colors.subtext} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card }]}>
        <LogOut size={20} color="#E53935" />
        <Text style={styles.logoutText}>Esci</Text>
      </TouchableOpacity>
      
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingSubtext: {
    fontSize: 12,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  logoutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
