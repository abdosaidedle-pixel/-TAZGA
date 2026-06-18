import { useState, useEffect } from 'react';
import { settingsService } from '@/lib/services/settings.service';
import { useAuth } from '@/lib/firebase-auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Mail, Shield, ShieldAlert } from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const [adminsList, setAdminsList] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadAdmins() {
      try {
        const admins = await settingsService.getAdmins();
        setAdminsList(admins.emails || []);
      } catch (err) {
        console.error(err);
        toast({ title: 'خطأ', description: 'فشل تحميل قائمة المسؤولين', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    loadAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    const emailToTrim = newAdminEmail.trim().toLowerCase();
    if (adminsList.includes(emailToTrim)) {
      toast({ title: 'تنبيه', description: 'هذا البريد مضاف بالفعل' });
      return;
    }
    setSubmitting(true);
    try {
      await settingsService.addAdmin(emailToTrim);
      setAdminsList((prev) => [...prev, emailToTrim]);
      setNewAdminEmail('');
      toast({ title: 'تمت الإضافة', description: 'تمت إضافة المسؤول بنجاح.' });
    } catch (err) {
      toast({ title: 'خطأ في الإضافة', description: String(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (email === user?.email) {
      toast({ title: 'لا يمكن حذف حسابك', description: 'لا يمكنك إزالة بريدك الإلكتروني الخاص من القائمة.', variant: 'destructive' });
      return;
    }
    if (confirm(`هل أنت متأكد من حذف ${email} من قائمة المسؤولين؟`)) {
      try {
        await settingsService.removeAdmin(email);
        setAdminsList((prev) => prev.filter((e) => e !== email));
        toast({ title: 'تم الحذف', description: 'تم إزالة البريد بنجاح من القائمة.' });
      } catch (err) {
        toast({ title: 'خطأ', description: String(err), variant: 'destructive' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-arabic">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif tracking-wider mb-2">إعدادات النظام</h1>
        <p className="text-muted-foreground font-arabic">إدارة صلاحيات المسؤولين والاطلاع على حالة النظام</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Whitelist Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> قائمة المدراء المصرح لهم
            </CardTitle>
            <CardDescription className="font-arabic">تحديد العناوين المصرح لها بالوصول للوحة التحكم فقط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAddAdmin} className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="bg-background border-border pr-9 text-left font-sans"
                  required
                />
              </div>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground font-arabic">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 ml-1" />}
                إضافة
              </Button>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {adminsList.map((email) => (
                <div key={email} className="flex items-center justify-between p-3 rounded-md border border-border bg-background">
                  <span className="text-sm font-sans">{email}</span>
                  {email === user?.email ? (
                    <span className="text-xs text-primary font-arabic font-medium bg-primary/10 py-1 px-2.5 rounded-full">حسابك الحالي</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveAdmin(email)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System & Account Details */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-yellow-500" /> معلومات الحساب الحالي
              </CardTitle>
              <CardDescription className="font-arabic">بيانات المسؤول المسجل حالياً</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground font-arabic">البريد الإلكتروني</Label>
                <div className="font-medium p-3 rounded-md bg-secondary text-sm font-sans">{user?.email || '—'}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground font-arabic">تاريخ إنشاء الحساب</Label>
                <div className="font-medium p-3 rounded-md bg-secondary text-sm font-sans">
                  {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString('ar-SA') : '—'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-serif text-sm text-muted-foreground uppercase tracking-widest">Firebase Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-500 font-arabic text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                متصل بخوادم Firebase بنجاح
              </div>
              <p className="text-xs text-muted-foreground font-arabic mt-2">
                يتم إدارة المصادقة وقواعد البيانات ورفع الصور في بيئة حية وسحابية آمنة.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
