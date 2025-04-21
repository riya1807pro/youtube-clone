import { db } from "@/db";
import { z } from "zod";
import { users, VideoReaction, videos, VideoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { eq, or, and, lt, desc, ilike, getTableColumns } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const SearchRouter = createTRPCRouter({
  getMany: baseProcedure.input(
    z.object({
      query: z.string().nullish(),
      categoryId: z.string().uuid().nullish(),
      cursor: z
        .object({
          id: z.string().uuid(),
          updatedAt: z.date(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
    })
  ).query(async ({ input }) => {
    const { cursor, limit, query, categoryId } = input;

    const data = await db
      .select({
        ...getTableColumns(videos),
        user: users,
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
      .innerJoin(users, eq(videos.userId, users.id))
      .where(
        and(
          ilike(videos.title, `%${query}%`), // Fix: used query inside template string
          categoryId ? eq(videos.categoryId, categoryId) : undefined,
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
