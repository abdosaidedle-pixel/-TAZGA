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
  TrendingUp,
  Settings,
  Instagram,
  ShoppingBag,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { productsService } from '@/lib/services/products.service';
import { categoriesService } from '@/lib/services/categories.service';
import { collectionsService } from '@/lib/services/collections.service';
import { bannersService } from '@/lib/services/banners.service';
import { mediaService } from '@/lib/services/media.service';
import { useRealtimeDataWithDefault } from '@/hooks/use-realtime-data';
import { useLanguage } from '@/lib/language-context';
import type { Product, Category, Collection, Banner, MediaFile } from '@/lib/types';

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  // ─── Real-time subscriptions: dashboard always reflects current state ───
  const { data: products, loading: loadingProducts } = useRealtimeDataWithDefault<Product[]>(
    (cb) => productsService.subscribeAll(cb),
    [],
    []
  );

  const { data: categories, loading: loadingCategories } = useRealtimeDataWithDefault<Category[]>(
    (cb) => categoriesService.subscribeAll(cb),
    [],
    []
  );

  const { data: collections, loading: loadingCollections } = useRealtimeDataWithDefault<Collection[]>(
    (cb) => collectionsService.subscribeAll(cb),
    [],
    []
  );

  const { data: banners, loading: loadingBanners } = useRealtimeDataWithDefault<Banner[]>(
    (cb) => bannersService.subscribeAll(cb),
    [],
    []
  );

  const { data: media, loading: loadingMedia } = useRealtimeDataWithDefault<MediaFile[]>(
    (cb) => mediaService.subscribeAll(cb),
    [],
    []
  );

  const loading = loadingProducts || loadingCategories || loadingCollections || loadingBanners || loadingMedia;

  // ─── Computed stats (always fresh, derived from subscriptions) ───
  const stats = {
    products: products.length,
    categories: categories.length,
    collections: collections.length,
    banners: banners.length,
    media: media.length,
    featuredProducts: products.filter((p) => p.isFeatured).length,
    inStockProducts: products.filter((p) => p.inStock).length,
    outOfStockProducts: products.filter((p) => !p.inStock).length,
    activeBanners: banners.filter((b) => b.isActive).length,
  };

  const recentProducts = [...products]
    .sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt as any).getTime() || 0;
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt as any).getTime() || 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  // ─── Stat cards (5 main KPIs) ───
  const statCards = [
    { label: isAr ? 'المنتجات' : 'Products', value: stats.products, icon: Package, href: '/admin/products', color: 'text-blue-500' },
    { label: isAr ? 'المجموعات' : 'Collections', value: stats.collections, icon: Layers, href: '/admin/collections', color: 'text-purple-500' },
    { label: isAr ? 'الفئات' : 'Categories', value: stats.categories, icon: Tag, href: '/admin/categories', color: 'text-green-500' },
    { label: isAr ? 'البنرات' : 'Banners', value: stats.banners, icon: Megaphone, href: '/admin/banners', color: 'text-primary' },
    { label: isAr ? 'الوسائط' : 'Media', value: stats.media, icon: ImageIcon, href: '/admin/media', color: 'text-orange-500' },
  ];

  // ─── Quick actions (everything the admin can do) ───
  const quickActions = [
    { label: isAr ? 'منتج جديد' : 'New Product', href: '/admin/products/new', icon: Package },
    { label: isAr ? 'بنر جديد' : 'New Banner', href: '/admin/banners', icon: Megaphone },
    { label: isAr ? 'مجموعة جديدة' : 'New Collection', href: '/admin/collections', icon: Layers },
    { label: isAr ? 'فئة جديدة' : 'New Category', href: '/admin/categories', icon: Tag },
    { label: isAr ? 'محتوى الصفحة الرئيسية' : 'Homepage Content', href: '/admin/content', icon: FileText },
    { label: isAr ? 'بنر إنستجرام' : 'Instagram Banner', href: '/admin/instagram-banner', icon: Instagram },
    { label: isAr ? 'رفع وسائط' : 'Upload Media', href: '/admin/media', icon: ImageIcon },
    { label: isAr ? 'الإعدادات' : 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // ─── Content health checks ───
  const healthChecks = [
    {
      label: isAr ? 'منتجات مميزة' : 'Featured Products',
      value: stats.featuredProducts,
      total: stats.products,
      ok: stats.featuredProducts > 0,
    },
    {
      label: isAr ? 'منتجات متاحة' : 'In-Stock Products',
      value: stats.inStockProducts,
      total: stats.products,
      ok: stats.inStockProducts > 0,
    },
    {
      label: isAr ? 'بنرات نشطة' : 'Active Banners',
      value: stats.activeBanners,
      total: stats.banners,
      ok: stats.activeBanners > 0,
    },
    {
      label: isAr ? 'مجموعات' : 'Collections',
      value: stats.collections,
      total: null,
      ok: stats.collections > 0,
    },
    {
      label: isAr ? 'فئات' : 'Categories',
      value: stats.categories,
      total: null,
      ok: stats.categories > 0,
    },
    {
      label: isAr ? 'مكتبة الوسائط' : 'Media Library',
      value: stats.media,
      total: null,
      ok: stats.media > 0,
    },
  ];

  // ─── Inventory warnings ───
  const outOfStockProducts = products.filter((p) => !p.inStock);
  const lowFeaturedWarning = stats.featuredProducts === 0 && stats.products > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif tracking-wider mb-2">
          {isAr ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {isAr
            ? 'مرحباً — إدارة محتوى متجر تازجا. كل تعديلاتك تظهر فوراً للعملاء.'
            : "Welcome — manage TAZGA store content. All your edits appear instantly to customers."}
        </p>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>{isAr ? 'متصل — التحديثات الفورية مفعّلة' : 'Live — real-time updates enabled'}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="bg-card border-border hover:border-primary/30 transition-all duration-200 cursor-pointer group h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                {loading ? (
                  <Skeleton className="h-7 sm:h-8 w-12 sm:w-16" />
                ) : (
                  <div className="text-xl sm:text-2xl font-bold">{card.value}</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Inventory Warnings */}
      {(outOfStockProducts.length > 0 || lowFeaturedWarning) && (
        <Card className="bg-amber-500/5 border-amber-500/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-serif tracking-wide flex items-center gap-2">
              <XCircle className="h-4 w-4 text-amber-500" />
              {isAr ? 'تنبيهات المخزون' : 'Inventory Warnings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
            {lowFeaturedWarning && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                {isAr
                  ? '⚠️ لا توجد منتجات مميزة. أضف منتجات مميزة لتظهر في الصفحة الرئيسية.'
                  : '⚠️ No featured products. Add featured products to display them on the homepage.'}
              </div>
            )}
            {outOfStockProducts.length > 0 && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                {isAr
                  ? `⚠️ ${outOfStockProducts.length} منتج نفذ من المخزون.`
                  : `⚠️ ${outOfStockProducts.length} product(s) out of stock.`}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions + Content Health */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-serif tracking-wide">
              {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 grid grid-cols-2 gap-2 sm:gap-3">
            {quickActions.map((a) => (
              <Button
                key={a.href}
                variant="outline"
                className="h-auto py-3 sm:py-4 flex flex-col gap-1.5 sm:gap-2 border-border hover:border-primary/50 hover:bg-primary/5"
                asChild
              >
                <Link href={a.href}>
                  <a.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-xs sm:text-sm text-center leading-tight">{a.label}</span>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Content Health */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg font-serif tracking-wide">
              {isAr ? 'حالة المحتوى' : 'Content Health'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
            {loading ? (
              Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
            ) : (
              healthChecks.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm truncate">{item.label}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0 ml-2">
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
        <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg font-serif tracking-wide">
            {isAr ? 'أحدث المنتجات' : 'Recent Products'}
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/admin/products">
              {isAr ? 'عرض الكل' : 'View All'} <ArrowRight className="h-3.5 w-3.5 rtl-flip-x" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {isAr ? 'لا توجد منتجات بعد. ابدأ بإضافة منتج جديد.' : 'No products yet. Start by adding a new product.'}
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4" /> {isAr ? 'إضافة منتج' : 'Add Product'}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden border border-border flex-shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-full w-full p-2 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {isAr ? 'ج.م' : 'EGP'} {product.price?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {product.isFeatured && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs hidden sm:flex">
                        <Star className="h-2.5 w-2.5 mr-1" /> {isAr ? 'مميز' : 'Featured'}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        product.inStock
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}
                    >
                      {product.inStock ? (isAr ? 'متاح' : 'In Stock') : (isAr ? 'نفذ' : 'Out')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Store + Customer-facing preview */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button asChild variant="outline" className="flex-1 h-12">
          <Link href="/">
            <Eye className="h-4 w-4" />
            {isAr ? 'معاينة المتجر' : 'View Store'}
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 h-12">
          <Link href="/shop">
            <ShoppingBag className="h-4 w-4" />
            {isAr ? 'معاينة المتجر' : 'View Shop'}
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 h-12">
          <Link href="/collections">
            <Sparkles className="h-4 w-4" />
            {isAr ? 'معاينة المجموعات' : 'View Collections'}
          </Link>
        </Button>
      </div>

      {/* Help text */}
      <div className="text-center text-xs text-muted-foreground pb-4">
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <TrendingUp className="h-3.5 w-3.5" />
          {isAr
            ? 'كل التعديلات التي تجريها هنا تظهر فوراً لجميع زوار الموقع بفضل التحديثات الفورية.'
            : 'All your edits appear instantly to all site visitors thanks to real-time updates.'}
        </p>
      </div>
    </div>
  );
}
