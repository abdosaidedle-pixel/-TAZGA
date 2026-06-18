import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { collectionsService } from "@/lib/services/collections.service";
import type { Collection } from "@/lib/types";

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await collectionsService.getAll();
        setCollections(data);
      } catch (err) {
        console.error("Error loading collections:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 font-serif">
          <h1 className="text-4xl md:text-5xl tracking-wider mb-4">OUR COLLECTIONS</h1>
          <div className="w-12 h-[1px] bg-primary mx-auto mb-6"></div>
          <p className="font-arabic text-xl text-muted-foreground" dir="rtl">المجموعات الحصرية</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="aspect-[16/9] w-full" />
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, idx) => (
              <motion.div 
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group block relative aspect-[4/3] md:aspect-[16/9] overflow-hidden bg-secondary border border-white/5"
              >
                <Link href={`/collections/${collection.slug}`}>
                  {collection.coverImage ? (
                    <img 
                      src={collection.coverImage} 
                      alt={collection.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100 cursor-pointer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary cursor-pointer">
                      <span className="font-serif tracking-wider text-muted-foreground">No Image</span>
                    </div>
                  )}
                </Link>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 pointer-events-none" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                  <h2 className="font-serif text-3xl md:text-4xl tracking-wider mb-2">{collection.name}</h2>
                  <p className="font-arabic text-xl text-primary mb-4" dir="rtl">{collection.nameAr}</p>
                  <div className="overflow-hidden">
                    <span className="inline-block transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 font-serif tracking-[0.2em] text-sm uppercase text-white border-b border-primary pb-1">
                      Explore Collection
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground font-arabic">
            لا توجد مجموعات متاحة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}