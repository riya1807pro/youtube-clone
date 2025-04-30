import { relations } from "drizzle-orm";
import {
<<<<<<< HEAD
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import {
=======
>>>>>>> 9f21a4b (internal structure improvements)
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
<<<<<<< HEAD
import { comment } from "postcss";

export const reactionType = pgEnum("reaction_type", ["like","dislike"])
=======
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

>>>>>>> 9f21a4b (internal structure improvements)
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
<<<<<<< HEAD
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
=======
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    bannerUrl: text("banner_url"),
    bannerKey: text("banner_key"),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    viewerId: uuid("viewer_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "subscriptions_pk",
      columns: [t.viewerId, t.creatorId],
    }),
  ],
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  viewer: one(users, {
    fields: [subscriptions.viewerId],
    references: [users.id],
    relationName: "subscriptions_viewer_id_fkey",
>>>>>>> 9f21a4b (internal structure improvements)
  }),
  creator: one(users, {
    fields: [subscriptions.creatorId],
    references: [users.id],
<<<<<<< HEAD
    relationName: "subscriptions_creator_Id_fKey", // No change in schema
  }),
}));

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoryRelations = relations(users, ({ many }) => ({
  videos: many(videos),
}));

export const videoVisbility = pgEnum("video_Visbility", ["private", "public"]);
=======
    relationName: "subscriptions_creator_id_fkey",
  }),
}));

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("descriptioon"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)],
);

export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("parent_id"),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => {
    return [
      foreignKey({
        columns: [t.parentId],
        foreignColumns: [t.id],
        name: "comments_parent_id_fkey",
      }).onDelete("cascade"),
    ];
  },
);

export const commentRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [comments.videoId],
    references: [videos.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "comments_parent_id_fkey",
  }),
  replies: many(comments, {
    relationName: "comments_parent_id_fkey",
  }),
  reactions: many(commentReactions),
}));

export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
export const commentSelectSchema = createSelectSchema(comments);

export const videoViews = pgTable(
  "video_views",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_views_pk",
      columns: [t.userId, t.videoId],
    }),
  ],
);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
  user: one(users, {
    fields: [videoViews.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoViews.videoId],
    references: [videos.id],
  }),
}));

export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);

export const userRelations = relations(users, ({ many }) => ({
  videos: many(videos),
  videoViews: many(videoViews),
  videoReactions: many(videoReactions),
  subscriptions: many(subscriptions, {
    relationName: "subscriptions_viewer_id_fkey",
  }),
  subscribers: many(subscriptions, {
    relationName: "subscriptions_creator_id_fkey",
  }),
  comments: many(comments),
  commentReactions: many(commentReactions),
  playlists: many(playlists),
}));
>>>>>>> 9f21a4b (internal structure improvements)

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
<<<<<<< HEAD
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploaderId: text("mux_uploader_id").unique(),
=======
  description: text("description"),
  muxAssetId: text("mux_asset_id").unique(),
  muxStatus: text("mux_status"),
  muxUploadId: text("mux_upload_id").unique(),
>>>>>>> 9f21a4b (internal structure improvements)
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(),
  muxTrackStatus: text("mux_track_status"),
  thumbnailUrl: text("thumbnail_url"),
<<<<<<< HEAD
  thumbnailKey: text("thumbnailKey"),
  previewUrl: text("preview_url"),
  previewKey: text("preview_key"),
  duration: integer("duration").default(0).notNull(),
  visibility: videoVisbility("visibility").default("private").notNull(),
=======
  thumbnailKey: text("thumbnail_key"),
  previewUrl: text("preview_url"),
  previewKey: text("preview_key"),
  duration: integer("duration").default(0).notNull(),
  visibility: videoVisibility("visibility").default("private").notNull(),
>>>>>>> 9f21a4b (internal structure improvements)
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
<<<<<<< HEAD
  categoryId: uuid("category").references(() => categories.id, {
    onDelete: "set null",
  }),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const videoRelations = relations(videos, ({ one ,many}) => ({
=======
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));

export const videoRelations = relations(videos, ({ one, many }) => ({
>>>>>>> 9f21a4b (internal structure improvements)
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
<<<<<<< HEAD
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
=======
  views: many(videoViews),
  reactions: many(videoReactions),
  comments: many(comments),
  playlistVideos: many(playlistVideos),
}));

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const videoReactions = pgTable(
  "video_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_reactions_pk",
      columns: [t.userId, t.videoId],
    }),
  ],
);

export const videoReactionRelations = relations(videoReactions, ({ one }) => ({
  user: one(users, {
    fields: [videoReactions.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoReactions.videoId],
    references: [videos.id],
  }),
}));

export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);
export const videoReactionSelectSchema = createSelectSchema(videoReactions);

export const commentReactions = pgTable(
  "comment_reactions",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    commentId: uuid("comment_id")
      .references(() => comments.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "comment_reactions_pk",
      columns: [t.userId, t.commentId],
    }),
  ],
);

export const commentReactionsRelations = relations(
  commentReactions,
  ({ one }) => ({
    user: one(users, {
      fields: [commentReactions.userId],
      references: [users.id],
    }),
    comment: one(comments, {
      fields: [commentReactions.commentId],
      references: [comments.id],
    }),
  }),
);

export const playlistVideos = pgTable(
  "playlist_videos",
  {
    playlistId: uuid("playlist_id")
      .references(() => playlists.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "playlist_videos_pk",
      columns: [t.playlistId, t.videoId],
    }),
  ],
);

export const playlists = pgTable("playlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playlistVideoRelations = relations(playlistVideos, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistVideos.playlistId],
    references: [playlists.id],
  }),
  video: one(videos, {
    fields: [playlistVideos.videoId],
    references: [videos.id],
  }),
}));
export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
  playlistVideos: many(playlistVideos),
}));
>>>>>>> 9f21a4b (internal structure improvements)
