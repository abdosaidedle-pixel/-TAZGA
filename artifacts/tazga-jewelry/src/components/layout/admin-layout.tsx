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
  Sun,
  Moon,
  ChevronLeft,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/firebase-auth-context';

const navItems = [
  { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'المنتجات', href: '/admin/products', icon: Package },
  { name: 'المجموعات', href: '/admin/collections', icon: Layers },
  { name: 'الفئات', href: '/admin/categories', icon: Tag },
  { name: 'البنرات', href: '/admin/banners', icon: Megaphone },
  { name: 'محتوى الموقع', href: '/admin/content', icon: FileText },
  { name: 'مكتبة الوسائط', href: '/admin/media', icon: ImageIcon },
  { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { user, signOutUser } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('admin-dark-mode');
    if (saved !== null) setDarkMode(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('admin-dark-mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location === item.href;
    return location.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : undefined }}
        className={`fixed md:sticky top-0 left-0 h-screen bg-card border-r border-border z-50 flex flex-col transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-16' : 'md:w-64'}
          w-64`}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center border-b border-border px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link href="/admin" className="font-serif text-lg tracking-[0.15em] text-primary">
              TAZGA ADMIN
            </Link>
          )}
          <div className="flex items-center gap-1">
            <button
              className="hidden md:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'توسيع' : 'طي'}
            >
              <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 font-arabic ${
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
            title={collapsed ? 'العودة للمتجر' : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors font-arabic ${collapsed ? 'justify-center' : ''}`}
          >
            <Store className="h-4 w-4 flex-shrink-0" />
            {!collapsed && 'العودة للمتجر'}
          </Link>
          {user && (
            <button
              onClick={signOutUser}
              title={collapsed ? 'تسجيل الخروج' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors font-arabic ${collapsed ? 'justify-center' : ''}`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && 'تسجيل الخروج'}
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title={darkMode ? 'وضع النهار' : 'وضع الليل'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User info */}
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block max-w-[160px] truncate">
                  {user.displayName || user.email}
                </span>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || ''}
                    className="h-8 w-8 rounded-full object-cover border border-border"
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
