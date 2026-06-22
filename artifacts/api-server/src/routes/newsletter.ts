import { Router } from "express";
import { db } from "@workspace/db";
import { newsletterSubscribers } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to list subscribers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [existing] = await db.select().from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, req.body.email));
    if (existing) {
      return res.status(201).json(existing);
    }
    const [created] = await db.insert(newsletterSubscribers).values(req.body).returning();
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to subscribe");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to delete subscriber");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
