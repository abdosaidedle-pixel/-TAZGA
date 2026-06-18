import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { productsService } from '@/lib/services/products.service';
import { categoriesService } from '@/lib/services/categories.service';
import type { Product, Category } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, MoreHorizontal, Edit, Trash2, Package, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { useToast } from '@/hooks/use-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsub = productsService.subscribeAll((data) => {
      setProducts(data);
      setLoading(false);
    });
    categoriesService.getAll().then(setCategories);
    return () => unsub();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameAr?.includes(search) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productsService.delete(deleteTarget.id);
      toast({ title: 'تم حذف المنتج بنجاح' });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'فشل الحذف', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wider mb-1">المنتجات</h1>
          <p className="text-muted-foreground font-arabic">إدارة كتالوج المجوهرات</p>
        </div>
        <Button className="bg-primary text-primary-foreground" asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> منتج جديد
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو SKU..."
            className="pl-9 bg-card border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] bg-card border-border">
            <SelectValue placeholder="كل الفئات" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">كل الفئات</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[70px]">صورة</TableHead>
              <TableHead>المنتج</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>المخزون</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48 mb-2" /><Skeleton className="h-3 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    icon={Package}
                    title="لا توجد منتجات"
                    description={search ? 'لا توجد نتائج لبحثك' : 'ابدأ بإضافة أول منتج لمتجرك'}
                    actionLabel={!search ? 'إضافة منتج' : undefined}
                    onAction={!search ? () => window.location.assign('/admin/products/new') : undefined}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-secondary/20">
                  <TableCell>
                    <div className="h-12 w-12 rounded bg-secondary overflow-hidden border border-border">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-full w-full p-2 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{product.name}</div>
                      {product.isFeatured && <Star className="h-3 w-3 text-primary fill-primary" />}
                    </div>
                    {product.nameAr && <div className="text-xs text-muted-foreground font-arabic" dir="rtl">{product.nameAr}</div>}
                    {product.sku && <div className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</div>}
                  </TableCell>
                  <TableCell className="font-medium">EGP {product.price?.toLocaleString()}</TableCell>
                  <TableCell>{product.inventory ?? 0}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={product.inStock ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}
                    >
                      {product.inStock ? 'متاح' : 'نفذ'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> تعديل
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                          onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="حذف المنتج"
        description={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}