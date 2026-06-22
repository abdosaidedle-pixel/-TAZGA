import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, Heart } from "lucide-react";
import { collectionsService } from "@/lib/services/collections.service";
import { productsService } from "@/lib/services/products.service";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";
import { useRealtimeDataWithDefault } from "@/hooks/use-realtime-data";
import type { Collection, Product } from "@/lib/types";

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();

  // ─── Real-time subscriptions ───
  // Subscribe to ALL collections then filter by slug (so admin edits appear instantly)
  const { data: allCollections, loading: loadingCollections } = useRealtimeDataWithDefault<Collection[]>(
    (cb) => collectionsService.subscribeAll(cb),
    [],
    []
  );

  const collection = allCollections.find((c) => c.slug === slug) || null;
  const collectionId = collection?.id;

  const { data: allProducts, loading: loadingProducts } = useRealtimeDataWithDefault<Product[]>(
    (cb) => productsService.subscribeAll(cb),
    [],
    []
  );

  const products = collectionId
    ? allProducts.filter((p) => p.collectionId === collectionId)
    : [];

  const loading = loadingCollections || (loadingProducts && !!collectionId);

  useEffect(() => {
    // Reset scroll on slug change
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({ title: t("product.added_to_cart"), description: `${product.name} ${t("product.added_to_cart_desc")}` });
  };

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: t("product.removed_from_wishlist") });
    } else {
      addToWishlist(product);
      toast({ title: t("product.added_to_wishlist") });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-[40vh] w-full rounded-none" />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center" dir={dir}>
        <h1 className="text-3xl font-serif mb-4">{t("collections.not_found")}</h1>
        <Link href="/collections" className="text-primary hover:underline">{t("collections.return")}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" dir={dir}>
      {/* Banner */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          {collection.coverImage ? (
            <img src={collection.coverImage} alt={collection.name} loading="eager" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
        </div>
        <div className="relative z-10 text-center px-4 mt-16">
          <h1 className="font-serif text-4xl md:text-6xl tracking-wider mb-4">{collection.name}</h1>
          <p className="font-arabic text-2xl text-primary" dir="rtl">{collection.nameAr}</p>
          {(collection.description || collection.descriptionAr) && (
            <div className="mt-6 max-w-2xl mx-auto text-muted-foreground font-light text-sm md:text-base">
              {collection.description && <p className="mb-2">{collection.description}</p>}
              {collection.descriptionAr && <p className="font-arabic" dir="rtl">{collection.descriptionAr}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pt-12">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-serif">
            <Link href="/" className="hover:text-primary transition-colors">{t("product.breadcrumb_home")}</Link>
            <ChevronRight className="h-3 w-3 rtl-flip-x" />
            <Link href="/collections" className="hover:text-primary transition-colors">{t("nav.collections")}</Link>
            <ChevronRight className="h-3 w-3 rtl-flip-x" />
            <span className="text-foreground">{collection.name}</span>
          </div>
          <div className="text-sm text-muted-foreground font-serif">
            {products.length} {t("collections.pieces_count")}
          </div>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col"
              >
                <Link href={`/shop/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4 block border border-border">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">{t("shop.no_image")}</div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background/90 to-transparent flex justify-center gap-4">
                    <button
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={`h-10 w-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all ${
                        isInWishlist(product.id) ? "text-primary" : ""
                      }`}
                      aria-label={t("product.added_to_wishlist")}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-primary" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="h-10 px-6 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all gap-2 text-sm font-medium tracking-wide font-serif"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {t("home.product.add")}
                    </button>
                  </div>
                </Link>
                <div className="flex justify-between items-start gap-4">
                  <Link href={`/shop/${product.slug}`} className="flex-1">
                    <h3 className="font-serif text-lg tracking-wide group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    <p className="font-arabic text-sm text-muted-foreground" dir="rtl">{product.nameAr}</p>
                  </Link>
                  <div className="text-right">
                    <p className="text-primary font-medium tracking-wide">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground border border-white/10 font-arabic">
            {t("collections.empty_products")}
          </div>
        )}
      </div>
    </div>
  );
}
