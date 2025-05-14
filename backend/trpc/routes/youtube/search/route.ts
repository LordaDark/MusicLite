import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import ytdl from "ytdl-core";
import { searchYouTube } from "../../../services/youtube-service";

// Schema di input per la ricerca
const searchInputSchema = z.object({
  query: z.string().min(1),
});

export default publicProcedure
  .input(searchInputSchema)
  .query(async ({ input }) => {
    try {
      const results = await searchYouTube(input.query);
      return {
        items: results,
      };
    } catch (error) {
      console.error("Errore nella ricerca YouTube:", error);
      throw new Error("Errore nella ricerca YouTube");
    }
  });
