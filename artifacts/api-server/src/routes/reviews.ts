import { Router } from "express";
import { db } from "@workspace/db";
import { reviews } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { productId, featured } = req.query as Record<string, string>;
    const conditions = [];
    if (productId) conditions.push(eq(reviews.productId, Number(productId)));
    if (featured === "true") conditions.push(eq(reviews.isFeatured, true));
    const rows = await db.select().from(reviews)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reviews.createdAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [created] = await db.insert(reviews).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create review");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const [updated] = await db.update(reviews).set(req.body)
      .where(eq(reviews.id, Number(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update review");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(reviews).where(eq(reviews.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete review");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
