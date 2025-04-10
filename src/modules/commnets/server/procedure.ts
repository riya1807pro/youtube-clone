import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {  and, count, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
    remove : ProtectedProcedure
    .input(z.object({id: z.string().uuid(),
    }))
    .mutation(async ({ctx,input})=>{
        const {id} = input;
        const {id: userId} = ctx.user;

        const [deletedComments] = await db
        .delete(comments)
        .where(and(
            eq(comments.userId, userId),
            eq(comments.id, id)
        ))
        .returning();

        if(!deletedComments){
            throw new TRPCError({code: "NOT_FOUND"})
        }

        return deletedComments;
    }),

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
            valueId: z.string().uuid(),
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt : z.date(),
            }).nullish(),
            limit: z.number().min(1).max(100),
        }),
    )
    .query(async ({input})=>{
        const {valueId,cursor, limit} = input;
        const [totalData, data]= await Promise.all([
            db
        .select({
            count:count(),
        })
        .from(comments)
        .where(eq(comments.videoId, valueId)),

      db
        .select({
            ...getTableColumns(comments),
            user : users,
            totalCount : db.$count(comments,eq(comments.videoId, valueId))
        })
        .from(comments)
        .where(and(eq(comments.videoId, valueId),
    cursor
            ? or(
                lt(comments.updatedAt, cursor.updatedAt),
                and(
                  eq(comments.updatedAt, cursor.updatedAt),
                  lt(comments.id, cursor.id)
                )
              )
            : undefined
    ))
        .innerJoin(users, eq(comments.userId, users.id))
        .orderBy(desc(comments.updatedAt),desc(comments.id))
        .limit(limit +1)

        ])
     

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
            totalCount: totalData[0].count,
            items,
            nextCursor
        };
    })
})