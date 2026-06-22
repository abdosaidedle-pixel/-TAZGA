import { Link } from "wouter";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";

export default function Cart() {
  const { cart: cartItems, updateCartQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartQuantity(id, quantity);
  };

  const handleRemove = (id: string, name?: string) => {
    removeFromCart(id);
    toast({
      title: t("cart.removed_title"),
      description: `${name || ""} ${t("cart.removed_desc")}`,
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4" dir={dir}>
        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl tracking-wider mb-4">{t("cart.empty_title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">{t("cart.empty_body")}</p>
        <Link
          href="/shop"
          className="bg-primary text-primary-foreground px-8 py-4 font-serif tracking-[0.2em] text-sm uppercase hover:bg-primary/90 transition-colors"
        >
          {t("cart.continue_shopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20" dir={dir}>
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="font-serif text-3xl md:text-4xl tracking-wider mb-12">{t("cart.title")}</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <div className="border-t border-white/10">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 py-8 border-b border-white/10">
                  <div className="cart-item-image w-24 md:w-32 aspect-[3/4] bg-secondary flex-shrink-0">
                    {item.product?.images?.[0] && (
                      <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link href={`/shop/${item.product?.slug}`} className="font-serif text-lg tracking-wide hover:text-primary transition-colors block mb-1">
                          {item.product?.name}
                        </Link>
                        {item.product?.material && (
                          <p className="text-sm text-muted-foreground mb-2">{item.product.material}</p>
                        )}
                        <p className="font-medium">${item.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.product?.name)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2"
                        aria-label={t("cart.removed_title")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-white/20 h-10 w-28">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                        >-</button>
                        <div className="flex-1 flex items-center justify-center text-sm">{item.quantity}</div>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50"
                        >+</button>
                      </div>

                      <div className="font-serif tracking-wide text-right">
                        {t("cart.item_total")}: ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="checkout-summary bg-secondary p-8 border border-white/5 sticky top-24">
              <h2 className="font-serif text-xl tracking-wider mb-6">{t("cart.summary")}</h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("cart.shipping")}</span>
                  <span>{shipping === 0 ? t("cart.shipping_free") : `$${shipping.toLocaleString()}`}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-center">
                <span className="font-serif text-lg tracking-wider">{t("cart.total")}</span>
                <span className="font-serif text-xl">${total.toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full h-14 bg-primary text-primary-foreground flex items-center justify-center gap-2 font-serif tracking-[0.2em] text-sm uppercase hover:bg-primary/90 transition-colors"
              >
                {t("cart.proceed_checkout")}
                <ArrowRight className="h-4 w-4 rtl-flip-x" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>{t("cart.secure_checkout")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
