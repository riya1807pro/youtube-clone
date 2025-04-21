import { categoryRouter } from "@/modules/categories/server/procedure";
import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedure";
import { VideoRouter } from "@/modules/videos/server/procedure";
import { VideoViewsRouter } from "@/modules/video-views/server/procedure";
import { VideoReactionsRouter } from "@/modules/videoReaction/server/procedure";
import { SubscriptionRouter } from "@/modules/subscription/server/procedure";
import { commentsRouter } from "@/modules/commnets/server/procedure";
import { CommentReactionsRouter } from "@/modules/commentReaction/server/procedure";
import { SuggestionRouter } from "@/modules/suggestion/server/procedure";
import { SearchRouter } from "@/modules/search/server/procedure";
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  categories: categoryRouter,
  videos: VideoRouter,
  VideoViews:  VideoViewsRouter,
  VideoReaction : VideoReactionsRouter,
  subscriptions: SubscriptionRouter,
  comments: commentsRouter,
  search: SearchRouter,
  CommentReaction : CommentReactionsRouter,
  Suggestion: SuggestionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
