import { Router } from "express";
import { db } from "@workspace/db";
import { customers } from "@workspace/db";
import { eq, ilike, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search, limit = "50", offset = "0" } = req.query as Record<string, string>;
    let rows = await db.select().from(customers).orderBy(desc(customers.createdAt))
      .limit(Number(limit)).offset(Number(offset));
    if (search) {
      rows = await db.select().from(customers)
        .where(ilike(customers.name, `%${search}%`))
        .orderBy(desc(customers.createdAt))
        .limit(Number(limit)).offset(Number(offset));
    }
    res.json(rows.map(c => ({ ...c, passwordHash: undefined })));
  } catch (err) {
    logger.error({ err }, "Failed to list customers");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [customer] = await db.select().from(customers).where(eq(customers.id, Number(req.params.id)));
    if (!customer) return res.status(404).json({ error: "Not found" });
    res.json({ ...customer, passwordHash: undefined });
  } catch (err) {
    logger.error({ err }, "Failed to get customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { password: _password, ...data } = req.body;
    const [created] = await db.insert(customers).values(data).returning();
    res.status(201).json({ ...created, passwordHash: undefined });
  } catch (err) {
    logger.error({ err }, "Failed to create customer");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
