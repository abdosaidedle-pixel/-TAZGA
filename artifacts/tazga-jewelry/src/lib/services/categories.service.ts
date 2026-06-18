import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Category } from '../types';

const COL = 'categories';

function toCategory(d: QueryDocumentSnapshot): Category {
  return { id: d.id, ...d.data() } as Category;
}

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const q = query(collection(db, COL), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(toCategory);
  },

  async getById(id: string): Promise<Category | null> {
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Category;
  },

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COL), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, COL, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(callback: (categories: Category[]) => void): Unsubscribe {
    const q = query(collection(db, COL), orderBy('order', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toCategory));
    });
  },

  async getCount(): Promise<number> {
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
