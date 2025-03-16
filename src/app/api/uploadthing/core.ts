import { ThumbnailUploadModel } from "@/modules/studio/ui/components/thumbnail_Upload_model";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";
import {auth} from "@clerk/nextjs/server"
import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { metadata } from "@/app/layout";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); 


export const ourFileRouter = {
  ThumbnailUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })

  .input(z.object({
    videoId : z.string().uuid()
  }))
    .middleware(async ({ input}) => {

      const {userId: clerkUserId} = await auth();
      if (!clerkUserId) throw new UploadThingError("Unauthorized");

      const [user]  = await db
      .select()
      .from(users)
      .where(eq(users.clerk_Id, clerkUserId))

      if(!user) throw new UploadThingError("Unauthorized");

      const [existingVideos] = await db
      .select({
        thumbnailKey : videos.thumbnailKey,
      })
      .from(videos)
      .where(and(
        eq(videos.id , input.videoId),
        eq(videos.userId, user.id)
      ))

      if(!existingVideos){
        throw new UploadThingError("Not found");
      }

      if(existingVideos){
        const utapi = new UTApi();

        if (existingVideos.thumbnailKey) {
          await utapi.deleteFiles(existingVideos.thumbnailKey);
        }
        await db
        .update(videos)
        .set({
          thumbnailKey: null, thumbnailUrl: null,
        }) 
        .where(and(
          eq(videos.id , input.videoId),
          eq(videos.userId, user.id)
        ))
      }

      return { user , ...input};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
        .set({
          thumbnailUrl: file.url,
          thumbnailKey: file.key,
        })
      .where(
        and(
          eq(videos.id, metadata.videoId),
          eq(videos.userId, metadata.user.id as unknown as string)
        )
      );

      return {uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
