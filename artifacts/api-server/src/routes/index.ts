import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import collectionsRouter from "./collections";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import customersRouter from "./customers";
import reviewsRouter from "./reviews";
import bannersRouter from "./banners";
import newsletterRouter from "./newsletter";
import cartRouter from "./cart";
import statsRouter from "./stats";
import mediaRouter from "./media";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/collections", collectionsRouter);
router.use("/categories", categoriesRouter);
router.use("/orders", ordersRouter);
router.use("/customers", customersRouter);
router.use("/reviews", reviewsRouter);
router.use("/banners", bannersRouter);
router.use("/newsletter", newsletterRouter);
router.use(cartRouter);
router.use("/stats", statsRouter);
router.use("/media", mediaRouter);

export default router;
