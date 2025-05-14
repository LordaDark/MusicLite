import { trpcClient } from "@/lib/trpc";
import { Song } from "@/constants/mockData";
import { Alert } from "react-native";

// Funzione per cercare i metadati di una canzone
export const searchSongMetadata = async (
  title: string,
  artist?: string
): Promise<Partial<Song> | null> => {
  try {
    // Costruisci la query di ricerca
    const query = artist ? `${title} ${artist}` : title;
    
    // Chiama il backend per cercare i metadati
    const result = await trpcClient.youtube.search.query({ query });
    
    if (result && result.items && result.items.length > 0) {
      const firstResult = result.items[0];
      
      // Estrai i metadati dal risultato
      return {
        title: firstResult.title || title,
        artist: firstResult.artist || artist || "Artista sconosciuto",
        coverArt: firstResult.thumbnail || "",
        album: firstResult.album || "Album sconosciuto",
        genre: firstResult.genre || "Genere sconosciuto",
      };
    }
    
    return null;
  } catch (error) {
    console.error("Errore nella ricerca dei metadati:", error);
    return null;
  }
};

// Funzione per arricchire i metadati di una canzone locale
export const enrichLocalSongMetadata = async (
  song: Song
): Promise<Song> => {
  try {
    // Cerca metadati aggiuntivi
    const metadata = await searchSongMetadata(song.title, song.artist);
    
    if (metadata) {
      // Aggiorna la canzone con i metadati trovati
      return {
        ...song,
        coverArt: metadata.coverArt || song.coverArt,
        artist: metadata.artist || song.artist,
        album: metadata.album || song.album,
        genre: metadata.genre || song.genre,
      };
    }
    
    return song;
  } catch (error) {
    console.error("Errore nell'arricchimento dei metadati:", error);
    return song;
  }
};

// Funzione per cercare canzoni su YouTube
export const searchYouTubeSongs = async (
  query: string
): Promise<Song[]> => {
  try {
    const result = await trpcClient.youtube.search.query({ query });
    
    if (!result || !result.items) {
      return [];
    }
    
    // Converti i risultati nel formato Song
    return result.items.map((item, index) => ({
      id: item.id || `yt-${index}`,
      title: item.title || "Titolo sconosciuto",
      artist: item.artist || "Artista sconosciuto",
      album: item.album || "Album sconosciuto",
      duration: item.duration || 0,
      coverArt: item.thumbnail || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
      genre: item.genre || "Genere sconosciuto",
      isDownloaded: false,
      uri: item.url,
    }));
  } catch (error) {
    console.error("Backend non disponibile o errore nella ricerca:", error);
    Alert.alert(
      "Errore di connessione",
      "Impossibile connettersi al server. Verifica la tua connessione internet e riprova."
    );
    return [];
  }
};

// Funzione per scaricare una canzone da YouTube
export const downloadYouTubeSong = async (
  videoId: string,
  title: string
): Promise<string | null> => {
  try {
    const result = await trpcClient.youtube.download.query({ videoId });
    
    if (result && result.downloadUrl) {
      return result.downloadUrl;
    }
    
    return null;
  } catch (error) {
    console.error("Errore nel download della canzone:", error);
    Alert.alert(
      "Errore di download",
      "Impossibile scaricare la canzone. Riprova più tardi."
    );
    return null;
  }
};
