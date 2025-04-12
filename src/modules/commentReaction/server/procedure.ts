import { db } from "@/db";
import { CommentReaction } from "@/db/schema";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const CommentReactionsRouter = createTRPCRouter({
    like: ProtectedProcedure
    .input(z.object({commentId: z.string().uuid()}))
    .mutation(async ({ctx,input})=>{
        const {commentId} = input;
        const {id: userId} = ctx.user;

        const [existingCommentsReaction] = await db
        .select()
        .from(CommentReaction)
        .where(and(
            eq(CommentReaction.commentId,commentId),
            eq(CommentReaction.userId, userId),
            eq(CommentReaction.type, "like")
        ))
        if(existingCommentsReaction){
           const [deletedCommentReaction] = await db 
           .delete(CommentReaction)
           .where(and(
            eq(CommentReaction.userId, userId),
            eq(CommentReaction.commentId, commentId)
           ))
           .returning()
           return deletedCommentReaction;
        }

        const [createdCommentReactionLike] = await db
        .insert(CommentReaction)
        .values({userId,commentId,type: "like"})
        .onConflictDoUpdate({
            target: [CommentReaction.userId, CommentReaction.commentId],
            set:{
                type: "like"
            }
        })
        .returning();

        return createdCommentReactionLike;
    }),
    dislike: ProtectedProcedure
    .input(z.object({commentId: z.string().uuid()}))
    .mutation(async ({ctx,input})=>{
        const {commentId} = input;
        const {id: userId} = ctx.user;

        const [createdCommentsReactionDislike] = await db
        .select()
        .from(CommentReaction)
        .where(and(
            eq(CommentReaction.commentId,commentId),
            eq(CommentReaction.userId, userId),
            eq(CommentReaction.type, "dislike")
        ))
        if(createdCommentsReactionDislike){
           const [deletedCommentReaction] = await db 
           .delete(CommentReaction)
           .where(and(
            eq(CommentReaction.userId, userId),
            eq(CommentReaction.commentId, commentId)
           ))
           .returning()
           return deletedCommentReaction;
        }

        const [createdCommentReaction] = await db
        .insert(CommentReaction)
        .values({userId,commentId,type: "dislike"})
        .onConflictDoUpdate({
            target: [CommentReaction.userId, CommentReaction.commentId],
            set:{
                type: "dislike"
            }
        })
        .returning();

        return createdCommentReaction;
    })
})