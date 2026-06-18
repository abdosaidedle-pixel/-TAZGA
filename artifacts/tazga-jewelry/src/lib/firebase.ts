import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  type User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isMockMode =
  !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === 'your_api_key_here' ||
  import.meta.env.VITE_FIREBASE_API_KEY.startsWith('your_') ||
  import.meta.env.VITE_FIREBASE_API_KEY.includes('placeholder');

let app: any;
let auth: any;
let db: any;
let storage: any;

if (!isMockMode) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  } catch (err) {
    console.error('Firebase failed to initialize, switching to Mock Mode:', err);
  }
}

export { auth, db, storage };

// Auth helpers
export async function signInAdmin(
  email: string,
  password: string
): Promise<User> {
  if (isMockMode || !auth) {
    if (email === 'tazga@tazga.com' && password === 'TAZGA2025') {
      return { email, uid: 'mock-admin-uid' } as User;
    }
    throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function createAdminUser(
  email: string,
  password: string
): Promise<User> {
  if (isMockMode || !auth) {
    return { email, uid: 'mock-admin-uid' } as User;
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function logOut(): Promise<void> {
  if (isMockMode || !auth) return;
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (isMockMode || !auth) {
    const mockUser = localStorage.getItem('tazga_mock_user');
    callback(mockUser ? JSON.parse(mockUser) : null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Storage helpers
export async function uploadImageToStorage(
  file: File,
  path: string
): Promise<string> {
  if (isMockMode || !storage) {
    // Return base64 for preview locally
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteImageFromStorage(
  storagePath: string
): Promise<void> {
  if (isMockMode || !storage) return;
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch {
    // ignore if file doesn't exist
  }
}
