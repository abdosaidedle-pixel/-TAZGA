import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/firebase-auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, ShieldCheck, AlertCircle, User } from 'lucide-react';
import { settingsService } from '@/lib/services/settings.service';

// Map username → Firebase-compatible email
function usernameToEmail(username: string): string {
  // If user typed a full email, use it as-is
  if (username.includes('@')) return username;
  // Otherwise append domain
  return `${username.toLowerCase()}@tazga.com`;
}

export default function AdminLogin() {
  const { user, loading, isAdmin, authError, signIn, setupFirstAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      setLocation('/admin');
    }
  }, [user, loading, isAdmin]);

  useEffect(() => {
    settingsService.getAdmins().then((admins) => {
      setIsFirstSetup(admins.emails.length === 0);
      setCheckingSetup(false);
    }).catch(() => {
      // First time — no settings doc yet
      setIsFirstSetup(true);
      setCheckingSetup(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setSubmitting(true);
    const email = usernameToEmail(username);
    try {
      if (isFirstSetup) {
        await setupFirstAdmin(email, password);
      } else {
        await signIn(email, password);
      }
      setLocation('/admin');
    } catch {
      // authError is set in context
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || checkingSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-serif tracking-widest text-foreground mb-2">TAZGA</h1>
          <p className="text-sm text-muted-foreground font-arabic">لوحة التحكم الإدارية</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-2xl">
          {isFirstSetup && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-md">
              <p className="text-sm text-primary font-arabic text-center">
                مرحباً! هذه أول مرة تستخدم فيها لوحة التحكم. أنشئ حساب المسؤول الآن.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-medium text-center font-arabic">
              {isFirstSetup ? 'إنشاء حساب المسؤول' : 'تسجيل الدخول'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="font-arabic">اسم المستخدم</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="TAZGA"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="bg-background border-border h-11 pl-10"
                />
              </div>
              {!isFirstSetup && (
                <p className="text-xs text-muted-foreground font-arabic">أدخل اسم المستخدم أو البريد الإلكتروني</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="font-arabic">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isFirstSetup ? 'new-password' : 'current-password'}
                  className="bg-background border-border h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive font-arabic">{authError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !username || !password}
              className="w-full h-11 bg-primary text-primary-foreground font-arabic text-base hover:bg-primary/90 transition-all"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري...</>
              ) : isFirstSetup ? 'إنشاء الحساب والدخول' : 'دخول'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          TAZGA Jewelry Admin &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
