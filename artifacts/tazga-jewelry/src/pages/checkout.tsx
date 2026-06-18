import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const WHATSAPP_NUMBER = "201112098688"; // +20 11 12098688

function buildWhatsAppMessage(
  formData: { name: string; phone: string; address: string; city: string; notes: string; paymentMethod: string },
  cartItems: { product: { name: string }; quantity: number; price: number }[],
  total: number,
  orderId: string
): string {
  const paymentLabel = formData.paymentMethod === "cash_on_delivery" ? "الدفع عند الاستلام" : "بطاقة ائتمانية";
  const itemsList = cartItems
    .map((i) => `• ${i.product?.name} × ${i.quantity} = ${(i.price * i.quantity).toLocaleString()} ج.م`)
    .join("\n");

  return encodeURIComponent(
    `🛍️ *طلب جديد من موقع TAZGA Jewelry*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔖 رقم الطلب: #${orderId.slice(-6).toUpperCase()}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *بيانات العميل*\n` +
    `الاسم: ${formData.name}\n` +
    `الهاتف: ${formData.phone}\n` +
    `العنوان: ${formData.address}، ${formData.city}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *المنتجات*\n${itemsList}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *الإجمالي: ${total.toLocaleString()} ج.م*\n` +
    `💳 طريقة الدفع: ${paymentLabel}\n` +
    (formData.notes ? `📝 ملاحظات: ${formData.notes}\n` : ``) +
    `━━━━━━━━━━━━━━━━━━━━`
  );
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cart: cartItems, clearCart } = useCart();
  const { toast } = useToast();

  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    paymentMethod: "cash_on_delivery",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setLoading(true);

    try {
      // 1. Save order to Firestore
      const docRef = await addDoc(collection(db, "orders"), {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}`,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        total,
        subtotal,
        shippingCost: shipping,
        status: "pending",
        createdAt: serverTimestamp(),
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.product?.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // 2. Clear cart
      clearCart();
      setOrderId(docRef.id);
      setSuccess(true);
      toast({ title: "تم تقديم الطلب بنجاح!", description: "سيتواصل معك فريق TAZGA قريباً." });

      // 3. Open WhatsApp automatically
      const msg = buildWhatsAppMessage(formData, cartItems, total, docRef.id);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    } catch (err) {
      console.error(err);
      toast({
        title: "فشل تقديم الطلب",
        description: "حدث خطأ أثناء إتمام عملية الشراء. يرجى المحاولة لاحقاً.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open WhatsApp again from success screen
  const openWhatsApp = () => {
    const msg = buildWhatsAppMessage(formData, [], total, orderId);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-500">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="font-serif text-3xl tracking-wider mb-3">تم تأكيد طلبك!</h1>
        <p className="text-muted-foreground mb-2 max-w-md font-arabic">
          شكراً لتسوقك من TAZGA Jewelry. تم إرسال طلبك وسيتواصل معك فريقنا قريباً عبر واتساب.
        </p>
        <p className="text-xs text-muted-foreground mb-8 font-arabic">رقم الطلب: #{orderId.slice(-6).toUpperCase()}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={openWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-8 h-12 font-arabic tracking-wide rounded-none flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            تواصل عبر واتساب
          </Button>
          <Button
            onClick={() => setLocation("/shop")}
            variant="outline"
            className="px-8 h-12 font-serif tracking-[0.2em] text-sm uppercase rounded-none"
          >
            العودة للمتجر
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <button
          onClick={() => setLocation("/cart")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" /> العودة للسلة
        </button>

        <h1 className="font-serif text-3xl tracking-wider mb-12">إتمام الشراء</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
              {/* Contact */}
              <section>
                <h2 className="font-serif text-xl tracking-wider mb-6 pb-2 border-b border-white/10">
                  ١. بيانات التواصل
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-arabic">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-none h-12 bg-secondary/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-arabic">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-none h-12 bg-secondary/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email" className="font-arabic">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-none h-12 bg-secondary/50 border-white/10"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="font-serif text-xl tracking-wider mb-6 pb-2 border-b border-white/10">
                  ٢. عنوان الشحن
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-arabic">العنوان التفصيلي *</Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="rounded-none h-12 bg-secondary/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="font-arabic">المدينة *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="rounded-none h-12 bg-secondary/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-arabic">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="rounded-none resize-none bg-secondary/50 border-white/10"
                      rows={3}
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="font-serif text-xl tracking-wider mb-6 pb-2 border-b border-white/10">
                  ٣. طريقة الدفع
                </h2>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}
                  className="gap-4"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse border border-white/10 p-4 bg-secondary/30 cursor-pointer hover:border-primary/40 transition-colors">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                    <Label htmlFor="cash_on_delivery" className="font-arabic cursor-pointer">الدفع عند الاستلام</Label>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse border border-white/10 p-4 bg-secondary/30 cursor-pointer hover:border-primary/40 transition-colors">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="font-arabic cursor-pointer">بطاقة ائتمانية / مدى</Label>
                  </div>
                </RadioGroup>

                {/* WhatsApp note */}
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-green-400 font-arabic">
                    سيتم إرسال تفاصيل طلبك تلقائياً عبر واتساب لتأكيد الطلب والتواصل معك.
                  </p>
                </div>
              </section>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-secondary p-8 sticky top-24 border border-white/5">
              <h2 className="font-serif text-xl tracking-wider mb-6">ملخص الطلب</h2>

              <div className="space-y-4 mb-6 border-b border-white/10 pb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-background flex-shrink-0">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-serif tracking-wide truncate">{item.product?.name}</p>
                      <p className="text-muted-foreground font-arabic">الكمية: {item.quantity}</p>
                      <p className="mt-1 font-arabic">{(item.price * item.quantity).toLocaleString()} ج.م</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 text-sm font-arabic">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{subtotal.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span>{shipping === 0 ? "مجاني" : `${shipping.toLocaleString()} ج.م`}</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-center">
                <span className="font-serif text-lg tracking-wider">الإجمالي</span>
                <span className="font-serif text-xl text-primary font-arabic">{total.toLocaleString()} ج.م</span>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full h-14 bg-primary text-primary-foreground font-arabic text-base uppercase rounded-none hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> جاري التأكيد...</>
                ) : (
                  <><MessageCircle className="h-5 w-5" /> تأكيد الطلب عبر واتساب</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}