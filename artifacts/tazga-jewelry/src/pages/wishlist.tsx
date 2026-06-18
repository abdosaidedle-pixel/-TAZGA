import { Link } from "wouter";
import { useCart } from "@/lib/cart-context";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

export default function Wishlist() {
  const { wishlist: wishlistItems, removeFromWishlist, addToCart } = useCart();
  const { toast } = useToast();

  const handleRemove = (id: string) => {
    removeFromWishlist(id);
    toast({ title: "تمت الإزالة من قائمة الرغبات" });
  };

  const handleMoveToCart = (product: Product) => {
    if (!product.inStock) {
      toast({
        title: "القطعة غير متوفرة",
        description: "عذراً، هذه القطعة غير متوفرة في المخزن حالياً.",
        variant: "destructive"
      });
      return;
    }
    
    addToCart(product, 1);
    removeFromWishlist(product.id);
    toast({ title: "تمت إضافة القطعة لحقيبة التسوق" });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl tracking-wider mb-4">YOUR WISHLIST IS EMPTY</h1>
        <p className="text-muted-foreground mb-8 max-w-md">Save your favorite pieces here to easily find them later or share with someone special.</p>
        <Link 
          href="/shop" 
          className="bg-primary text-primary-foreground px-8 py-4 font-serif tracking-[0.2em] text-sm uppercase hover:bg-primary/90 transition-colors"
        >
          Discover Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="font-serif text-3xl md:text-4xl tracking-wider mb-2">MY WISHLIST</h1>
        <p className="text-muted-foreground mb-12">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {wishlistItems.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="relative aspect-[3/4] bg-secondary mb-4 overflow-hidden">
                <Link href={`/shop/${product.slug}`}>
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                  )}
                </Link>
                
                <button 
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-4 right-4 h-8 w-8 bg-background/80 rounded-full flex items-center justify-center hover:text-destructive transition-colors backdrop-blur-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    className="w-full h-10 bg-primary/90 backdrop-blur-md text-primary-foreground text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    MOVE TO BAG
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-start gap-4">
                <Link href={`/shop/${product.slug}`} className="flex-1">
                  <h3 className="font-serif text-lg tracking-wide hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <p className="font-arabic text-sm text-muted-foreground" dir="rtl">{product.nameAr}</p>
                </Link>
                <div className="text-right">
                  <p className="text-primary font-medium tracking-wide">
                    ${product.price.toLocaleString()}
                  </p>
                  {!product.inStock && (
                    <p className="text-xs text-destructive mt-1">Out of stock</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}