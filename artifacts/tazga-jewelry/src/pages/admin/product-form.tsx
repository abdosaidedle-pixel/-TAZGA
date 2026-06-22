import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { productsService } from '@/lib/services/products.service';
import { categoriesService } from '@/lib/services/categories.service';
import { collectionsService } from '@/lib/services/collections.service';
import type { Category, Collection } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUploader } from '@/components/admin/image-uploader';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = !!id && id !== 'new';
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  const [form, setForm] = useState({
    name: '',
    nameAr: '',
    slug: '',
    price: '',
    inventory: '1',
    sku: '',
    categoryId: 'none',
    collectionId: 'none',
    description: '',
    descriptionAr: '',
    material: '',
    tags: '',
    images: [] as string[],
    isFeatured: false,
    inStock: true,
  });

  useEffect(() => {
    categoriesService.getAll().then(setCategories);
    collectionsService.getAll().then(setCollections);
    if (isEditing) {
      productsService.getById(id!).then((product) => {
        if (product) {
          setForm({
            name: product.name || '',
            nameAr: product.nameAr || '',
            slug: product.slug || '',
            price: product.price?.toString() || '',
            inventory: product.inventory?.toString() || '1',
            sku: product.sku || '',
            categoryId: product.categoryId || 'none',
            collectionId: product.collectionId || 'none',
            description: product.description || '',
            descriptionAr: product.descriptionAr || '',
            material: product.material || '',
            tags: (product.tags || []).join(', '),
            images: product.images || [],
            isFeatured: product.isFeatured || false,
            inStock: product.inStock !== false,
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  const set = (field: string, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !isEditing) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast({ title: 'اسم المنتج مطلوب', variant: 'destructive' }); return; }
    if (!form.price) { toast({ title: 'السعر مطلوب', variant: 'destructive' }); return; }
    if (form.images.length === 0) { toast({ title: 'يجب إضافة صورة واحدة على الأقل', variant: 'destructive' }); return; }

    setSubmitting(true);
    const payload = {
      name: form.name,
      nameAr: form.nameAr,
      slug: form.slug || slugify(form.name),
      price: Number(form.price),
      inventory: Number(form.inventory),
      sku: form.sku,
      categoryId: form.categoryId === 'none' ? '' : form.categoryId,
      collectionId: form.collectionId === 'none' ? '' : form.collectionId,
      description: form.description,
      descriptionAr: form.descriptionAr,
      material: form.material,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      images: form.images,
      isFeatured: form.isFeatured,
      inStock: form.inStock,
    };

    try {
      if (isEditing) {
        await productsService.update(id!, payload);
        toast({ title: 'تم تحديث المنتج بنجاح' });
      } else {
        await productsService.create(payload);
        toast({ title: 'تم إنشاء المنتج بنجاح' });
      }
      setLocation('/admin/products');
    } catch (err) {
      toast({ title: 'حدث خطأ', description: String(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-serif tracking-wider">
          {isEditing ? 'تعديل المنتج' : 'منتج جديد'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-card border border-border rounded-md">
          <h2 className="col-span-full text-base font-medium text-muted-foreground border-b border-border pb-2 mb-2">المعلومات الأساسية</h2>
          <div className="space-y-2">
            <Label htmlFor="name">الاسم (إنجليزي) *</Label>
            <Input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameAr">الاسم (عربي)</Label>
            <Input id="nameAr" value={form.nameAr} onChange={(e) => set('nameAr', e.target.value)} dir="rtl" className="bg-background font-arabic" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">السعر (EGP) *</Label>
            <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">كود المنتج (SKU)</Label>
            <Input id="sku" value={form.sku} onChange={(e) => set('sku', e.target.value)} className="bg-background" placeholder="TZ-001" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} className="bg-background font-mono text-sm" placeholder="product-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">الخامة</Label>
            <Input id="material" value={form.material} onChange={(e) => set('material', e.target.value)} className="bg-background" placeholder="ذهب عيار 18" />
          </div>
          <div className="space-y-2">
            <Label>الفئة</Label>
            <Select value={form.categoryId} onValueChange={(v) => set('categoryId', v)}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="اختر الفئة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون فئة</SelectItem>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>المجموعة</Label>
            <Select value={form.collectionId} onValueChange={(v) => set('collectionId', v)}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="اختر المجموعة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون مجموعة</SelectItem>
                {collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full space-y-2">
            <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
            <Input id="tags" value={form.tags} onChange={(e) => set('tags', e.target.value)} className="bg-background" placeholder="خاتم, ذهب, مميز" />
          </div>
        </section>

        {/* Images */}
        <section className="p-6 bg-card border border-border rounded-md space-y-4">
          <div>
            <Label className="text-base font-medium">صور المنتج *</Label>
            <p className="text-xs text-muted-foreground mt-1">الصورة الأولى هي الصورة الرئيسية</p>
          </div>
          <ImageUploader images={form.images} onChange={(imgs) => set('images', imgs)} folder="products" />
        </section>

        {/* Description */}
        <section className="p-6 bg-card border border-border rounded-md space-y-5">
          <h2 className="text-base font-medium text-muted-foreground border-b border-border pb-2">الوصف</h2>
          <div className="space-y-2">
            <Label htmlFor="description">الوصف (إنجليزي)</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
            <Textarea id="descriptionAr" rows={4} value={form.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)} dir="rtl" className="bg-background font-arabic" />
          </div>
        </section>

        {/* Inventory */}
        <section className="p-6 bg-card border border-border rounded-md space-y-5">
          <h2 className="text-base font-medium text-muted-foreground border-b border-border pb-2">المخزون والحالة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="inventory">الكمية المتاحة</Label>
              <Input id="inventory" type="number" min="0" value={form.inventory} onChange={(e) => set('inventory', e.target.value)} className="bg-background" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <Switch id="inStock" checked={form.inStock} onCheckedChange={(c) => set('inStock', c)} />
              <Label htmlFor="inStock">متاح للبيع</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="isFeatured" checked={form.isFeatured} onCheckedChange={(c) => set('isFeatured', c)} />
              <Label htmlFor="isFeatured">منتج مميز (يظهر في الصفحة الرئيسية)</Label>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => setLocation('/admin/products')}>إلغاء</Button>
          <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground min-w-[140px]">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : <><Save className="mr-2 h-4 w-4" /> حفظ المنتج</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
