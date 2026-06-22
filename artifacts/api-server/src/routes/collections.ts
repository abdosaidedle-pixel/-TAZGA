import { Router } from "express";
import { db } from "@workspace/db";
import { collections, products } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(collections).where(eq(collections.isArchived, false));
    const withCount = await Promise.all(rows.map(async (col) => {
      const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
        .from(products).where(eq(products.collectionId, col.id));
      return { ...col, productCount: count };
    }));
    res.json(withCount);
  } catch (err) {
    logger.error({ err }, "Failed to list collections");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [col] = await db.select().from(collections).where(eq(collections.id, Number(req.params.id)));
    if (!col) return res.status(404).json({ error: "Not found" });
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
      .from(products).where(eq(products.collectionId, col.id));
    res.json({ ...col, productCount: count });
  } catch (err) {
    logger.error({ err }, "Failed to get collection");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [created] = await db.insert(collections).values({ ...body, slug }).returning();
    res.status(201).json({ ...created, productCount: 0 });
  } catch (err) {
    logger.error({ err }, "Failed to create collection");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const [updated] = await db.update(collections).set(req.body)
      .where(eq(collections.id, Number(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ...updated, productCount: 0 });
  } catch (err) {
    logger.error({ err }, "Failed to update collection");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(collections).where(eq(collections.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete collection");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
