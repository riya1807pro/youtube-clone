import { db } from "@/db";
import { VideoReaction } from "@/db/schema";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const VideoReactionsRouter = createTRPCRouter({
    like: ProtectedProcedure
    .input(z.object({videoId: z.string().uuid()}))
    .mutation(async ({ctx,input})=>{
        const {videoId} = input;
        const {id: userId} = ctx.user;

        const [existingVideosReaction] = await db
        .select()
        .from(VideoReaction)
        .where(and(
            eq(VideoReaction.videoId,videoId),
            eq(VideoReaction.userId, userId),
            eq(VideoReaction.type, "like")
        ))
        if(existingVideosReaction){
           const [deletedViewerReaction] = await db 
           .delete(VideoReaction)
           .where(and(
            eq(VideoReaction.userId, userId),
            eq(VideoReaction.videoId, videoId)
           ))
           .returning()
           return deletedViewerReaction;
        }

        const [createdVideosReactionLike] = await db
        .insert(VideoReaction)
        .values({userId,videoId,type: "like"})
        .onConflictDoUpdate({
            target: [VideoReaction.userId, VideoReaction.videoId],
            set:{
                type: "like"
            }
        })
        .returning();

        return createdVideosReactionLike;
    }),
    dislike: ProtectedProcedure
    .input(z.object({videoId: z.string().uuid()}))
    .mutation(async ({ctx,input})=>{
        const {videoId} = input;
        const {id: userId} = ctx.user;

        const [createdVideosReactionDislike] = await db
        .select()
        .from(VideoReaction)
        .where(and(
            eq(VideoReaction.videoId,videoId),
            eq(VideoReaction.userId, userId),
            eq(VideoReaction.type, "dislike")
        ))
        if(createdVideosReactionDislike){
           const [deletedViewerReaction] = await db 
           .delete(VideoReaction)
           .where(and(
            eq(VideoReaction.userId, userId),
            eq(VideoReaction.videoId, videoId)
           ))
           .returning()
           return deletedViewerReaction;
        }

        const [createdVideosReaction] = await db
        .insert(VideoReaction)
        .values({userId,videoId,type: "dislike"})
        .onConflictDoUpdate({
            target: [VideoReaction.userId, VideoReaction.videoId],
            set:{
                type: "dislike"
            }
        })
        .returning();

        return createdVideosReaction;
    })
})