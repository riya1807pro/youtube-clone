import { db } from "@/db";
import { z } from "zod";
import { users, VideoReaction, videos, VideoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { eq, or, and, lt, desc, getTableColumns } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// type id= {
//     id : string| null
// }

export const SuggestionRouter = createTRPCRouter({
  getMany: baseProcedure.input(
    z.object({
      videoId: z.string().uuid(),
      cursor: z
        .object({
          id: z.string().uuid(),
          updatedAt: z.date(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
    })
  ).query(async ({ input }) => {
    const {videoId,  cursor, limit } = input;

    const [existingVideos] = await db
    .select()
    .from(videos)
    .where(eq(videos.id, videoId))

    if(!existingVideos){
      throw new TRPCError({code: "NOT_FOUND"})
    }

    const data = await db
      .select({
        ...getTableColumns(videos),
        user :  users,
        viewCount : db.$count(VideoViews, eq(VideoViews.videoId, videos.id)),
        likeCount : db.$count(VideoReaction, and(
          eq(VideoReaction.videoId, videos.id),
          eq(VideoReaction.type, "like"),
        )),
        disLikeCount : db.$count(VideoReaction, and(
          eq(VideoReaction.videoId, videos.id),
          eq(VideoReaction.type, "dislike"),
        )),
      })
      .from(videos)
      .innerJoin(users, eq(videos.userId,  users.id))
      .where(
        and(
          existingVideos.categoryId
          ?(   
            eq(videos.categoryId, existingVideos.categoryId)
          )
          : undefined  ,
          cursor
            ? or(
                lt(videos.updatedAt, cursor.updatedAt),
                and(
                  eq(videos.updatedAt, cursor.updatedAt),
                  lt(videos.id, cursor.id)
                )
              )
            : undefined
        )
      )
      .orderBy(desc(videos.updatedAt), desc(videos.id))
      .limit(limit + 1);

    const hasMore = data.length > limit;
    // Remove the last item if there is more data
    const items = hasMore ? data.slice(0, -1) : data;
    // Set the next cursor to the last item if there is more data
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          updatedAt: lastItem.updatedAt,
        }
      : null;

    return {
      items,
      nextCursor,
    };
  }),
});
