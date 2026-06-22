import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from '@/components/admin/image-uploader';
import { Instagram, Plus, Trash2, GripVertical, Save, Loader2, Image as ImageIcon } from 'lucide-react';

interface InstagramSlide {
  url: string;
  caption?: string;
}

export default function AdminInstagramBanner() {
  const [slides, setSlides] = useState<InstagramSlide[]>([]);
  const [intervalMs, setIntervalMs] = useState(3500);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'instagramBanner'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.slides) setSlides(data.slides);
          if (data.intervalMs) setIntervalMs(data.intervalMs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addSlide = () => {
    setSlides((s) => [...s, { url: '', caption: '' }]);
  };

  const removeSlide = (i: number) => {
    setSlides((s) => s.filter((_, idx) => idx !== i));
  };

  const updateCaption = (i: number, caption: string) => {
    setSlides((s) => s.map((slide, idx) => (idx === i ? { ...slide, caption } : slide)));
  };

  const updateUrl = (i: number, url: string) => {
    setSlides((s) => s.map((slide, idx) => (idx === i ? { ...slide, url } : slide)));
  };

  const handleImageUploaded = (i: number, urls: string[]) => {
    if (urls.length > 0) updateUrl(i, urls[0]);
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    setSlides((s) => {
      const next = [...s];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  };

  const moveDown = (i: number) => {
    setSlides((s) => {
      if (i === s.length - 1) return s;
      const next = [...s];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'instagramBanner'), {
        slides: slides.filter((s) => s.url),
        intervalMs,
        updatedAt: new Date().toISOString(),
      });
      toast({ title: 'تم الحفظ', description: 'تم تحديث بنر الإنستاجرام بنجاح. سيظهر على جميع الأجهزة فوراً.' });
    } catch (e) {
      toast({ title: 'خطأ', description: String(e), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-none flex items-center justify-center border border-primary/20">
            <Instagram className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl tracking-wider">Instagram Banner</h1>
            <p className="text-muted-foreground text-sm">تحكم في صور البنر المتحرك على الصفحة الرئيسية</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 font-serif tracking-wider"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>

      {/* Interval Setting */}
      <div className="bg-card border border-border p-6">
        <Label className="font-serif tracking-wider text-sm mb-3 block">سرعة التبديل التلقائي (بالمللي ثانية)</Label>
        <div className="flex items-center gap-4 max-w-sm">
          <Input
            type="number"
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            min={1000}
            max={10000}
            step={500}
            className="rounded-none border-border bg-background"
          />
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            = {(intervalMs / 1000).toFixed(1)}ث
          </span>
        </div>
        <p className="text-muted-foreground text-xs mt-2">القيمة الافتراضية: 3500 مللي ثانية (3.5 ثانية)</p>
      </div>

      {/* Slides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif tracking-wider text-lg">الشرائح ({slides.length})</h2>
          <Button
            onClick={addSlide}
            variant="outline"
            className="rounded-none border-white/20 hover:border-primary font-serif tracking-wider text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة شريحة
          </Button>
        </div>

        {slides.length === 0 && (
          <div className="border border-dashed border-white/20 p-12 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-serif">لا توجد شرائح. اضغط "إضافة شريحة" للبدء.</p>
          </div>
        )}

        {slides.map((slide, i) => (
          <div
            key={i}
            className="border border-border bg-card p-6 flex flex-col sm:flex-row gap-6"
          >
            {/* Order controls */}
            <div className="flex sm:flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => moveUp(i)}
                disabled={i === 0}
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-primary hover:text-primary transition-colors disabled:opacity-30"
              >
                ↑
              </button>
              <span className="text-muted-foreground text-sm font-serif w-6 text-center">{i + 1}</span>
              <button
                onClick={() => moveDown(i)}
                disabled={i === slides.length - 1}
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-primary hover:text-primary transition-colors disabled:opacity-30"
              >
                ↓
              </button>
            </div>

            {/* Image preview */}
            {slide.url ? (
              <div className="w-full sm:w-32 h-32 shrink-0 border border-border overflow-hidden">
                <img src={slide.url} alt={slide.caption || `Slide ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full sm:w-32 h-32 shrink-0 border border-dashed border-white/20 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}

            {/* Fields */}
            <div className="flex-1 space-y-4">
              <div>
                <Label className="text-xs tracking-widest uppercase mb-2 block">رابط الصورة (URL)</Label>
                <Input
                  value={slide.url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder="https://... أو /images/..."
                  className="rounded-none border-border bg-background"
                />
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase mb-2 block">التسمية التوضيحية (اختياري)</Label>
                <Input
                  value={slide.caption || ''}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="وصف قصير للصورة"
                  className="rounded-none border-border bg-background"
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-xs tracking-widest uppercase mb-2 block">أو ارفع صورة</Label>
                <ImageUploader
                  images={slide.url ? [slide.url] : []}
                  onChange={(urls) => handleImageUploaded(i, urls)}
                  folder="instagram-banner"
                />
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => removeSlide(i)}
              className="self-start text-muted-foreground hover:text-destructive transition-colors p-1"
              title="حذف الشريحة"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div className="border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        <strong className="text-primary font-serif">ملاحظة:</strong> التغييرات تظهر فوراً على جميع الأجهزة بدون الحاجة لإعادة تحميل الصفحة.
      </div>
    </div>
  );
}
