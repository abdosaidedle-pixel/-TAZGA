import { Router } from "express";
import { db } from "@workspace/db";
import { orders, orderItems } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

async function getOrderWithItems(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...order, items };
}

router.get("/recent", async (_req, res) => {
  try {
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(10);
    const withItems = await Promise.all(rows.map(async (o) => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
      return { ...o, items };
    }));
    res.json(withItems);
  } catch (err) {
    logger.error({ err }, "Failed to list recent orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { status, limit = "50", offset = "0" } = req.query as Record<string, string>;
    const conditions = status ? [eq(orders.status, status as typeof orders.status._.data)] : [];
    const rows = await db.select().from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orders.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));
    const withItems = await Promise.all(rows.map(async (o) => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
      return { ...o, items };
    }));
    res.json(withItems);
  } catch (err) {
    logger.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await getOrderWithItems(Number(req.params.id));
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(order);
  } catch (err) {
    logger.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { items, ...orderData } = req.body;
    const [order] = await db.insert(orders).values(orderData).returning();
    if (items?.length) {
      await db.insert(orderItems).values(
        items.map((item: { productId: number; quantity: number; price: number; productName?: string; productImage?: string }) => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.productName || "Product",
          productImage: item.productImage || null,
          quantity: item.quantity,
          price: item.price,
        }))
      );
    }
    const created = await getOrderWithItems(order.id);
    res.status(201).json(created);
  } catch (err) {
    logger.error({ err }, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const [updated] = await db.update(orders).set(req.body)
      .where(eq(orders.id, Number(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    const order = await getOrderWithItems(updated.id);
    res.json(order);
  } catch (err) {
    logger.error({ err }, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
