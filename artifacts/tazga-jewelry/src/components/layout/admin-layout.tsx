import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  Megaphone,
  FileText,
  Settings,
  Store,
  ChevronLeft,
  Instagram,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/firebase-auth-context';
import { useLanguage } from '@/lib/language-context';

const navItemsAr = [
  { name: 'لوحة التحكم', nameEn: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'المنتجات', nameEn: 'Products', href: '/admin/products', icon: Package },
  { name: 'المجموعات', nameEn: 'Collections', href: '/admin/collections', icon: Layers },
  { name: 'الفئات', nameEn: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'البنرات', nameEn: 'Banners', href: '/admin/banners', icon: Megaphone },
  { name: 'بنر إنستاجرام', nameEn: 'Instagram Banner', href: '/admin/instagram-banner', icon: Instagram },
  { name: 'محتوى الموقع', nameEn: 'Content', href: '/admin/content', icon: FileText },
  { name: 'مكتبة الوسائط', nameEn: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'الإعدادات', nameEn: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOutUser } = useAuth();
  const { lang, t, dir } = useLanguage();

  const navItems = navItemsAr;

  // Close mobile sidebar on location change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Restore collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-collapsed');
    if (saved !== null) setCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('admin-collapsed', String(collapsed));
  }, [collapsed]);

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location === item.href;
    return location.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-background flex" dir={dir}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : undefined }}
        className={`admin-sidebar fixed lg:sticky top-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-screen bg-card border-${dir === 'rtl' ? 'l' : 'r'} border-border z-50 flex flex-col transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
          ${collapsed ? 'lg:w-16' : 'lg:w-64'}
          w-72`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-border px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link href="/admin" className="font-serif text-base tracking-[0.15em] text-primary">
              TAZGA ADMIN
            </Link>
          )}
          <div className="flex items-center gap-1">
            <button
              className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? (lang === 'ar' ? 'توسيع' : 'Expand') : (lang === 'ar' ? 'طي' : 'Collapse')}
              aria-label={collapsed ? (lang === 'ar' ? 'توسيع' : 'Expand') : (lang === 'ar' ? 'طي' : 'Collapse')}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''} ${dir === 'rtl' ? 'scale-x-[-1]' : ''}`} />
            </button>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <nav className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ${lang === 'ar' ? 'font-arabic' : 'font-sans'} ${
                    active
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  } ${collapsed ? 'justify-center' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/"
            title={collapsed ? (lang === 'ar' ? 'العودة للمتجر' : 'Back to store') : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${lang === 'ar' ? 'font-arabic' : 'font-sans'} ${collapsed ? 'justify-center' : ''}`}
          >
            <Store className="h-4 w-4 flex-shrink-0" />
            {!collapsed && (lang === 'ar' ? 'العودة للمتجر' : 'Back to Store')}
          </Link>
          {user && (
            <button
              onClick={signOutUser}
              title={collapsed ? (lang === 'ar' ? 'تسجيل الخروج' : 'Sign out') : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors ${lang === 'ar' ? 'font-arabic' : 'font-sans'} ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out')}
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <button
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 hidden sm:block">
            <span className="text-sm text-muted-foreground font-serif tracking-widest uppercase">
              {navItems.find((n) => isActive(n))?.name || 'Admin'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* User info */}
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden md:block max-w-[160px] truncate">
                  {user.displayName || user.email}
                </span>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || ''}
                    className="h-8 w-8 rounded-full object-cover border border-border"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {(user.email || 'A')[0].toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="admin-content flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
