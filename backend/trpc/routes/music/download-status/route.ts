import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export default publicProcedure
  .input(z.object({ 
    downloadId: z.string(),
  }))
  .query(async ({ input }) => {
    try {
      // In a real implementation, this would check the status of a download
      // For this demo, we'll simulate a completed download
      
      // Extract video ID from download ID
      const videoId = input.downloadId.split('_')[1];
      
      return {
        downloadId: input.downloadId,
        status: "completed",
        progress: 100,
        videoId,
        downloadUrl: `https://musiclite-backend.onrender.com/api/download/${input.downloadId}`,
      };
    } catch (error) {
      console.error('Download status check error:', error);
      throw new Error('Failed to check download status');
    }
  });