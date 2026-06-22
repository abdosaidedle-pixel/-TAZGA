import { useState, useEffect } from 'react';
import { categoriesService } from '@/lib/services/categories.service';
import type { Category } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Tag, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { CrudDialog } from '@/components/admin/crud-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { ImageUploader } from '@/components/admin/image-uploader';
import { useToast } from '@/hooks/use-toast';

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
}

const EMPTY_FORM = {
  name: '', nameAr: '', slug: '', description: '', descriptionAr: '', coverImage: '', order: 0,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const unsub = categoriesService.subscribeAll((data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, order: categories.length });
    setImageUrls([]);
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditTarget(c);
    setForm({
      name: c.name || '',
      nameAr: c.nameAr || '',
      slug: c.slug || '',
      description: c.description || '',
      descriptionAr: c.descriptionAr || '',
      coverImage: c.coverImage || '',
      order: c.order ?? 0,
    });
    setImageUrls(c.coverImage ? [c.coverImage] : []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast({ title: 'اسم الفئة مطلوب', variant: 'destructive' }); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name), coverImage: imageUrls[0] || form.coverImage };
      if (editTarget) {
        await categoriesService.update(editTarget.id, payload);
        toast({ title: 'تم تحديث الفئة' });
      } else {
        await categoriesService.create(payload);
        toast({ title: 'تم إضافة الفئة' });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: 'حدث خطأ', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await categoriesService.delete(deleteTarget.id);
      toast({ title: 'تم حذف الفئة' });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'فشل الحذف', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const f = (field: string, value: unknown) =>
    setForm((p) => {
      const n = { ...p, [field]: value };
      if (field === 'name') n.slug = slugify(value as string);
      return n;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-wider mb-1">الفئات</h1>
          <p className="text-muted-foreground font-arabic">إدارة فئات المنتجات</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> إضافة فئة
        </Button>
      </div>

      <div className="bg-card border border-border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[70px]">صورة</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[80px]">الترتيب</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Tag} title="لا توجد فئات" description="أضف فئات لتصنيف منتجاتك" actionLabel="إضافة فئة" onAction={openAdd} />
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} className="border-border hover:bg-secondary/20">
                  <TableCell>
                    <div className="h-12 w-12 rounded bg-secondary overflow-hidden border border-border">
                      {cat.coverImage ? (
                        <img src={cat.coverImage} alt={cat.name} className="h-full w-full object-cover" />
                      ) : (
                        <Tag className="h-full w-full p-2.5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{cat.name}</div>
                    {cat.nameAr && <div className="text-xs text-muted-foreground font-arabic" dir="rtl">{cat.nameAr}</div>}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">{cat.slug}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{cat.order ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(cat)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CrudDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editTarget ? 'تعديل الفئة' : 'فئة جديدة'}>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الاسم (إنجليزي) *</Label>
              <Input value={form.name} onChange={(e) => f('name', e.target.value)} className="bg-background" placeholder="Rings" />
            </div>
            <div className="space-y-2">
              <Label>الاسم (عربي)</Label>
              <Input value={form.nameAr} onChange={(e) => f('nameAr', e.target.value)} dir="rtl" className="bg-background font-arabic" placeholder="خواتم" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => f('slug', e.target.value)} className="bg-background font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label>ترتيب العرض</Label>
              <Input type="number" value={form.order} onChange={(e) => f('order', Number(e.target.value))} className="bg-background" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>الوصف (إنجليزي)</Label>
              <Textarea value={form.description} onChange={(e) => f('description', e.target.value)} rows={2} className="bg-background" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>الوصف (عربي)</Label>
              <Textarea value={form.descriptionAr} onChange={(e) => f('descriptionAr', e.target.value)} rows={2} dir="rtl" className="bg-background font-arabic" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>صورة الفئة</Label>
            <ImageUploader images={imageUrls} onChange={setImageUrls} folder="categories" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={submitting} className="bg-primary text-primary-foreground">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />جاري...</> : 'حفظ'}
            </Button>
          </div>
        </div>
      </CrudDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="حذف الفئة"
        description={`هل أنت متأكد من حذف فئة "${deleteTarget?.name}"؟`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}