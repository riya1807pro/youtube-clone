import { db } from "@/db";
import { users, videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { workflow } from "@/lib/workflow";
import { baseProcedure, createTRPCRouter, ProtectedProcedure } from "@/trpc/init";
// import { Uploads } from "@mux/mux-node/resources/video/uploads.mjs";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const VideoRouter = createTRPCRouter({
  getOne: baseProcedure
  .input(z.object({id: z.string().uuid()}))
  .query(async({ctx,input})=>{
    const [existingVideos]= await db
    .select({
      ...getTableColumns(videos),
      users: {
        ...getTableColumns(users),
      }
    })
    .from(videos)
    .innerJoin(users, eq(videos.userId,users.id))
    .where(eq(videos.id,input.id));

    if(!existingVideos){
      throw new TRPCError({code: "NOT_FOUND"})
    }
    return existingVideos;
  }),
  generateDescription:ProtectedProcedure
  .input(z.object({id: z.string().uuid()}))
    .mutation(async({ctx,input})=>{
      const {id: userId} = ctx.user
      
     const {workflowRunId} = await workflow.trigger({
      url: `${process.env.UPSTASH_WORKFLOW_URL!}/api/viddeos/workflows/discription`,
      body:{userId, videoId: input.id}
     })
     return workflowRunId;
  }),
  generateTitle:ProtectedProcedure
  .input(z.object({id: z.string().uuid()}))
    .mutation(async({ctx,input})=>{
      const {id: userId} = ctx.user
      
     const {workflowRunId} = await workflow.trigger({
      url: `${process.env.UPSTASH_WORKFLOW_URL!}/api/viddeos/workflows/title`,
      body:{userId, videoId: input.id}
     })
     return workflowRunId;
  }),
  generateThumbnail:ProtectedProcedure
  .input(z.object({id: z.string().uuid(),prompt: z.string().min(10)}))
    .mutation(async({ctx,input})=>{
      const {id: userId} = ctx.user
      
     const {workflowRunId} = await workflow.trigger({
      url: `${process.env.UPSTASH_WORKFLOW_URL!}/api/viddeos/workflows/thumbnail`,
      body:{userId, videoId: input.id,prompt: input.prompt}
     })
     return workflowRunId;
  }),
  restoreThumbnail: ProtectedProcedure.input(
    z.object({ id: z.string().uuid() })
  ).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated.",
      });
    }

    const [existingVideos] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

    if (!existingVideos) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    if (existingVideos.thumbnailKey) {
      const utapi = new UTApi();
      await utapi.deleteFiles(existingVideos.thumbnailKey);
      await db
        .update(videos)
        .set({
          thumbnailKey: null,
          thumbnailUrl: null,
        })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
    }

    if (!existingVideos.muxPlaybackId) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const utapi = new UTApi();
    const tempThumbnailUrl = `https://image.mux.com./${existingVideos.muxPlaybackId}/thumbnail.jpg`;
    const uploadeThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

    if (!uploadeThumbnail) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }

    if (
      !uploadeThumbnail ||
      !uploadeThumbnail.data ||
      !uploadeThumbnail.data.key ||
      !uploadeThumbnail.data.url
    ) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload thumbnail.",
      });
    }
    const { key: thumbnailKey, url: thumbnailUrl } = uploadeThumbnail.data;

    const updatedVideos = await db
      .update(videos)
      .set({ thumbnailUrl, thumbnailKey })
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
      .returning();
    return updatedVideos;
  }),
  remove: ProtectedProcedure.input(
    z.object({ id: z.string().uuid() })
  ).mutation(async ({ ctx, input }) => {
    const { id: userId } = ctx.user;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated.",
      });
    }
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated.",
      });
    }

    const [removedVideo] = await db
      .delete(videos)
      .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
      .returning();

    if (!removedVideo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return removedVideo;
  }),

  create: ProtectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    if (!userId) {
      console.error("No user found");
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User is not authenticated.",
      });
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

      return { video, uploadUrl: upload.url };
    } catch (error) {
      console.error("Error creating video:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "There was an error creating the video.",
      });
    }
  }),

  update: ProtectedProcedure.input(videoUpdateSchema).mutation(
    async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Video ID is required.",
        });
      }

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not authenticated.",
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found or user unauthorized.",
        });
      }

      return { video: videos };
    }
  ),
});
