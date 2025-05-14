import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';
import { Song } from '@/constants/mockData';
import { saveFileToDownloads } from './fileService';

// Inizializza audio
export const initializeAudio = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      // Usa valori numerici direttamente poiché le costanti enum potrebbero essere cambiate
      interruptionModeIOS: 2, // Questo equivale a DUCK_OTHERS
      interruptionModeAndroid: 2, // Questo equivale a DUCK_OTHERS
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.error('Errore nell\'inizializzazione dell\'audio:', error);
  }
};

// Oggetto Sound per la riproduzione
let sound: Audio.Sound | null = null;

// Carica e riproduci una canzone
export const playSong = async (song: Song): Promise<boolean> => {
  try {
    // Scarica qualsiasi suono esistente
    if (sound) {
      await sound.unloadAsync();
    }
    
    // Crea un nuovo oggetto sound
    const { sound: newSound, status } = await Audio.Sound.createAsync(
      { uri: song.uri || '' },
      { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
    );
    
    sound = newSound;
    
    return true;
  } catch (error) {
    console.error('Errore nella riproduzione della canzone:', error);
    return false;
  }
};

// Metti in pausa la canzone corrente
export const pauseSong = async (): Promise<boolean> => {
  try {
    if (sound) {
      await sound.pauseAsync();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Errore nella pausa della canzone:', error);
    return false;
  }
};

// Riprendi la canzone corrente
export const resumeSong = async (): Promise<boolean> => {
  try {
    if (sound) {
      await sound.playAsync();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Errore nella ripresa della canzone:', error);
    return false;
  }
};

// Ferma la canzone corrente
export const stopSong = async (): Promise<boolean> => {
  try {
    if (sound) {
      await sound.stopAsync();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Errore nell\'arresto della canzone:', error);
    return false;
  }
};

// Vai a una posizione specifica
export const seekToPosition = async (position: number): Promise<boolean> => {
  try {
    if (sound) {
      await sound.setPositionAsync(position * 1000); // Converti in millisecondi
      return true;
    }
    return false;
  } catch (error) {
    console.error('Errore nel posizionamento:', error);
    return false;
  }
};

// Ottieni lo stato di riproduzione corrente
export const getPlaybackStatus = async (): Promise<AVPlaybackStatus | null> => {
  try {
    if (sound) {
      return await sound.getStatusAsync();
    }
    return null;
  } catch (error) {
    console.error('Errore nell\'ottenere lo stato di riproduzione:', error);
    return null;
  }
};

// Imposta un callback per gli aggiornamenti dello stato di riproduzione
export const setPlaybackStatusCallback = (
  callback: (status: AVPlaybackStatus) => void
): (() => void) => {
  if (sound) {
    sound.setOnPlaybackStatusUpdate(callback);
    return () => {
      if (sound) {
        sound.setOnPlaybackStatusUpdate(null);
      }
    };
  }
  
  return () => {};
};

// Pulisci le risorse
export const unloadSound = async (): Promise<void> => {
  try {
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }
  } catch (error) {
    console.error('Errore nello scaricamento del suono:', error);
  }
};

// Scarica una canzone
export const downloadSong = async (song: Song): Promise<Song | null> => {
  // In un'app reale, questo scaricherebbe da una fonte remota
  // Per ora, simuliamo copiando un file locale
  
  try {
    if (!song.uri) {
      console.error('URI della canzone mancante');
      return null;
    }
    
    // Genera un nome file
    const fileName = `${song.id}_${song.title.replace(/\s+/g, '_')}.mp3`;
    
    // Salva il file
    const savedUri = await saveFileToDownloads(song.uri, fileName);
    
    if (savedUri) {
      // Restituisci un oggetto canzone aggiornato con l'URI locale
      return {
        ...song,
        uri: savedUri,
        isDownloaded: true
      };
    }
    
    return null;
  } catch (error) {
    console.error('Errore nel download della canzone:', error);
    return null;
  }
};
