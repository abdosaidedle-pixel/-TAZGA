import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Truck, ShieldCheck, Gem, RefreshCw, Lock, ArrowRight, Heart, ShoppingBag, Star, Mail } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { productsService } from "@/lib/services/products.service";
import { collectionsService } from "@/lib/services/collections.service";
import { settingsService } from "@/lib/services/settings.service";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Product, Collection, HomepageSettings } from "@/lib/types";

export default function Home() {
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useCart();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dbCollections, setDbCollections] = useState<Collection[]>([]);
  const [homeSettings, setHomeSettings] = useState<Partial<HomepageSettings>>({});
  const [loading, setLoading] = useState(true);
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [featured, cols, settings] = await Promise.all([
          productsService.getFeatured(8),
          collectionsService.getAll(),
          settingsService.getHomepage(),
        ]);
        setFeaturedProducts(featured);
        setDbCollections(cols);
        setHomeSettings(settings);
      } catch (err) {
        console.error("Error loading home page data from Firebase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmittingNewsletter(true);
    try {
      await addDoc(collection(db, "newsletter"), {
        email: email.trim().toLowerCase(),
        createdAt: serverTimestamp()
      });
      toast({ title: "Subscribed successfully", description: "Welcome to TAZGA." });
      setEmail("");
    } catch (err) {
      toast({ title: "Subscription Failed", description: String(err), variant: "destructive" });
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({ title: "Added to Bag", description: `${product.name} has been added to your shopping bag.` });
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from Wishlist" });
    } else {
      addToWishlist(product);
      toast({ title: "Added to Wishlist" });
    }
  };

  const trustIndicators = [
    { icon: Truck, text: "شحن سريع", textEn: "Fast Shipping" },
    { icon: ShieldCheck, text: "ضمان الجودة", textEn: "Quality Guarantee" },
    { icon: Gem, text: "صناعة يدوية", textEn: "Handcrafted" },
    { icon: RefreshCw, text: "إرجاع سهل", textEn: "Easy Returns" },
    { icon: Lock, text: "دفع آمن", textEn: "Secure Payment" },
  ];

  // Fallback static collections if database is empty
  const staticCollections = [
    { name: "Rings", nameAr: "خواتم", coverImage: "/images/category-rings.png", slug: "rings" },
    { name: "Necklaces", nameAr: "قلائد", coverImage: "/images/category-necklaces.png", slug: "necklaces" },
    { name: "Bracelets", nameAr: "أساور", coverImage: "/images/category-bracelets.png", slug: "bracelets" },
    { name: "Earrings", nameAr: "أقراط", coverImage: "/images/category-earrings.png", slug: "earrings" },
    { name: "Heritage", nameAr: "تراث", coverImage: "/images/category-heritage.png", slug: "heritage" },
  ];

  const displayCollections = dbCollections.length > 0 ? dbCollections : staticCollections;

  // Mock reviews for aesthetics
  const reviews = [
    { id: 1, rating: 5, title: "Incredible Craftsmanship", body: "The detail on the pharaonic ring is exquisite. Truly a masterpiece of gold work.", customerName: "Farida K." },
    { id: 2, rating: 5, title: "Pure Elegance", body: "Fast shipping, beautiful packaging, and the bracelet is absolutely stunning. Fits perfectly.", customerName: "Sherif A." },
    { id: 3, rating: 5, title: "Timeless Quality", body: "TAZGA jewelry always tells a story. The heritage necklace has become my daily signature piece.", customerName: "Laila M." }
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="TAZGA Luxury Jewelry" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="md:w-1/2"
          >
            <div dir="rtl" className="mb-6">
              <h1 className="font-arabic text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white mb-4 drop-shadow-2xl">
                {homeSettings.heroTitleAr || "حرفية تمتد"} <br />
                <span className="text-primary italic">{homeSettings.heroSubtitleAr || "عبر الأجيال"}</span>
              </h1>
            </div>
            <p className="font-serif tracking-widest uppercase text-muted-foreground mb-12 text-sm md:text-base border-l border-primary pl-4">
              {homeSettings.heroTitle || "Craftsmanship Across Generations"}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                href={homeSettings.heroButtonLink || "/shop"} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 uppercase tracking-[0.2em] text-sm transition-all duration-300 text-center font-serif"
              >
                {homeSettings.heroButtonText || "Shop Now"}
              </Link>
              <Link 
                href="/collections" 
                className="bg-transparent border border-white/20 hover:border-primary text-white px-10 py-4 uppercase tracking-[0.2em] text-sm transition-all duration-300 text-center font-serif"
              >
                Discover
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-white/5 bg-background/50 backdrop-blur-sm py-8 relative z-20 -mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
            {trustIndicators.map((indicator, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <indicator.icon className="h-6 w-6 stroke-[1.5]" />
                <span className="font-arabic text-sm tracking-wide" dir="rtl">{indicator.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] mb-4">THE COLLECTIONS</h2>
            <div className="w-12 h-[1px] bg-primary mx-auto mb-6"></div>
            <p className="font-arabic text-xl text-muted-foreground" dir="rtl">المجموعات الفاخرة</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayCollections.map((col, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="group relative aspect-[3/4] overflow-hidden block border border-white/5"
              >
                <Link href={`/collections/${col.slug}`}>
                  <img 
                    src={col.coverImage || "/images/category-rings.png"} 
                    alt={col.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100 cursor-pointer"
                  />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity pointer-events-none" />
                <div className="absolute bottom-0 w-full p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none">
                  <h3 className="font-serif text-xl tracking-wider mb-2">{col.name}</h3>
                  <p className="font-arabic text-primary" dir="rtl">{col.nameAr}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Carousel */}
      {featuredProducts.length > 0 && (
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] mb-4">
                  {homeSettings.featuredSectionTitle || "BESTSELLERS"}
                </h2>
                <p className="font-arabic text-xl text-muted-foreground" dir="rtl">الأكثر مبيعاً</p>
              </div>
              <Link href="/shop" className="group flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                View All <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-secondary mb-4 overflow-hidden border border-primary/20">
                    <img 
                      src={product.images?.[0] || "/images/category-rings.png"} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-4">
                      <button 
                        onClick={() => handleToggleWishlist(product)}
                        className={`h-12 w-12 bg-background/80 backdrop-blur-md flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors ${
                          isInWishlist(product.id) ? "text-primary" : ""
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-primary" : ""}`} />
                      </button>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="h-12 flex-1 bg-primary text-primary-foreground font-serif tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4" /> Add
                      </button>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href={`/shop/${product.slug}`} className="font-serif text-lg tracking-wide hover:text-primary transition-colors line-clamp-1 mb-1">
                      {product.name}
                    </Link>
                    <p className="text-primary font-medium tracking-wide">${product.price.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="py-24 md:py-32 bg-secondary/50 relative overflow-hidden">
        <div className="absolute -left-[10%] top-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative aspect-[4/5] overflow-hidden p-4">
                <div className="absolute inset-0 border border-primary/30 m-4" />
                <img 
                  src="/images/workshop.png" 
                  alt="Jewelry Workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2 z-10">
              <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] mb-8 leading-tight">
                {homeSettings.aboutTitle || "CRAFTED WITH HERITAGE"}
              </h2>
              <div className="space-y-6 text-muted-foreground font-light text-lg leading-relaxed mb-12">
                <p>
                  {homeSettings.aboutBody || "Since 1930, TAZGA has preserved the ancient art of Egyptian jewelry making. Each piece is hand-wrought in our Cairo workshop by master artisans whose skills have been passed down through generations."}
                </p>
                <p dir="rtl" className="font-arabic text-xl text-right text-foreground/90 border-r-2 border-primary pr-4">
                  {homeSettings.aboutBodyAr || "منذ عام 1930، حافظت تازجا على فن صناعة المجوهرات المصرية الأصيلة. كل قطعة تصاغ يدوياً في ورشتنا بالقاهرة على أيدي حرفيين مهرة توارثوا هذا الفن عبر الأجيال."}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-8 text-center border-t border-white/10 pt-8">
                <div>
                  <div className="text-3xl font-serif text-primary mb-2">90+</div>
                  <div className="text-xs tracking-widest uppercase text-muted-foreground font-serif">Years</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-primary mb-2">50K+</div>
                  <div className="text-xs tracking-widest uppercase text-muted-foreground font-serif">Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-primary mb-2">20K+</div>
                  <div className="text-xs tracking-widest uppercase text-muted-foreground font-serif">Pieces</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {(!homeSettings || homeSettings.showTestimonials !== false) && (
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.1em] mb-16">CLIENT EXPERIENCES</h2>
            
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {reviews.map((review) => (
                  <div key={review.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4">
                    <div className="bg-secondary/40 border border-white/5 p-8 h-full flex flex-col items-center">
                      <div className="flex gap-1 text-primary mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-primary" : "text-muted"}`} />
                        ))}
                      </div>
                      <h3 className="font-serif text-lg mb-4">{review.title}</h3>
                      <p className="text-muted-foreground font-light text-sm italic mb-8 flex-1 leading-relaxed">
                        "{review.body}"
                      </p>
                      <div className="text-xs tracking-widest uppercase text-foreground/80 font-serif">
                        — {review.customerName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Instagram Gallery */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4 mb-8 text-center">
          <h2 className="font-serif text-2xl tracking-[0.1em] mb-2">@TAZGAJEWELRY</h2>
          <p className="text-muted-foreground text-sm font-serif">Follow us on Instagram</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {["/images/insta-1.png", "/images/insta-2.png", "/images/insta-3.png", "/images/category-rings.png", "/images/category-bracelets.png", "/images/hero.png"].map((img, i) => (
            <a key={i} href="#" className="relative aspect-square overflow-hidden group block">
              <img src={img} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center mix-blend-overlay" />
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-card border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-6 stroke-[1.5]" />
            <h2 className="font-serif text-3xl tracking-[0.1em] mb-4">JOIN THE GALLERY</h2>
            <p className="text-muted-foreground mb-8 font-light">
              Subscribe to receive updates on new collections, exclusive events, and the stories behind our creations.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent border-white/20 h-12 rounded-none focus-visible:ring-primary focus-visible:border-primary text-center sm:text-left font-serif"
              />
              <Button type="submit" disabled={submittingNewsletter} className="h-12 px-8 rounded-none bg-primary text-primary-foreground font-serif tracking-[0.2em] text-xs uppercase hover:bg-primary/90 transition-colors">
                {submittingNewsletter ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}