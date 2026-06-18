import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, signInAdmin, createAdminUser, logOut, onAuthChange } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  setupFirstAdmin: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  authError: null,
  signIn: async () => {},
  setupFirstAdmin: async () => {},
  signOutUser: async () => {},
});

async function checkIsAdmin(user: User): Promise<boolean> {
  try {
    const settingsDoc = await getDoc(doc(db, 'settings', 'admins'));
    if (!settingsDoc.exists()) return false;
    const data = settingsDoc.data();
    const emails: string[] = data?.emails || [];
    return emails.includes(user.email || '');
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const admin = await checkIsAdmin(u);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const u = await signInAdmin(email, password);
      const admin = await checkIsAdmin(u);
      if (!admin) {
        await logOut();
        throw new Error('هذا الحساب غير مصرح له بالوصول للوحة التحكم');
      }
      setIsAdmin(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'فشل تسجيل الدخول';
      const firebaseMessages: Record<string, string> = {
        'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        'auth/user-not-found': 'لا يوجد حساب بهذا البريد الإلكتروني',
        'auth/wrong-password': 'كلمة المرور غير صحيحة',
        'auth/too-many-requests': 'محاولات كثيرة جداً، حاول لاحقاً',
        'auth/network-request-failed': 'خطأ في الشبكة، تحقق من الاتصال',
      };
      const code = (err as { code?: string }).code || '';
      setAuthError(firebaseMessages[code] || message);
      throw err;
    }
  };

  const setupFirstAdmin = async (email: string, password: string) => {
    setAuthError(null);
    try {
      // Create user in Firebase Auth
      const u = await createAdminUser(email, password);
      // Add to admins whitelist in Firestore
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'settings', 'admins'), {
        emails: [u.email],
      });
      setIsAdmin(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'فشل إنشاء الحساب';
      setAuthError(message);
      throw err;
    }
  };

  const signOutUser = async () => {
    await logOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, authError, signIn, setupFirstAdmin, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
