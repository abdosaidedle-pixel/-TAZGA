import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  mimetype: text("mimetype"),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({ id: true, createdAt: true });
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;
