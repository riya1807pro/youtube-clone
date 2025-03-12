import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
export const VideoRouter = createTRPCRouter({
    create: ProtectedProcedure.mutation(async ({ ctx }) => {
      const { userId } = ctx;
  
      console.log("User ID:", userId); // Log the userId to see if it's correctly populated
      
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated." });
      }
  
      try {
        const [video] = await db
          .insert(videos)
          .values({
            userId,
            title: "untitled",
          })
          .returning();
  
        return { video };
      } catch (error) {
        console.error("Error creating video:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "There was an error creating the video.",
        });
      }
    }),
  });
  