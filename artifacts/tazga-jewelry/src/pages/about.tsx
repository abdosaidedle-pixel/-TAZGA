import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Intro */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="font-serif text-4xl md:text-6xl tracking-wider mb-6">OUR HERITAGE</h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-8"></div>
          <p className="font-arabic text-2xl text-primary mb-8 leading-relaxed" dir="rtl">
            تازجا.. إرث من الحرفية والإبداع يمتد منذ عام ١٩٣٠
          </p>
          <div className="text-muted-foreground font-light text-lg leading-relaxed space-y-6">
            <p>
              TAZGA Jewelry (Hiba Gebali for Jewelry) is an Egyptian luxury handmade brand deeply rooted in Ancient Egyptian civilization and Oriental artistic heritage.
            </p>
            <p>
              For over nine decades, we have been crafting timeless pieces that transcend fashion trends, offering our clients not just jewelry, but wearable art that carries a profound cultural identity.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[4/5] bg-secondary p-4 relative"
          >
            <div className="absolute inset-0 border border-primary/20 m-4" />
            <img src="/images/workshop.png" alt="TAZGA Workshop" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl tracking-wider mb-6">THE WORKSHOP</h2>
            <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
              <p>
                Every TAZGA creation begins its life in our Cairo workshop. Here, master artisans employ techniques passed down through generations, working with precious metals and stones to breathe life into designs inspired by our rich history.
              </p>
              <p>
                We believe that true luxury lies in the details. The gentle curve of a ring, the precise setting of a gemstone, the perfect polish of gold—these are the hallmarks of TAZGA craftsmanship.
              </p>
              <p dir="rtl" className="font-arabic text-xl text-right mt-8 border-r-2 border-primary pr-6">
                كل قطعة من مجوهرات تازجا تبدأ رحلتها في ورشتنا بالقاهرة. هنا، يستخدم أمهر الحرفيين تقنيات متوارثة عبر الأجيال، ليعطوا الحياة لتصاميم مستوحاة من تاريخنا العريق.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-y border-white/10 py-16">
          <div>
            <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">CULTURAL IDENTITY</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Designs that echo the grandeur of Ancient Egypt and the intricate beauty of Oriental art.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">HANDCRAFTED</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              100% handmade by master jewelers, ensuring that no two pieces are exactly alike.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl tracking-wider mb-4 text-primary">MUSEUM QUALITY</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Exquisite finishing and presentation that elevates each piece to the status of art.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}