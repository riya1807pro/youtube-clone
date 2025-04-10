import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import {  eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
    create: ProtectedProcedure
    .input(z.object({videoId: z.string().uuid(),
        Value: z.string(),
    }))
    .mutation(async ({ctx,input})=>{
        const {videoId,Value} = input;
        const {id: userId} = ctx.user;

        const [createdVideos] = await db
        .insert(comments)
        .values({userId, videoId, values: Value})
        .returning();

        return createdVideos;
    }),
    getMany: baseProcedure
    .input(
        z.object({
            valueId: z.string().uuid()
        }),
    )
    .query(async ({input})=>{
        const {valueId} = input;
        const data = await db
        .select({
            ...getTableColumns(comments),
            user : users
        })
        .from(comments)
        .where(eq(comments.videoId, valueId))
        .innerJoin(users, eq(comments.userId, users.id))
        return data;
    })
})