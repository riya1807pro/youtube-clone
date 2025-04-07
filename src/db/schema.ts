import { relations } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerk_Id: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    //add banner feild
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerk_Id)]
);

// export const usersRelation = relations(users, ({ many }) => ({
//   videos: many(videos),
//   VideoViews: many(VideoViews)
// }));

export const categories = pgTable("cetegoires", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  discription: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// export const categoryRelations = relations(users, ({ many }) => ({
//   videos: many(videos),
// }));

export const videoVisbility = pgEnum("video_Visbility", ["private", "public"]);

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  muxStatus: text("mux_status").notNull(),
  muxAssetId: text("mux_asset_id").notNull().unique(),
  muxUploaderId: text("mux_uploader_id").notNull().unique(),
  muxPlaybackId: text("mux_playback_id").notNull().unique(),
  muxTrackId: text("mux_track_id").notNull().unique(),
  muxTrackStatus: text("mux_track_status").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  thumbnailKey: text("thumbnailKey"),
  previewUrl: text("preview_url"),
  previewKey: text("preview_key"),
  duration: integer("duration"),
  visibility: videoVisbility("visibility").default("private").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category").references(() => categories.id, {
    onDelete: "set null",
  }),
  discription: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

// export const videoRelatins = relations(videos, ({ one }) => ({
//   user: one(users, {
//     fields: [videos.userId],
//     references: [users.id],
//   }),
//   category: one(categories, {
//     fields: [videos.categoryId],
//     references: [categories.id],
//   }),
// }));

export const VideoViews = pgTable("videoViews",{
  userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
  videoId: uuid("video_id").references(() => videos.id, {onDelete: "cascade"}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(t)=>[
  primaryKey({
    name: "video_views_pk",
    columns: [t.videoId, t.userId]
  })
])

// export const VideoViewsRelation = relations(VideoViews,({one,many})=>({
//   users:one(users,{
//     fields:[VideoViews.userId],
//     references: [users.id]
//   }),
//   videos:one(videos,{
//     fields:[VideoViews.userId],
//     references: [videos.id]
//   }),
//   views: many(VideoViews)
// }))


export const videoViewsInsertSchema = createInsertSchema(VideoViews);
export const videoViewsUpdateSchema = createUpdateSchema(VideoViews);
export const videoViewsSelectSchema = createSelectSchema(VideoViews);
