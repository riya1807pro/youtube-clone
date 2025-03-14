import { db } from "@/db";
import {z} from "zod"
import { videos } from "@/db/schema";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { eq ,or ,and, lt ,desc} from "drizzle-orm";

type id= {
    id : string| null
}

export const studioRouter =  createTRPCRouter({
    getMany : ProtectedProcedure
    .input(
        z.object({
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt: z.date()
            })
            .nullish(),
            limit: z.number().min(1).max(100)
        })
    )
    .query(async({ctx,input})=>{
        const { cursor, limit} = input;
        const userId = ctx.userId;
        if (!userId) {
            throw new Error("User ID is required");
        }
         const data = await db
        .select()
        .from(videos)
        .where(and(eq(videos.userId,userId),
    cursor
    ? or(
        lt(videos.updatedAt, cursor.updatedAt),
        and(
            eq(videos.updatedAt,cursor.updatedAt),
            lt(videos.id,cursor.id)
        )
    ):undefined
    )).orderBy(desc(videos.updatedAt,),desc(videos.id))
    .limit(limit+1)
//check if there is more data than limit
    const hasMore = data.length> limit;
    //remove the last items if more than limit
    const items = hasMore  ? data.slice(0,-1): data;
    // set next cursor to last item if there is more data
    const lastItem = items[items.length-1]
    const next_cursor = hasMore?
    {
        id: lastItem.id,
        updatedAt: lastItem.updatedAt,
    }:null

        return {
            items,
            next_cursor
        };
    })
})