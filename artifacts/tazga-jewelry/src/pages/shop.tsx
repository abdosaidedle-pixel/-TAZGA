import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { productsService } from "@/lib/services/products.service";
import { categoriesService } from "@/lib/services/categories.service";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";
import { useRealtimeDataWithDefault } from "@/hooks/use-realtime-data";
import type { Product, Category } from "@/lib/types";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const { toast } = useToast();
  const { lang, t, dir } = useLanguage();

  // ─── Real-time subscriptions ───
  const { data: products, loading: productsLoading } = useRealtimeDataWithDefault<Product[]>(
    (cb) => productsService.subscribeAll(cb),
    [],
    []
  );

  const { data: categories, loading: categoriesLoading } = useRealtimeDataWithDefault<Category[]>(
    (cb) => categoriesService.subscribeAll(cb),
    [],
    []
  );

  const loading = productsLoading || categoriesLoading;

  // Handle category from query param if any
  const searchParams = new URLSearchParams(window.location.search);
  const queryCategory = searchParams.get("category");

  useEffect(() => {
    if (queryCategory) {
      setCategoryFilter(queryCategory);
    }
  }, [queryCategory]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({
      title: t("home.product.added_to_cart"),
      description: `${product.name} ${t("home.product.added_desc")}`,
    });
  };

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: t("home.product.removed_from_wishlist") });
    } else {
      addToWishlist(product);
      toast({ title: t("home.product.added_to_wishlist") });
    }
  };

  // Client side filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.nameAr?.includes(search) ||
      product.sku?.toLowerCase().includes(search.toLowerCase());

    if (!categoryFilter) return matchesSearch;

    // Find category ID matching the slug
    const targetCat = categories.find(c => c.slug === categoryFilter);
    const matchesCategory = targetCat ? product.categoryId === targetCat.id : false;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-20" dir={dir}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="w-full md:w-auto">
            <h1 className="font-serif text-4xl tracking-wider mb-2">{t("shop.title")}</h1>
            <p className="font-arabic text-muted-foreground" dir="rtl">{t("shop.subtitle")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("shop.search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 bg-secondary border border-border rounded-none pl-10 pr-4 py-2 focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("")}
                className={`px-4 py-2 text-sm transition-colors border ${!categoryFilter ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
              >
                {t("shop.filter.all")}
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.slug)}
                  className={`px-4 py-2 text-sm transition-colors border ${categoryFilter === c.slug ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                >
                  {lang === "ar" ? (c.nameAr || c.name) : c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-none" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col"
              >
                <Link href={`/shop/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4 block border border-white/5">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">{t("shop.no_image")}</div>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider px-2 py-1 font-serif">
                      {t("shop.featured_badge")}
                    </span>
                  )}

                  {/* Quick actions on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background/90 to-transparent flex justify-center gap-4">
                    <button
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={`h-10 w-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all ${
                        isInWishlist(product.id) ? "text-primary" : ""
                      }`}
                      aria-label={t("home.product.added_to_wishlist")}
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
          <div className="py-32 text-center">
            <h2 className="text-2xl font-serif mb-4">{t("shop.no_results_title")}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("shop.no_results_body")}</p>
            <button
              onClick={() => { setSearch(""); setCategoryFilter(""); }}
              className="px-8 py-3 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-serif tracking-widest uppercase text-sm"
            >
              {t("shop.clear_filters")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
