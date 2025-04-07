import { db } from "@/db";
import { VideoViews } from "@/db/schema";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const VideoViewsRouter = createTRPCRouter({
    create: ProtectedProcedure
    .input(z.object({videoId: z.string().uuid()}))
    .mutation(async ({ctx,input})=>{
        const {videoId} = input;
        const {id: userId} = ctx.user;

        const [existingVideos] = await db
        .select()
        .from(VideoViews)
        .where(and(
            eq(VideoViews.videoId,videoId),
            eq(VideoViews.userId, userId),
        ))
        if(existingVideos){
            return existingVideos;
        }

        const [createdVideos] = await db
        .insert(VideoViews)
        .values({userId,videoId})
        .returning();

        return createdVideos;
    })
})