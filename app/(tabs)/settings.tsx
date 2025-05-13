import Colors from '@/constants/colors';
import { ChevronRight, Download, Info, LogOut, Moon, Sun, Wifi } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useState } from "react";

export default function SettingsScreen() {
  const [downloadOnWifi, setDownloadOnWifi] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playback</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Download size={20} color={Colors.dark.text} />
            <Text style={styles.settingText}>Download on Wi-Fi only</Text>
          </View>
          <Switch
            value={downloadOnWifi}
            onValueChange={setDownloadOnWifi}
            trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
            thumbColor={Colors.dark.text}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Wifi size={20} color={Colors.dark.text} />
            <Text style={styles.settingText}>Offline Mode</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
            thumbColor={Colors.dark.text}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            {darkMode ? (
              <Moon size={20} color={Colors.dark.text} />
            ) : (
              <Sun size={20} color={Colors.dark.text} />
            )}
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
            thumbColor={Colors.dark.text}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Download size={20} color={Colors.dark.text} />
            <View>
              <Text style={styles.settingText}>Downloaded Music</Text>
              <Text style={styles.settingSubtext}>120 MB used</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.dark.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Download size={20} color={Colors.dark.text} />
            <Text style={styles.settingText}>Clear Cache</Text>
          </View>
          <ChevronRight size={20} color={Colors.dark.subtext} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Info size={20} color={Colors.dark.text} />
            <Text style={styles.settingText}>App Version</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Info size={20} color={Colors.dark.text} />
            <Text style={styles.settingText}>Terms of Service</Text>
          </View>
          <ChevronRight size={20} color={Colors.dark.subtext} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Info size={20} color={Colors.dark.text} />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </View>
          <ChevronRight size={20} color={Colors.dark.subtext} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color="#E53935" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.dark.primary,
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
    backgroundColor: Colors.dark.card,
    marginBottom: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: Colors.dark.text,
    fontSize: 16,
    marginLeft: 12,
  },
  settingSubtext: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginLeft: 12,
  },
  versionText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.dark.card,
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
