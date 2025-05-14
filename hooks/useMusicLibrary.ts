import { useState, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';
import { Song } from '@/constants/mockData';
import { 
  initializeFileSystem, 
  scanDeviceForMusic, 
  getMetadata,
  updateMetadata
} from '@/services/fileService';
import { useLibraryStore } from '@/store/libraryStore';
import { enrichLocalSongMetadata } from '@/services/metadataService';

export const useMusicLibrary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const { setDownloadedSongs } = useLibraryStore();

  // Inizializza la libreria
  const initializeLibrary = async () => {
    setIsLoading(true);
    
    try {
      // Richiedi permessi
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        setHasPermission(false);
        Alert.alert(
          "Permesso richiesto",
          "MusicLite ha bisogno di accedere alla tua libreria multimediale per trovare e riprodurre la tua musica.",
          [{ text: "OK" }]
        );
        setIsLoading(false);
        return;
      }
      
      setHasPermission(true);
      
      // Inizializza il file system
      const initialized = await initializeFileSystem();
      
      if (!initialized) {
        Alert.alert(
          "Errore",
          "Impossibile inizializzare il file system dell'app. Alcune funzionalità potrebbero non funzionare correttamente.",
          [{ text: "OK" }]
        );
        setIsLoading(false);
        return;
      }
      
      // Carica prima i metadati (più veloce della scansione)
      const metadata = await getMetadata();
      
      if (metadata.songs && metadata.songs.length > 0) {
        setLocalSongs(metadata.songs);
        setDownloadedSongs(metadata.songs);
        
        if (metadata.lastScan) {
          setLastScanTime(new Date(metadata.lastScan));
        }
      }
      
      // Scansiona i file musicali (potrebbe richiedere tempo)
      await refreshLibrary(true);
      
    } catch (error) {
      console.error('Errore nell\'inizializzazione della libreria musicale:', error);
      Alert.alert(
        "Errore",
        "Si è verificato un errore durante l'inizializzazione della libreria musicale.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Scansiona per nuova musica
  const refreshLibrary = async (isFullScan = false) => {
    if (!hasPermission) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Se è una scansione completa o non abbiamo fatto scansioni prima
      if (isFullScan || !lastScanTime) {
        console.log("Esecuzione scansione completa...");
        const scannedSongs = await scanDeviceForMusic();
        
        if (scannedSongs.length > 0) {
          // Arricchisci i metadati delle canzoni trovate
          const enrichedSongs = await Promise.all(
            scannedSongs.map(async (song) => {
              try {
                return await enrichLocalSongMetadata(song);
              } catch (error) {
                console.error("Errore nell'arricchimento dei metadati:", error);
                return song;
              }
            })
          );
          
          setLocalSongs(enrichedSongs);
          setDownloadedSongs(enrichedSongs);
          
          // Aggiorna i metadati con le canzoni arricchite
          await updateMetadata({ 
            songs: enrichedSongs,
            lastScan: new Date().toISOString()
          });
          
          setLastScanTime(new Date());
        }
      } else {
        console.log("Esecuzione scansione incrementale...");
        // Implementa la logica per la scansione incrementale
        // Per ora, facciamo una scansione completa anche qui
        const scannedSongs = await scanDeviceForMusic();
        
        if (scannedSongs.length > 0) {
          // Confronta con le canzoni esistenti e aggiungi solo quelle nuove
          const existingIds = new Set(localSongs.map(song => song.id));
          const newSongs = scannedSongs.filter(song => !existingIds.has(song.id));
          
          if (newSongs.length > 0) {
            // Arricchisci i metadati delle nuove canzoni
            const enrichedNewSongs = await Promise.all(
              newSongs.map(async (song) => {
                try {
                  return await enrichLocalSongMetadata(song);
                } catch (error) {
                  console.error("Errore nell'arricchimento dei metadati:", error);
                  return song;
                }
              })
            );
            
            const updatedSongs = [...localSongs, ...enrichedNewSongs];
            setLocalSongs(updatedSongs);
            setDownloadedSongs(updatedSongs);
            
            // Aggiorna i metadati
            await updateMetadata({ 
              songs: updatedSongs,
              lastScan: new Date().toISOString()
            });
          }
          
          setLastScanTime(new Date());
        }
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento della libreria musicale:', error);
      Alert.alert(
        "Errore",
        "Si è verificato un errore durante l'aggiornamento della libreria musicale.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Inizializza all'avvio
  useEffect(() => {
    initializeLibrary();
    
    // Imposta un intervallo per la scansione automatica (ogni 24 ore)
    const scanInterval = setInterval(() => {
      if (lastScanTime) {
        const now = new Date();
        const hoursSinceLastScan = (now.getTime() - lastScanTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastScan >= 24) {
          refreshLibrary(false); // Scansione incrementale
        }
      }
    }, 1000 * 60 * 60); // Controlla ogni ora
    
    return () => clearInterval(scanInterval);
  }, [lastScanTime]);

  return {
    isLoading,
    hasPermission,
    localSongs,
    refreshLibrary,
    initializeLibrary,
    lastScanTime
  };
};
