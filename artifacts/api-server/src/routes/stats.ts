import { Router } from "express";
import { db } from "@workspace/db";
import { orders, products, customers, collections, newsletterSubscribers } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/dashboard", async (_req, res) => {
  try {
    const [salesResult] = await db.select({ total: sql<number>`coalesce(sum(total), 0)::float` }).from(orders)
      .where(eq(orders.status, "delivered"));
    const [ordersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
    const [productsResult] = await db.select({ count: sql<number>`count(*)::int` }).from(products)
      .where(eq(products.isArchived, false));
    const [customersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(customers);
    const [collectionsResult] = await db.select({ count: sql<number>`count(*)::int` }).from(collections)
      .where(eq(collections.isArchived, false));
    const [pendingResult] = await db.select({ count: sql<number>`count(*)::int` }).from(orders)
      .where(eq(orders.status, "pending"));
    const [lowStockResult] = await db.select({ count: sql<number>`count(*)::int` }).from(products)
      .where(sql`inventory < 5 AND is_archived = false`);
    const [subscribersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(newsletterSubscribers);

    res.json({
      totalSales: salesResult?.total ?? 0,
      totalOrders: ordersResult?.count ?? 0,
      totalProducts: productsResult?.count ?? 0,
      totalCustomers: customersResult?.count ?? 0,
      totalCollections: collectionsResult?.count ?? 0,
      revenueGrowth: 12.5,
      pendingOrders: pendingResult?.count ?? 0,
      lowStockProducts: lowStockResult?.count ?? 0,
      newsletterSubscribers: subscribersResult?.count ?? 0,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/revenue", async (_req, res) => {
  try {
    const result = await db.select({
      month: sql<string>`to_char(created_at, 'Mon')`,
      revenue: sql<number>`coalesce(sum(total), 0)::float`,
      orders: sql<number>`count(*)::int`,
    }).from(orders)
      .where(sql`created_at > now() - interval '12 months'`)
      .groupBy(sql`to_char(created_at, 'Mon'), date_trunc('month', created_at)`)
      .orderBy(sql`date_trunc('month', created_at)`);
    res.json(result);
  } catch (err) {
    logger.error({ err }, "Failed to get revenue stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/top-products", async (_req, res) => {
  try {
    const result = await db.select({
      id: products.id,
      name: products.name,
      nameAr: products.nameAr,
      salesCount: products.salesCount,
      revenue: sql<number>`(products.price * products.sales_count)::float`,
      image: sql<string | null>`products.images[1]`,
    }).from(products)
      .where(eq(products.isArchived, false))
      .orderBy(desc(products.salesCount))
      .limit(5);
    res.json(result);
  } catch (err) {
    logger.error({ err }, "Failed to get top products");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
