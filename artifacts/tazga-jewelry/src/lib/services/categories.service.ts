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
import { db, isMockMode } from '../firebase';
import type { Category } from '../types';
import { defaultCategories } from './mockData';

const COL = 'categories';

function toCategory(d: QueryDocumentSnapshot): Category {
  return { id: d.id, ...d.data() } as Category;
}

function getMockCategories(): Category[] {
  const data = localStorage.getItem('tazga_mock_categories');
  if (!data) {
    localStorage.setItem('tazga_mock_categories', JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  return JSON.parse(data);
}

function saveMockCategories(categories: Category[]) {
  localStorage.setItem('tazga_mock_categories', JSON.stringify(categories));
}

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    if (isMockMode) {
      return getMockCategories().sort((a, b) => a.order - b.order);
    }
    const q = query(collection(db, COL), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(toCategory);
  },

  async getById(id: string): Promise<Category | null> {
    if (isMockMode) {
      return getMockCategories().find((c) => c.id === id) || null;
    }
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Category;
  },

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (isMockMode) {
      const list = getMockCategories();
      const newId = 'cat-' + Date.now();
      const newCategory: Category = {
        id: newId,
        ...data,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
      list.push(newCategory);
      saveMockCategories(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return newId;
    }
    const ref = await addDoc(collection(db, COL), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<void> {
    if (isMockMode) {
      let list = getMockCategories();
      list = list.map((c) => {
        if (c.id === id) {
          return { ...c, ...data, updatedAt: new Date() as any };
        }
        return c;
      });
      saveMockCategories(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await updateDoc(doc(db, COL, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    if (isMockMode) {
      let list = getMockCategories();
      list = list.filter((c) => c.id !== id);
      saveMockCategories(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(callback: (categories: Category[]) => void): Unsubscribe {
    if (isMockMode) {
      const handler = () => {
        callback(getMockCategories().sort((a, b) => a.order - b.order));
      };
      handler();
      window.addEventListener('tazga_mock_db_update', handler);
      return () => window.removeEventListener('tazga_mock_db_update', handler);
    }
    const q = query(collection(db, COL), orderBy('order', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toCategory));
    });
  },

  async getCount(): Promise<number> {
    if (isMockMode) {
      return getMockCategories().length;
    }
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
