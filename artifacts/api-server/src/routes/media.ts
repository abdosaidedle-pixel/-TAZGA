import { Router } from "express";
import { db } from "@workspace/db";
import { mediaFiles } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(mediaFiles).orderBy(desc(mediaFiles.createdAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list media");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [created] = await db.insert(mediaFiles).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to upload media");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete media");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
