import { db } from "@/db";
import { users, videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const VideoRouter = createTRPCRouter({
  remove:ProtectedProcedure
  .input(z.object({id: z.string().uuid()}))
  .mutation(async ({ctx,input})=>{
    const {id: userId} = ctx.userId;

    const [removedVideo] = await db
    .delete(videos)
    .where(and
 (     eq(videos.id,input.id),
      eq(videos.userId,userId))
    )
    .returning();

    if(!removedVideo){
      throw new TRPCError({code:"NOT_FOUND"})
    }
    return removedVideo;
  }),

  create: ProtectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId?.toString();
    
    if (!userId) {
      console.error("No user found");
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated." });
    }
    
    // Mux upload request
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*",
    });

    console.log("Upload:", upload); // Log the upload to see if it's correctly populated
    console.log("Upload URL:", upload.url); // Log the upload ID to see if it's correctly populated
    console.log("User ID:", userId); // Log the userId to see if it's correctly populated

    try {
      const [video] = await db
        .insert(videos)
        .values({
          userId,
          muxStatus: "waiting",
          muxAssetId: upload.id,
          muxUploaderId: upload.id,
          muxPlaybackId: upload.id,
          muxTrackId: upload.id,
          muxTrackStatus: "waiting",
          title: "untitled", // Default title, should be updated later
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

  update: ProtectedProcedure.input(videoUpdateSchema).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.userId;

    if (!input.id) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Video ID is required." });
    }

    const [updateVideo] = await db
      .update(videos)
      .set({
        title: input.title,
        discription: input.discription, // fixed typo from 'discription' to 'description'
        categoryId: input.categoryId,
        visibility: input.visibility,
      })
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
      .returning();

    if (!updateVideo) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found or user unauthorized." });
    }

    return { video: updateVideo };
  }),
});
