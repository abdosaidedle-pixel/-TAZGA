import { Router } from "express";
import { db } from "@workspace/db";
import { products, categories, collections } from "@workspace/db";
import { eq, ilike, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, collection, featured, search, sort, minPrice, maxPrice, limit = "24", offset = "0" } = req.query as Record<string, string>;
    const conditions: ReturnType<typeof eq>[] = [];

    if (category) conditions.push(eq(products.categoryId, Number(category)));
    if (collection) conditions.push(eq(products.collectionId, Number(collection)));
    if (featured === "true") conditions.push(eq(products.isFeatured, true));
    if (search) conditions.push(ilike(products.name, `%${search}%`));
    if (minPrice) conditions.push(gte(products.price, Number(minPrice)));
    if (maxPrice) conditions.push(lte(products.price, Number(maxPrice)));
    conditions.push(eq(products.isArchived, false));

    let orderBy;
    switch (sort) {
      case "price_asc": orderBy = asc(products.price); break;
      case "price_desc": orderBy = desc(products.price); break;
      case "bestselling": orderBy = desc(products.salesCount); break;
      case "popular": orderBy = desc(products.reviewCount); break;
      default: orderBy = desc(products.createdAt);
    }

    const rows = await db.select().from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(Number(limit))
      .offset(Number(offset));

    const withRelations = await Promise.all(rows.map(async (p) => {
      const [cat] = p.categoryId ? await db.select().from(categories).where(eq(categories.id, p.categoryId)) : [null];
      const [col] = p.collectionId ? await db.select().from(collections).where(eq(collections.id, p.collectionId)) : [null];
      return { ...p, category: cat ?? null, collection: col ?? null };
    }));

    res.json(withRelations);
  } catch (err) {
    logger.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/featured", async (_req, res) => {
  try {
    const rows = await db.select().from(products)
      .where(and(eq(products.isFeatured, true), eq(products.isArchived, false)))
      .orderBy(desc(products.salesCount))
      .limit(8);
    res.json(rows.map(p => ({ ...p, category: null, collection: null })));
  } catch (err) {
    logger.error({ err }, "Failed to list featured products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/new-arrivals", async (_req, res) => {
  try {
    const rows = await db.select().from(products)
      .where(eq(products.isArchived, false))
      .orderBy(desc(products.createdAt))
      .limit(8);
    res.json(rows.map(p => ({ ...p, category: null, collection: null })));
  } catch (err) {
    logger.error({ err }, "Failed to list new arrivals");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [product] = await db.select().from(products).where(eq(products.id, id));
    if (!product) return res.status(404).json({ error: "Not found" });

    const [cat] = product.categoryId ? await db.select().from(categories).where(eq(categories.id, product.categoryId)) : [null];
    const [col] = product.collectionId ? await db.select().from(collections).where(eq(collections.id, product.collectionId)) : [null];

    res.json({ ...product, category: cat ?? null, collection: col ?? null });
  } catch (err) {
    logger.error({ err }, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/related", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [product] = await db.select().from(products).where(eq(products.id, id));
    const rows = await db.select().from(products)
      .where(and(
        product?.categoryId ? eq(products.categoryId, product.categoryId) : sql`true`,
        eq(products.isArchived, false)
      ))
      .limit(6);
    res.json(rows.filter(r => r.id !== id).map(p => ({ ...p, category: null, collection: null })));
  } catch (err) {
    logger.error({ err }, "Failed to get related products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [created] = await db.insert(products).values({ ...body, slug }).returning();
    res.status(201).json({ ...created, category: null, collection: null });
  } catch (err) {
    logger.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [updated] = await db.update(products).set(req.body).where(eq(products.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ...updated, category: null, collection: null });
  } catch (err) {
    logger.error({ err }, "Failed to update product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(products).where(eq(products.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
