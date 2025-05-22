import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types';

interface SettingsStore extends AppSettings {
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setDownloadOverMobile: (allow: boolean) => void;
  setDownloadQuality: (quality: 'low' | 'medium' | 'high') => void;
  setAutoDownload: (auto: boolean) => void;
  setStorageLimit: (limit: number) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  downloadOverMobile: false,
  downloadQuality: 'medium',
  autoDownload: false,
  storageLimit: 1024, // 1GB default
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      setTheme: (theme) => set({ theme }),
      
      setDownloadOverMobile: (downloadOverMobile) => set({ downloadOverMobile }),
      
      setDownloadQuality: (downloadQuality) => set({ downloadQuality }),
      
      setAutoDownload: (autoDownload) => set({ autoDownload }),
      
      setStorageLimit: (storageLimit) => set({ storageLimit }),
      
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'music-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);