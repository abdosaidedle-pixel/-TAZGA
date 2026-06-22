import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language-context";
import { productsService } from "@/lib/services/products.service";
import { useRealtimeDataWithDefault } from "@/hooks/use-realtime-data";
import type { Product } from "@/lib/types";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();

  // ─── Real-time subscriptions ───
  const { data: allProducts, loading } = useRealtimeDataWithDefault<Product[]>(
    (cb) => productsService.subscribeAll(cb),
    [],
    []
  );

  const product = allProducts.find((p) => p.slug === slug) || null;
  const relatedProducts = product
    ? allProducts
        .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 4)
    : [];

  // Reset image index when product changes
  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [slug]);

  // Reset image index when product loads
  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast({
      title: t("product.added_to_cart"),
      description: `${quantity}x ${product.name} ${t("product.added_to_cart_desc")}`,
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: t("product.removed_from_wishlist") });
    } else {
      addToWishlist(product);
      toast({
        title: t("product.added_to_wishlist"),
        description: `${product.name} ${t("product.wishlist_saved")}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 flex gap-4">
            <div className="w-24 flex flex-col gap-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-[3/4] w-full" />)}
            </div>
            <Skeleton className="flex-1 aspect-[3/4]" />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center" dir={dir}>
        <h1 className="text-3xl font-serif mb-4">{t("product.not_found")}</h1>
        <Link href="/shop" className="text-primary hover:underline">{t("product.return_to_shop")}</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["/images/category-rings.png"];

  return (
    <div className="min-h-screen pt-24 pb-20" dir={dir}>
      <div className="container mx-auto px-4 md:px-8">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-8 font-serif flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">{t("product.breadcrumb_home")}</Link>
          <ChevronRight className="h-3 w-3 rtl-flip-x" />
          <Link href="/shop" className="hover:text-primary transition-colors">{t("product.breadcrumb_shop")}</Link>
          <ChevronRight className="h-3 w-3 rtl-flip-x" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mb-24">
          {/* Images */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 md:flex-shrink-0 hide-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-[3/4] w-20 md:w-full flex-shrink-0 overflow-hidden border transition-all ${activeImage === i ? "border-primary" : "border-border opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt={`${product.name} - view ${i + 1}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative aspect-[3/4] bg-secondary overflow-hidden group border border-border">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={images[activeImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="font-serif text-3xl md:text-4xl tracking-wider mb-2">{product.name}</h1>
            <p className="font-arabic text-xl text-primary mb-6" dir="rtl">{product.nameAr}</p>

            <div className="text-2xl font-serif mb-8 border-b border-white/10 pb-8">
              ${product.price.toLocaleString()}
            </div>

            <div className="prose prose-invert prose-p:font-light prose-p:leading-relaxed prose-p:text-muted-foreground mb-8">
              <p>{product.description || t("product.default_desc_en")}</p>
              <p dir="rtl" className="font-arabic mt-4 text-right">
                {product.descriptionAr || t("product.default_desc_ar")}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center border border-white/20 h-12 w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-secondary transition-colors"
                  >-</button>
                  <div className="flex-1 flex items-center justify-center text-sm font-medium">{quantity}</div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center hover:bg-secondary transition-colors"
                  >+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 h-12 bg-primary text-primary-foreground font-serif tracking-[0.2em] text-sm uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {product.inStock ? t("product.add_to_bag") : t("product.out_of_stock")}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`h-12 w-12 border border-white/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors ${
                    isInWishlist(product.id) ? "text-primary border-primary" : ""
                  }`}
                  aria-label={t("product.added_to_wishlist")}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-primary" : ""}`} />
                </button>
              </div>
            </div>

            {/* Details Accordion */}
            <div className="border-t border-white/10 divide-y divide-white/10">
              <div className="py-4">
                <h3 className="font-serif tracking-wider mb-2 text-sm uppercase">{t("product.details")}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground font-light">
                  {product.material && <li><span className="text-foreground font-serif">{t("product.material")}:</span> {product.material}</li>}
                  <li><span className="text-foreground font-serif">{t("product.sku")}:</span> {product.sku || product.id}</li>
                </ul>
              </div>

              <div className="py-4 space-y-4 font-serif">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{t("product.shipping_free")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RotateCcw className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{t("product.returns")}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{t("product.warranty")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-white/5 font-serif">
            <h2 className="font-serif text-2xl tracking-wider mb-10 text-center">{t("product.related_title")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-secondary mb-4 overflow-hidden relative border border-border">
                    <img
                      src={p.images?.[0] || "/images/category-rings.png"}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif text-sm tracking-wide mb-1 group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                  <p className="text-sm text-primary">${p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
