import { useState, useEffect } from 'react';
import { bannersService } from '@/lib/services/banners.service';
import type { Banner } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Megaphone, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { CrudDialog } from '@/components/admin/crud-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { ImageUploader } from '@/components/admin/image-uploader';
import { useToast } from '@/hooks/use-toast';

const EMPTY_FORM = {
  title: '', titleAr: '', subtitle: '', subtitleAr: '',
  description: '', descriptionAr: '',
  imageUrl: '', buttonText: '', buttonTextAr: '', buttonLink: '',
  isActive: true, displayOrder: 0,
};

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const unsub = bannersService.subscribeAll((data) => {
      setBanners(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, displayOrder: banners.length });
    setImageUrls([]);
    setDialogOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditTarget(b);
    setForm({
      title: b.title || '', titleAr: b.titleAr || '',
      subtitle: b.subtitle || '', subtitleAr: b.subtitleAr || '',
      description: b.description || '', descriptionAr: b.descriptionAr || '',
      imageUrl: b.imageUrl || '',
      buttonText: b.buttonText || '', buttonTextAr: b.buttonTextAr || '',
      buttonLink: b.buttonLink || '',
      isActive: b.isActive !== false,
      displayOrder: b.displayOrder ?? 0,
    });
    setImageUrls(b.imageUrl ? [b.imageUrl] : []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast({ title: 'عنوان البنر مطلوب', variant: 'destructive' }); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, imageUrl: imageUrls[0] || form.imageUrl };
      if (editTarget) {
        await bannersService.update(editTarget.id, payload);
        toast({ title: 'تم تحديث البنر' });
      } else {
        await bannersService.create(payload);
        toast({ title: 'تم إضافة البنر' });
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
      await bannersService.delete(deleteTarget.id);
      toast({ title: 'تم حذف البنر' });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'فشل الحذف', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const moveOrder = async (banner: Banner, dir: 1 | -1) => {
    const newOrder = (banner.displayOrder ?? 0) + dir;
    await bannersService.update(banner.id, { displayOrder: newOrder });
  };

  const f = (field: string, value: unknown) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif tracking-wider mb-1">البنرات</h1>
          <p className="text-muted-foreground font-arabic">إدارة بنرات الصفحة الرئيسية</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> إضافة بنر
        </Button>
      </div>

      <div className="bg-card border border-border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[130px]">الصورة</TableHead>
              <TableHead>المحتوى</TableHead>
              <TableHead className="w-[80px]">الترتيب</TableHead>
              <TableHead className="w-[80px]">الحالة</TableHead>
              <TableHead className="text-right w-[120px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i} className="border-border">
                  <TableCell><Skeleton className="h-16 w-24 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48 mb-2" /><Skeleton className="h-3 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : banners.length === 0 ? (
              <TableRow><TableCell colSpan={5}>
                <EmptyState icon={Megaphone} title="لا توجد بنرات" description="أضف بنراً ليظهر في صفحة المتجر الرئيسية" actionLabel="إضافة بنر" onAction={openAdd} />
              </TableCell></TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id} className="border-border hover:bg-secondary/20">
                  <TableCell>
                    <div className="h-16 w-24 rounded bg-secondary overflow-hidden border border-border">
                      {banner.imageUrl ? (
                        <img src={banner.imageUrl} alt={banner.title} className="h-full w-full object-cover" />
                      ) : (
                        <Megaphone className="h-full w-full p-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{banner.title}</div>
                    {banner.titleAr && <div className="text-xs text-muted-foreground font-arabic" dir="rtl">{banner.titleAr}</div>}
                    {banner.subtitle && <div className="text-xs text-muted-foreground mt-1">{banner.subtitle}</div>}
                    {banner.buttonLink && <div className="text-xs text-primary mt-1 truncate max-w-xs">{banner.buttonLink}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-center">
                      <button onClick={() => moveOrder(banner, -1)} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <span className="text-xs text-center text-muted-foreground">{banner.displayOrder}</span>
                      <button onClick={() => moveOrder(banner, 1)} className="text-muted-foreground hover:text-foreground transition-colors"><ArrowDown className="h-3.5 w-3.5" /></button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={banner.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'text-muted-foreground'}>
                      {banner.isActive ? 'نشط' : 'مخفي'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(banner)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(banner)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <CrudDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editTarget ? 'تعديل البنر' : 'إضافة بنر جديد'}
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>العنوان (إنجليزي) *</Label>
              <Input value={form.title} onChange={(e) => f('title', e.target.value)} className="bg-background" placeholder="Summer Collection" />
            </div>
            <div className="space-y-2">
              <Label>العنوان (عربي)</Label>
              <Input value={form.titleAr} onChange={(e) => f('titleAr', e.target.value)} dir="rtl" className="bg-background font-arabic" placeholder="مجموعة الصيف" />
            </div>
            <div className="space-y-2">
              <Label>العنوان الفرعي (إنجليزي)</Label>
              <Input value={form.subtitle} onChange={(e) => f('subtitle', e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>العنوان الفرعي (عربي)</Label>
              <Input value={form.subtitleAr} onChange={(e) => f('subtitleAr', e.target.value)} dir="rtl" className="bg-background font-arabic" />
            </div>
            <div className="space-y-2">
              <Label>نص الزر (إنجليزي)</Label>
              <Input value={form.buttonText} onChange={(e) => f('buttonText', e.target.value)} className="bg-background" placeholder="Shop Now" />
            </div>
            <div className="space-y-2">
              <Label>نص الزر (عربي)</Label>
              <Input value={form.buttonTextAr} onChange={(e) => f('buttonTextAr', e.target.value)} dir="rtl" className="bg-background font-arabic" placeholder="تسوق الآن" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>رابط الزر</Label>
              <Input value={form.buttonLink} onChange={(e) => f('buttonLink', e.target.value)} className="bg-background" placeholder="/shop" />
            </div>
            <div className="space-y-2">
              <Label>ترتيب العرض</Label>
              <Input type="number" value={form.displayOrder} onChange={(e) => f('displayOrder', Number(e.target.value))} className="bg-background" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch id="banner-active" checked={form.isActive} onCheckedChange={(c) => f('isActive', c)} />
              <Label htmlFor="banner-active">نشط (يظهر في الموقع)</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>صورة البنر</Label>
            <ImageUploader images={imageUrls} onChange={setImageUrls} folder="banners" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={submitting} className="bg-primary text-primary-foreground">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري...</> : 'حفظ'}
            </Button>
          </div>
        </div>
      </CrudDialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="حذف البنر"
        description={`هل أنت متأكد من حذف بنر "${deleteTarget?.title}"؟`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}