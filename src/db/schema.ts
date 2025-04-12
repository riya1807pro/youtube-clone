import { relations } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import {
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { comment } from "postcss";

export const reactionType = pgEnum("reaction_type", ["like","dislike"])
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

export const usersRelation = relations(users, ({ many }) => ({
  videos: many(videos),
  VideoViews: many(VideoViews),
  VideoReaction: many(VideoReaction),
  subscriptions: many(subscriptions, {
    relationName: "subscriptions_Viewer_Id_fKey", // No change in schema
  }),
  subscribers: many(subscriptions, {
    relationName: "subscriptions_creator_Id_fKey", // No change in schema
  }),
  comments: many(comments),
  commentReaction : many(CommentReaction),
}));

export const subscriptions = pgTable("subscriptions",{
  viewerId:uuid("viewer_id").references(()=> users.id,{onDelete:"cascade"}).notNull(),
  creatorId:uuid("creator_id").references(()=> users.id,{onDelete:"cascade"}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(t)=>[
  primaryKey({
    name: "subscriptions_pk",
    columns:[ t.viewerId, t.creatorId],
  }),
]);


export const subscriptionsRelation = relations(subscriptions, ({ one }) => ({
  viewer: one(users, {
    fields: [subscriptions.viewerId],
    references: [users.id],
    relationName: "subscriptions_Viewer_Id_fKey", // No change in schema
  }),
  creator: one(users, {
    fields: [subscriptions.creatorId],
    references: [users.id],
    relationName: "subscriptions_creator_Id_fKey", // No change in schema
  }),
}));

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  discription: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoryRelations = relations(users, ({ many }) => ({
  videos: many(videos),
}));

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

export const videoRelations = relations(videos, ({ one ,many}) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
  views: many(VideoViews),
  reaction : many(VideoReaction),
  comments: many(comments),
}));

export const comments = pgTable("comments",{
  id: uuid("id").primaryKey().defaultRandom(),
  parentId: uuid("parent_id"),
  userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
  videoId: uuid("video_id").references(() => videos.id, {onDelete: "cascade",}).notNull(),
  values: text("values").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(t)=>{
  return [
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name:"comment_parent_id_fKey",
    })
    .onDelete("cascade"),
  ]
})

export const commentsRelation = relations(comments, ({one,many})=>({
  user: one(users, {
    fields:[comments.userId],
    references: [users.id]
  }),
  video : one(videos, {
    fields:[comments.videoId],
    references: [videos.id]
  }),
  parent : one(comments, {
    fields:[comments.parentId],
    references: [comments.id],
    relationName:"comments_parents_id_fKey",
  }),
  reactions: many(CommentReaction),
  replies: many(comments,{
    relationName:"comments_parents_id_fKey",
  })
}))


export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
export const commentSelectSchema = createSelectSchema(comments);

export const CommentReaction = pgTable("comment_reaction",{
  userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
  commentId: uuid("comment_id").references(() => comments.id, {onDelete: "cascade"}).notNull(),
  type:reactionType("type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(t)=>[
  primaryKey({
    name: "Comment_reactions_pk",
    columns: [t.commentId, t.userId]
  })
])

export const CommentReactionRelation = relations(CommentReaction,({one})=>({
  user:one(users,{
    fields:[CommentReaction.userId],
    references: [users.id]
  }),
  comment:one(comments,{
    fields:[CommentReaction.commentId],
    references: [comments.id]
  }),
}))

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

export const VideoViewsRelation = relations(VideoViews,({one,many})=>({
  user:one(users,{
    fields:[VideoViews.userId],
    references: [users.id]
  }),
  video:one(videos,{
    fields:[VideoViews.userId],
    references: [videos.id]
  }),
  views: many(VideoViews)
}))


export const videoViewsInsertSchema = createInsertSchema(VideoViews);
export const videoViewsUpdateSchema = createUpdateSchema(VideoViews);
export const videoViewsSelectSchema = createSelectSchema(VideoViews);



export const VideoReaction = pgTable("video_reaction",{
  userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
  videoId: uuid("video_id").references(() => videos.id, {onDelete: "cascade"}).notNull(),
  type:reactionType("type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
},(t)=>[
  primaryKey({
    name: "video_reactions_pk",
    columns: [t.videoId, t.userId]
  })
])

export const VideoReactionRelation = relations(VideoReaction,({one})=>({
  user:one(users,{
    fields:[VideoReaction.userId],
    references: [users.id]
  }),
  video:one(videos,{
    fields:[VideoReaction.userId],
    references: [videos.id]
  }),
}))


export const videoReactionInsertSchema = createInsertSchema(VideoReaction);
export const videoReactionUpdateSchema = createUpdateSchema(VideoReaction);
export const videoReactionSelectSchema = createSelectSchema(VideoReaction);
