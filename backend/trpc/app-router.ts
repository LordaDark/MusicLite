import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import youtubeSearchRoute from "./routes/youtube/search/route";
import youtubeDownloadRoute from "./routes/youtube/download/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  youtube: createTRPCRouter({
    search: youtubeSearchRoute,
    download: youtubeDownloadRoute,
  }),
});

export type AppRouter = typeof appRouter;
