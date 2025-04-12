import { db } from "@/db";
import { CommentReaction, comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {  and, count, desc, eq, getTableColumns, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
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
    .input(z.object({
        parentId: z.string().uuid().nullish(),
        videoId: z.string().uuid(),
        Value: z.string(),

    }))
    .mutation(async ({ctx,input})=>{
        const {parentId, videoId,Value} = input;
        const {id: userId} = ctx.user;

        const [existingComments] = await db
          .select()
          .from(comments)
          .where(inArray(comments.id, parentId? [String(parentId)]: []))

          if (!existingComments && parentId) {
            throw new TRPCError({ code: "NOT_FOUND" });
          }

          if(existingComments.parentId && parentId){
            throw new TRPCError({ code: "BAD_REQUEST"})
          }
        
        const [createdComments] = await db
        .insert(comments)
        .values({userId, videoId,parentId, values: Value})
        .returning();

        return createdComments;
    }),
    getMany: baseProcedure
    .input(
        z.object({
            parentId: z.string().uuid(),
            valueId: z.string().uuid(),
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt : z.date(),
            }).nullish(),
            limit: z.number().min(1).max(100),
        }),
    )
    .query(async ({input,ctx})=>{
        const {clerkUserId} = ctx;
        let userId;
        const {valueId,cursor,parentId, limit} = input;
        
        const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerk_Id, clerkUserId? [String(clerkUserId)] : []))

        if(user){
            userId = user.id
        }

        const ViewerReaction = db.$with("viewer_reactions").as(
            db.select({
                commentId: CommentReaction.commentId,
                type: CommentReaction.type,
            })
            .from(CommentReaction)
            .where(inArray(CommentReaction.userId , userId ? [userId] : []))
        )

        const replies = db.$with("replies").as(
            db.select({
                parentId : comments.parentId,
                count: count(comments.id).as("count")
            })
            .from(comments)
            .where(
                isNotNull(comments.parentId)
            )
            .groupBy(comments.parentId)
        )

        const [totalData, data]= await Promise.all([
            db
        .select({
            count:count(),
        })
        .from(comments)
        .where(and(
            eq(comments.videoId, valueId),
            isNull(comments.parentId),
        )),

      db
      .with(ViewerReaction, replies)
        .select({
            ...getTableColumns(comments),
            user : users,
            viewerReaction : ViewerReaction.type,
            replyCount: replies.count,
            likeCount : db.$count(CommentReaction,
                and(
                    eq(CommentReaction.type , "like"),
                    eq(CommentReaction.commentId, comments)
                )
            ),
            dislikeCount : db.$count(CommentReaction,
                and(
                    eq(CommentReaction.type , "dislike"),
                    eq(CommentReaction.commentId, comments)
                )
            ),
        })
        .from(comments)
        .where(and(
         eq(comments.videoId, valueId),
         parentId ? eq(comments.parentId, parentId) :  isNull(comments.parentId),
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
        .leftJoin(ViewerReaction, eq(comments.id, ViewerReaction.commentId))
        .leftJoin(replies, eq(comments.id, replies.parentId))
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