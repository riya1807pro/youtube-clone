import { categoryRouter } from "@/modules/categories/server/procedure";
import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedure";
import { VideoRouter } from "@/modules/videos/server/procedure";
// import { videos } from "@/db/schema";
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoryRouter,
  videos: VideoRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
