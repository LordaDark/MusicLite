import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import ytdl from "ytdl-core";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Schema di input per il download
const downloadInputSchema = z.object({
  videoId: z.string().min(1),
});

// Directory per i file temporanei
const TEMP_DIR = path.join(process.cwd(), "temp");

// Assicurati che la directory esista
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

export default publicProcedure
  .input(downloadInputSchema)
  .query(async ({ input }) => {
    try {
      const videoId = input.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      // Verifica che il video esista
      const info = await ytdl.getInfo(videoUrl);
      
      // Trova il formato audio con la migliore qualità
      const audioFormat = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
      
      if (!audioFormat) {
        throw new Error("Nessun formato audio disponibile");
      }
      
      // Genera un nome file univoco
      const fileName = `${uuidv4()}.mp3`;
      const filePath = path.join(TEMP_DIR, fileName);
      
      // Scarica il file
      const stream = ytdl(videoUrl, { format: audioFormat });
      const fileStream = fs.createWriteStream(filePath);
      
      // ✅ CORRETTO: funzione senza parametri
      await new Promise<void>((resolve, reject) => {
        stream.pipe(fileStream);
        fileStream.on("finish", () => resolve()); // ✅ fix qui
        fileStream.on("error", reject);
      });
      
      // Restituisci l'URL per il download
      return {
        downloadUrl: `/api/download/${fileName}`,
        title: info.videoDetails.title,
        artist: info.videoDetails.author.name,
        duration: parseInt(info.videoDetails.lengthSeconds),
      };
    } catch (error) {
      console.error("Errore nel download:", error);
      throw new Error("Errore nel download del video");
    }
  });
