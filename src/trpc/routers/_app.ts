<<<<<<< HEAD
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
=======
import { studioRouter } from "@/modules/studio/server/procedures";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { videoViewsRouter } from "@/modules/video-views/server/procedures";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedures";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedures";
import { commentsRouter } from "@/modules/comments/server/procedures";
import { commentReactionsRouter } from "@/modules/comment-reactions/server/procedures";
import { suggestionsRouter } from "@/modules/suggestions/server/procedures";
import { searchRouter } from "@/modules/search/server/procedures";
import { playlistsRouter } from "@/modules/playlists/server/procedures";
import { userRouter } from "@/modules/users/server/procedures";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionsRouter,
  search: searchRouter,
  playlists: playlistsRouter,
  users: userRouter,
>>>>>>> 9f21a4b (internal structure improvements)
});
// export type definition of API
export type AppRouter = typeof appRouter;
