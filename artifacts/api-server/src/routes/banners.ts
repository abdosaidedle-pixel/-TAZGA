import { Router } from "express";
import { db } from "@workspace/db";
import { banners } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(asc(banners.displayOrder));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list banners");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [created] = await db.insert(banners).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create banner");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const [updated] = await db.update(banners).set(req.body)
      .where(eq(banners.id, Number(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update banner");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(banners).where(eq(banners.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete banner");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
