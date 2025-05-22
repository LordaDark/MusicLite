import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import searchRoute from "./routes/music/search/route";
import downloadRoute from "./routes/music/download/route";
import downloadStatusRoute from "./routes/music/download-status/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  music: createTRPCRouter({
    search: searchRoute,
    download: downloadRoute,
    downloadStatus: downloadStatusRoute,
  }),
});

export type AppRouter = typeof appRouter;