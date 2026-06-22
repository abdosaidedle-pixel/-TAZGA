import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Layers,
  Tag,
  Megaphone,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  FileText,
  CheckCircle2,
  XCircle,
  Star,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { productsService } from '@/lib/services/products.service';
import { categoriesService } from '@/lib/services/categories.service';
import { collectionsService } from '@/lib/services/collections.service';
import { bannersService } from '@/lib/services/banners.service';
import { mediaService } from '@/lib/services/media.service';
import type { Product, Banner } from '@/lib/types';

interface Stats {
  products: number;
  categories: number;
  collections: number;
  banners: number;
  media: number;
  featuredProducts: number;
  activeBanners: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [products, categories, collections, allBanners, media] = await Promise.all([
          productsService.getAll({ pageSize: 50 }),
          categoriesService.getAll(),
          collectionsService.getAll(),
          bannersService.getAll(),
          mediaService.getAll(),
        ]);

        setStats({
          products: products.length,
          categories: categories.length,
          collections: collections.length,
          banners: allBanners.length,
          media: media.length,
          featuredProducts: products.filter((p) => p.isFeatured).length,
          activeBanners: allBanners.filter((b) => b.isActive).length,
        });
        setRecentProducts(products.slice(0, 5));
        setBanners(allBanners);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const statCards = [
    { label: 'المنتجات', value: stats?.products, icon: Package, href: '/admin/products', color: 'text-blue-400' },
    { label: 'المجموعات', value: stats?.collections, icon: Layers, href: '/admin/collections', color: 'text-purple-400' },
    { label: 'الفئات', value: stats?.categories, icon: Tag, href: '/admin/categories', color: 'text-green-400' },
    { label: 'البنرات', value: stats?.banners, icon: Megaphone, href: '/admin/banners', color: 'text-primary' },
    { label: 'الوسائط', value: stats?.media, icon: ImageIcon, href: '/admin/media', color: 'text-orange-400' },
  ];

  const quickActions = [
    { label: 'منتج جديد', href: '/admin/products/new', icon: Package },
    { label: 'بنر جديد', href: '/admin/banners', icon: Megaphone },
    { label: 'مجموعة جديدة', href: '/admin/collections', icon: Layers },
    { label: 'تعديل الصفحة الرئيسية', href: '/admin/content', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif tracking-wider mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground font-arabic">مرحباً — إدارة محتوى متجر تازجا</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200 cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground font-arabic">{card.label}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">{card.value ?? 0}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-serif tracking-wide">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Button
                key={a.href}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 border-border hover:border-primary/50 hover:bg-primary/5 font-arabic"
                asChild
              >
                <Link href={a.href}>
                  <a.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm">{a.label}</span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Content Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-serif tracking-wide">حالة المحتوى</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
            ) : (
              [
                {
                  label: 'منتجات مميزة',
                  value: stats?.featuredProducts,
                  total: stats?.products,
                  ok: (stats?.featuredProducts ?? 0) > 0,
                },
                {
                  label: 'بنرات نشطة',
                  value: stats?.activeBanners,
                  total: stats?.banners,
                  ok: (stats?.activeBanners ?? 0) > 0,
                },
                {
                  label: 'مجموعات',
                  value: stats?.collections,
                  total: null,
                  ok: (stats?.collections ?? 0) > 0,
                },
                {
                  label: 'فئات',
                  value: stats?.categories,
                  total: null,
                  ok: (stats?.categories ?? 0) > 0,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    {item.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm font-arabic">{item.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.value}{item.total != null ? ` / ${item.total}` : ''}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif tracking-wide">أحدث المنتجات</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/admin/products">
              عرض الكل <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentProducts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground font-arabic">لا توجد منتجات بعد</p>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden border border-border flex-shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-full w-full p-2 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">EGP {product.price?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {product.isFeatured && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                        <Star className="h-2.5 w-2.5 mr-1" /> مميز
                      </Badge>
                    )}
                    <Badge variant="outline" className={product.inStock ? 'bg-green-500/10 text-green-500 border-green-500/20 text-xs' : 'bg-red-500/10 text-red-500 border-red-500/20 text-xs'}>
                      {product.inStock ? 'متاح' : 'نفذ'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}