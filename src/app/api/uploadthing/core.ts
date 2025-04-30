<<<<<<< HEAD
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
=======
import { auth } from "@clerk/nextjs/server";
import { UploadThingError, UTApi } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  bannerUploader: f({
    image: {
>>>>>>> 9f21a4b (internal structure improvements)
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
<<<<<<< HEAD

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

      // if(!existingVideos){
      //   throw new UploadThingError("Not found");
      // }

      // if(existingVideos){
      //   const utapi = new UTApi();

      //   if (existingVideos.thumbnailKey) {
      //     await utapi.deleteFiles(existingVideos.thumbnailKey);
      //   }
      //   await db
      //   .update(videos)
      //    .set({
      //     thumbnailKey: null, thumbnailUrl: null,
      //    }) 
      //   .where(and(
      //     eq(videos.id , input.videoId),
      //     eq(videos.userId, user.id)
      //   ))
      // }

      return { user , ...input};
=======
    .middleware(async () => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) throw new UploadThingError("Unauthorized");

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));
      if (!existingUser) throw new UploadThingError("Unauthorized");

      if (existingUser.bannerKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingUser.bannerKey);
        await db
          .update(users)
          .set({ bannerKey: null, bannerUrl: null })
          .where(eq(users.id, existingUser.id));
      }

      return { userId: existingUser.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(users)
        .set({ bannerUrl: file.ufsUrl, bannerKey: file.key })
        .where(eq(users.id, metadata.userId));

      return { uploadedBy: metadata.userId };
    }),
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ videoId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) throw new UploadThingError("Unauthorized");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));

      const [existingVideo] = await db
        .select({ thumbnailKey: videos.thumbnailKey })
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));

      if (!existingVideo) {
        throw new UploadThingError("Not Found");
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));
      }

      return { user, ...input };
>>>>>>> 9f21a4b (internal structure improvements)
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
<<<<<<< HEAD
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
=======
        .set({ thumbnailUrl: file.ufsUrl, thumbnailKey: file.key })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.user.id),
          ),
        );

      return { uploadedBy: metadata.user.id };
>>>>>>> 9f21a4b (internal structure improvements)
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
