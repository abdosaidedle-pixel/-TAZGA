import { Router, Request } from "express";
import { db } from "@workspace/db";
import { cartItems, wishlistItems, products } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function getSessionId(req: Request): string {
  return (req.headers["x-session-id"] as string) || "anonymous";
}

async function enrichCartItem(item: typeof cartItems.$inferSelect) {
  const [product] = await db.select().from(products).where(eq(products.id, item.productId));
  return { ...item, product: product ? { ...product, category: null, collection: null } : null };
}

router.get("/cart", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const items = await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
    const enriched = await Promise.all(items.map(enrichCartItem));
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Failed to get cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity, price } = req.body;
    const [existing] = await db.select().from(cartItems)
      .where(and(eq(cartItems.sessionId, sessionId), eq(cartItems.productId, productId)));
    if (existing) {
      const [updated] = await db.update(cartItems)
        .set({ quantity: existing.quantity + quantity })
        .where(eq(cartItems.id, existing.id)).returning();
      const enriched = await enrichCartItem(updated);
      return res.status(201).json(enriched);
    }
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    const actualPrice = price ?? product?.price ?? 0;
    const [created] = await db.insert(cartItems).values({ sessionId, productId, quantity, price: actualPrice }).returning();
    const enriched = await enrichCartItem(created);
    res.status(201).json(enriched);
  } catch (err) {
    logger.error({ err }, "Failed to add to cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/cart/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const [updated] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, Number(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    const enriched = await enrichCartItem(updated);
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Failed to update cart item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/cart/:id", async (req, res) => {
  try {
    await db.delete(cartItems).where(eq(cartItems.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to remove from cart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/wishlist", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const items = await db.select().from(wishlistItems).where(eq(wishlistItems.sessionId, sessionId));
    const enriched = await Promise.all(items.map(async (item) => {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId));
      return { ...item, product: product ? { ...product, category: null, collection: null } : null };
    }));
    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Failed to get wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/wishlist", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = req.body;
    const [existing] = await db.select().from(wishlistItems)
      .where(and(eq(wishlistItems.sessionId, sessionId), eq(wishlistItems.productId, productId)));
    if (existing) {
      const [product] = await db.select().from(products).where(eq(products.id, productId));
      return res.status(201).json({ ...existing, product: product ? { ...product, category: null, collection: null } : null });
    }
    const [created] = await db.insert(wishlistItems).values({ sessionId, productId }).returning();
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    res.status(201).json({ ...created, product: product ? { ...product, category: null, collection: null } : null });
  } catch (err) {
    logger.error({ err }, "Failed to add to wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/wishlist/:id", async (req, res) => {
  try {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, Number(req.params.id)));
    res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Failed to remove from wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
