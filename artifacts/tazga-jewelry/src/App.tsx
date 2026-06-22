import { Switch, Route, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/lib/firebase-auth-context';
import { ProtectedRoute } from '@/components/admin/protected-route';
import NotFound from '@/pages/not-found';
import { StoreLayout } from '@/components/layout/store-layout';
import { AdminLayout } from '@/components/layout/admin-layout';
import { LanguageProvider } from '@/lib/language-context';
import { ThemeProvider } from '@/lib/theme-context';

// React Query client with sensible defaults for e-commerce
// Note: Most data uses Firestore onSnapshot (real-time) via useRealtimeData hook
// React Query is used for ad-hoc queries and mutations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refresh data when user refocuses the tab (e.g., after switching back from admin)
      refetchOnWindowFocus: true,
      // Refresh when network reconnects
      refetchOnReconnect: true,
      // Keep data fresh for 30 seconds
      staleTime: 30 * 1000,
      // Cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Don't retry on 4xx errors
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});

import Home from '@/pages/home';
import Shop from '@/pages/shop';
import ProductDetail from '@/pages/product-detail';
import Cart from '@/pages/cart';
import Wishlist from '@/pages/wishlist';
import Collections from '@/pages/collections';
import CollectionDetail from '@/pages/collection-detail';
import Checkout from '@/pages/checkout';
import About from '@/pages/about';
import Contact from '@/pages/contact';

import AdminLogin from '@/pages/admin/login';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminProducts from '@/pages/admin/products';
import AdminProductForm from '@/pages/admin/product-form';
import AdminCollections from '@/pages/admin/collections';
import AdminCategories from '@/pages/admin/categories';
import AdminBanners from '@/pages/admin/banners';
import AdminMedia from '@/pages/admin/media';
import AdminWebsiteContent from '@/pages/admin/website-content';
import AdminSettings from '@/pages/admin/settings';
import AdminInstagramBanner from '@/pages/admin/instagram-banner';

import { CartProvider } from '@/lib/cart-context';

function AdminRouter() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products/new" component={AdminProductForm} />
          <Route path="/admin/products/:id/edit" component={AdminProductForm} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/collections" component={AdminCollections} />
          <Route path="/admin/categories" component={AdminCategories} />
          <Route path="/admin/banners" component={AdminBanners} />
          <Route path="/admin/media" component={AdminMedia} />
          <Route path="/admin/content" component={AdminWebsiteContent} />
          <Route path="/admin/settings" component={AdminSettings} />
          <Route path="/admin/instagram-banner" component={AdminInstagramBanner} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    </ProtectedRoute>
  );
}

function StoreRouter() {
  return (
    <StoreLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/shop/:slug" component={ProductDetail} />
        <Route path="/collections" component={Collections} />
        <Route path="/collections/:slug" component={CollectionDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </StoreLayout>
  );
}

function Router() {
  const [location] = useLocation();
  if (location === '/admin/login') return <AdminLogin />;
  const isAdmin = location === '/admin' || location.startsWith('/admin/');
  return isAdmin ? <AdminRouter /> : <StoreRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <TooltipProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                  <Router />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
