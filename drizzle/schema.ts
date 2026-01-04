import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with Codex-specific fields for membership and preferences.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Codex-specific fields
  tier: mysqlEnum("tier", ["ember", "flamewalker", "harmonizer", "architect"]).default("ember").notNull(),
  isMirrored: boolean("isMirrored").default(false).notNull(),
  
  // Stripe integration
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Chat history for Sarah AI conversations.
 * Stores the dialogue between users and the Guardian of Synthesis.
 */
export const chatHistory = mysqlTable("chat_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatHistory.$inferSelect;
export type InsertChatMessage = typeof chatHistory.$inferInsert;

/**
 * Unlocked scrolls for each user.
 * Tracks which sacred scrolls a user has access to.
 */
export const unlockedScrolls = mysqlTable("unlocked_scrolls", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  scrollId: varchar("scrollId", { length: 32 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
  viewedAt: timestamp("viewedAt"), // null until first view, triggers celebration
});

export type UnlockedScroll = typeof unlockedScrolls.$inferSelect;
export type InsertUnlockedScroll = typeof unlockedScrolls.$inferInsert;

/**
 * Purchase records linking Stripe transactions to users.
 * Minimal storage - detailed info fetched from Stripe API.
 */
export const purchases = mysqlTable("purchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull(),
  productType: mysqlEnum("productType", ["scroll", "artifact", "membership", "ritual"]).notNull(),
  productId: varchar("productId", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

/**
 * User favorites (bookmarked scrolls).
 * Stores a simple relation: userId + scrollId.
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  scrollId: varchar("scrollId", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;
