import { pgTable, text, serial, integer, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categories } from "./categories";
import { collections } from "./collections";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  shortDescriptionAr: text("short_description_ar"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  price: real("price").notNull(),
  salePrice: real("sale_price"),
  costPrice: real("cost_price"),
  sku: text("sku"),
  images: text("images").array().notNull().default([]),
  categoryId: integer("category_id").references(() => categories.id),
  collectionId: integer("collection_id").references(() => collections.id),
  tags: text("tags").array().notNull().default([]),
  material: text("material"),
  weight: text("weight"),
  dimensions: text("dimensions"),
  inventory: integer("inventory").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isArchived: boolean("is_archived").notNull().default(false),
  averageRating: real("average_rating"),
  reviewCount: integer("review_count").notNull().default(0),
  salesCount: integer("sales_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
