import { db } from "@/db";
import { subscriptions, VideoViews } from "@/db/schema";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const SubscriptionRouter = createTRPCRouter({
    create: ProtectedProcedure
    .input(z.object({userId: z.string().uuid()}))
    .mutation(async ({ctx,input})=>{
        const {userId} = input;

        if(userId === ctx.user.id){
            throw  new TRPCError({code: "BAD_REQUEST"})
        }

        const [createSubscription] = await db 
        .insert(subscriptions)
        .values({viewerId: ctx.user.id , creatorId: userId})
        .returning()

        return createSubscription;
    }),
    remove: ProtectedProcedure
    .input(z.object({userId: z.string().uuid()}))
    .mutation(async ({ctx,input})=>{
        const {userId} = input;

        if(userId === ctx.user.id){
            throw  new TRPCError({code: "BAD_REQUEST"})
        }

        const [removeSubscription] = await db 
        .delete(subscriptions)
       .where(and(
        eq(subscriptions.viewerId, ctx.user.id),
        eq(subscriptions.creatorId, userId)
       ))
        .returning()

        return removeSubscription;
    })
})