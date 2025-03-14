import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
export const VideoRouter = createTRPCRouter({
    create: ProtectedProcedure.mutation(async ({ ctx }) => {
      const userId = ctx.userId?.toString();

      const upload = await mux.video.uploads.create({
        new_asset_settings:{
          passthrough: userId,
          playback_policy: ["public"],
          input: [
            {
              generated_subtitles:[
                {
                  language_code: "en",
                  name:"English"
                }
              ]
            }
          ]
        },
        cors_origin:"*"
      })
  
      
      console.log("Upload:", upload); // Log the upload to see if it's correctly populated
      console.log("Upload URL:", upload.url); // Log the upload ID to see if it's correctly populated

      console.log("User ID:", userId); // Log the userId to see if it's correctly populated
      
      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated." });
      }
  
      try {
        const [video] = await db
          .insert(videos)
          .values({
            userId,
            muxStatus:"waiting",
            muxAssetId: upload.id,
            muxUploaderId: upload.id,
            muxPlaybackId: upload.id,
            muxTrackId: upload.id,
            muxTrackStatus: "waiting",
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
  