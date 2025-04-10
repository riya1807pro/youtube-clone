import { categoryRouter } from "@/modules/categories/server/procedure";
import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedure";
import { VideoRouter } from "@/modules/videos/server/procedure";
import { VideoViewsRouter } from "@/modules/video-views/server/procedure";
import { VideoReactionsRouter } from "@/modules/videoReaction/server/procedure";
import { SubscriptionRouter } from "@/modules/subscription/server/procedure";
import { commentsRouter } from "@/modules/commnets/server/procedure";
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoryRouter,
  videos: VideoRouter,
  VideoViews:  VideoViewsRouter,
  VideoReaction : VideoReactionsRouter,
  subscriptions: SubscriptionRouter,
  comments: commentsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
