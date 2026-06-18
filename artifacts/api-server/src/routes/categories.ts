import { Router } from "express";
import { db } from "@workspace/db";
import { categories, products } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(categories).orderBy(categories.displayOrder);
    const withCount = await Promise.all(rows.map(async (cat) => {
      const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
        .from(products).where(eq(products.categoryId, cat.id));
      return { ...cat, productCount: count };
    }));
    res.json(withCount);
  } catch (err) {
    logger.error({ err }, "Failed to list categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [created] = await db.insert(categories).values({ ...body, slug }).returning();
    res.status(201).json({ ...created, productCount: 0 });
  } catch (err) {
    logger.error({ err }, "Failed to create category");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const [updated] = await db.update(categories).set(req.body)
      .where(eq(categories.id, Number(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ...updated, productCount: 0 });
  } catch (err) {
    logger.error({ err }, "Failed to update category");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(categories).where(eq(categories.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete category");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
