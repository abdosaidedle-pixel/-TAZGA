import { useState, useEffect } from 'react';
import { settingsService } from '@/lib/services/settings.service';
import type { WebsiteSettings, HomepageSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, FileText, Globe, Phone, Info, Layout } from 'lucide-react';
import { ImageUploader } from '@/components/admin/image-uploader';

export default function AdminWebsiteContent() {
  const [websiteSettings, setWebsiteSettings] = useState<Partial<WebsiteSettings>>({});
  const [homepageSettings, setHomepageSettings] = useState<Partial<HomepageSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      try {
        const [web, home] = await Promise.all([
          settingsService.getWebsite(),
          settingsService.getHomepage(),
        ]);
        setWebsiteSettings(web);
        setHomepageSettings(home);
      } catch (err) {
        console.error(err);
        toast({ title: 'خطأ', description: 'فشل تحميل محتوى الموقع', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        settingsService.updateWebsite(websiteSettings),
        settingsService.updateHomepage(homepageSettings),
      ]);
      toast({ title: 'نجاح', description: 'تم حفظ محتوى الموقع بنجاح' });
    } catch (err) {
      toast({ title: 'خطأ', description: 'فشل حفظ التعديلات: ' + String(err), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateWeb = (key: keyof WebsiteSettings, value: any) => {
    setWebsiteSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateHome = (key: keyof HomepageSettings, value: any) => {
    setHomepageSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-arabic">جاري تحميل إعدادات المحتوى...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wider mb-2">محتوى الموقع</h1>
          <p className="text-muted-foreground font-arabic">تعديل النصوص، معلومات الاتصال، ومحتوى الصفحة الرئيسية للمتجر</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground font-arabic w-full sm:w-auto">
          {saving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
          حفظ التعديلات
        </Button>
      </div>

      <Tabs defaultValue="store-info" className="space-y-6">
        <TabsList className="bg-card border border-border w-full flex flex-wrap justify-start h-auto p-1 font-arabic">
          <TabsTrigger value="store-info" className="flex items-center gap-2 py-2.5 px-4"><Info className="h-4 w-4" /> هوية المتجر</TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2 py-2.5 px-4"><Layout className="h-4 w-4" /> واجهة الموقع (Hero)</TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2 py-2.5 px-4"><FileText className="h-4 w-4" /> من نحن</TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2 py-2.5 px-4"><Phone className="h-4 w-4" /> الاتصال والشبكات</TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-2 py-2.5 px-4"><Globe className="h-4 w-4" /> التذييل (Footer)</TabsTrigger>
        </TabsList>

        {/* Store Info */}
        <TabsContent value="store-info">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">هوية المتجر</CardTitle>
              <CardDescription className="font-arabic">الاسم والشعار والوصف الأساسي للمتجر</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">اسم المتجر (بالإنجليزي)</Label>
                  <Input value={websiteSettings.storeName || ''} onChange={(e) => updateWeb('storeName', e.target.value)} placeholder="TAZGA" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">اسم المتجر (بالعربي)</Label>
                  <Input value={websiteSettings.storeNameAr || ''} onChange={(e) => updateWeb('storeNameAr', e.target.value)} placeholder="تازجا" className="bg-background border-border" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">الشعار الفرعي (بالإنجليزي)</Label>
                  <Input value={websiteSettings.tagline || ''} onChange={(e) => updateWeb('tagline', e.target.value)} placeholder="Fine Jewelry" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">الشعار الفرعي (بالعربي)</Label>
                  <Input value={websiteSettings.taglineAr || ''} onChange={(e) => updateWeb('taglineAr', e.target.value)} placeholder="مجوهرات راقية" className="bg-background border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">شعار المتجر (Logo)</Label>
                <ImageUploader images={websiteSettings.logoUrl ? [websiteSettings.logoUrl] : []} onChange={(urls) => updateWeb('logoUrl', urls[0] || '')} folder="settings" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">واجهة الموقع (Hero Section)</CardTitle>
              <CardDescription className="font-arabic">تعديل نصوص الترحيب وزر الانتقال في أول الصفحة الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">العنوان الرئيسي (بالإنجليزي)</Label>
                  <Input value={homepageSettings.heroTitle || ''} onChange={(e) => updateHome('heroTitle', e.target.value)} placeholder="Timeless Jewelry" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">العنوان الرئيسي (بالعربي)</Label>
                  <Input value={homepageSettings.heroTitleAr || ''} onChange={(e) => updateHome('heroTitleAr', e.target.value)} placeholder="مجوهرات لا تفنى" className="bg-background border-border" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">الوصف الفرعي (بالإنجليزي)</Label>
                  <Textarea value={homepageSettings.heroSubtitle || ''} onChange={(e) => updateHome('heroSubtitle', e.target.value)} placeholder="Crafted with passion..." className="bg-background border-border min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">الوصف الفرعي (بالعربي)</Label>
                  <Textarea value={homepageSettings.heroSubtitleAr || ''} onChange={(e) => updateHome('heroSubtitleAr', e.target.value)} placeholder="صنعت بشغف وحب..." className="bg-background border-border min-h-[80px]" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">نص زر الانتقال (بالعربي)</Label>
                  <Input value={homepageSettings.heroButtonText || ''} onChange={(e) => updateHome('heroButtonText', e.target.value)} placeholder="تسوق الآن" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">رابط زر الانتقال</Label>
                  <Input value={homepageSettings.heroButtonLink || ''} onChange={(e) => updateHome('heroButtonLink', e.target.value)} placeholder="/shop" className="bg-background border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-arabic">عنوان قسم المنتجات المميزة</Label>
                <Input value={homepageSettings.featuredSectionTitle || ''} onChange={(e) => updateHome('featuredSectionTitle', e.target.value)} placeholder="قطعنا المختارة" className="bg-background border-border" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">من نحن (About Section)</CardTitle>
              <CardDescription className="font-arabic">تاريخ المتجر وقصة التأسيس والإحصائيات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="font-arabic">العنوان الرئيسي</Label>
                <Input value={homepageSettings.aboutTitle || ''} onChange={(e) => updateHome('aboutTitle', e.target.value)} placeholder="عائلتنا وتاريخنا" className="bg-background border-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">نص القصة (بالإنجليزي)</Label>
                  <Textarea value={homepageSettings.aboutBody || ''} onChange={(e) => updateHome('aboutBody', e.target.value)} placeholder="Our legacy dates back..." className="bg-background border-border min-h-[150px]" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">نص القصة (بالعربي)</Label>
                  <Textarea value={homepageSettings.aboutBodyAr || ''} onChange={(e) => updateHome('aboutBodyAr', e.target.value)} placeholder="يعود تاريخنا إلى..." className="bg-background border-border min-h-[150px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact & Socials */}
        <TabsContent value="contact">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">الاتصال والشبكات الاجتماعية</CardTitle>
              <CardDescription className="font-arabic">روابط التواصل وحسابات السوشيال ميديا ومعلومات التواصل بالموقع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">البريد الإلكتروني للمراسلة</Label>
                  <Input value={websiteSettings.email || ''} onChange={(e) => updateWeb('email', e.target.value)} placeholder="info@tazga.com" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">رقم الهاتف</Label>
                  <Input value={websiteSettings.phone || ''} onChange={(e) => updateWeb('phone', e.target.value)} placeholder="+966 50 000 0000" className="bg-background border-border text-left" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">العنوان الجغرافي (بالإنجليزي)</Label>
                  <Input value={websiteSettings.address || ''} onChange={(e) => updateWeb('address', e.target.value)} placeholder="Riyadh, Saudi Arabia" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">العنوان الجغرافي (بالعربي)</Label>
                  <Input value={websiteSettings.addressAr || ''} onChange={(e) => updateWeb('addressAr', e.target.value)} placeholder="الرياض، المملكة العربية السعودية" className="bg-background border-border" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">رابط انستقرام</Label>
                  <Input value={websiteSettings.instagramUrl || ''} onChange={(e) => updateWeb('instagramUrl', e.target.value)} placeholder="https://instagram.com/tazga" className="bg-background border-border text-left" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">رابط فيسبوك</Label>
                  <Input value={websiteSettings.facebookUrl || ''} onChange={(e) => updateWeb('facebookUrl', e.target.value)} placeholder="https://facebook.com/tazga" className="bg-background border-border text-left" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">رابط تويتر / إكس</Label>
                  <Input value={websiteSettings.twitterUrl || ''} onChange={(e) => updateWeb('twitterUrl', e.target.value)} placeholder="https://twitter.com/tazga" className="bg-background border-border text-left" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">رابط الواتساب</Label>
                  <Input value={websiteSettings.whatsapp || ''} onChange={(e) => updateWeb('whatsapp', e.target.value)} placeholder="https://wa.me/966500000000" className="bg-background border-border text-left" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif">محتوى التذييل (Footer Content)</CardTitle>
              <CardDescription className="font-arabic">حقوق النشر والنصوص أسفل صفحات الموقع الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-arabic">نص الحقوق التوضيحي (بالإنجليزي)</Label>
                  <Textarea value={websiteSettings.footerText || ''} onChange={(e) => updateWeb('footerText', e.target.value)} placeholder="All rights reserved..." className="bg-background border-border min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label className="font-arabic">نص الحقوق التوضيحي (بالعربي)</Label>
                  <Textarea value={websiteSettings.footerTextAr || ''} onChange={(e) => updateWeb('footerTextAr', e.target.value)} placeholder="جميع الحقوق محفوظة..." className="bg-background border-border min-h-[100px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
