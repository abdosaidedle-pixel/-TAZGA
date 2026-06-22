import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, isMockMode } from '../firebase';
import type { Collection } from '../types';
import { defaultCollections } from './mockData';

const COL = 'collections';

function toCollection(d: QueryDocumentSnapshot): Collection {
  return { id: d.id, ...d.data() } as Collection;
}

function getMockCollections(): Collection[] {
  const data = localStorage.getItem('tazga_mock_collections');
  if (!data) {
    localStorage.setItem('tazga_mock_collections', JSON.stringify(defaultCollections));
    return defaultCollections;
  }
  return JSON.parse(data);
}

function saveMockCollections(collections: Collection[]) {
  localStorage.setItem('tazga_mock_collections', JSON.stringify(collections));
}

export const collectionsService = {
  async getAll(): Promise<Collection[]> {
    if (isMockMode) {
      return getMockCollections().sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(toCollection);
  },

  async getFeatured(): Promise<Collection[]> {
    if (isMockMode) {
      return getMockCollections().filter((c) => c.isFeatured).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const q = query(
      collection(db, COL),
      where('isFeatured', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(toCollection);
  },

  async getById(id: string): Promise<Collection | null> {
    if (isMockMode) {
      return getMockCollections().find((c) => c.id === id) || null;
    }
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Collection;
  },

  async getBySlug(slug: string): Promise<Collection | null> {
    if (isMockMode) {
      return getMockCollections().find((c) => c.slug === slug) || null;
    }
    const { query: q2, where: w, limit: l, getDocs: gd } = await import('firebase/firestore');
    const qSnap = await gd(q2(collection(db, COL), w('slug', '==', slug), l(1)));
    if (qSnap.empty) return null;
    return toCollection(qSnap.docs[0]);
  },

  async create(data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (isMockMode) {
      const list = getMockCollections();
      const newId = 'col-' + Date.now();
      const newCollection: Collection = {
        id: newId,
        ...data,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
      list.push(newCollection);
      saveMockCollections(list);
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

  async update(id: string, data: Partial<Omit<Collection, 'id' | 'createdAt'>>): Promise<void> {
    if (isMockMode) {
      let list = getMockCollections();
      list = list.map((c) => {
        if (c.id === id) {
          return { ...c, ...data, updatedAt: new Date() as any };
        }
        return c;
      });
      saveMockCollections(list);
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
      let list = getMockCollections();
      list = list.filter((c) => c.id !== id);
      saveMockCollections(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(callback: (items: Collection[]) => void): Unsubscribe {
    if (isMockMode) {
      const handler = () => {
        callback(getMockCollections().sort((a, b) => a.displayOrder - b.displayOrder));
      };
      handler();
      window.addEventListener('tazga_mock_db_update', handler);
      return () => window.removeEventListener('tazga_mock_db_update', handler);
    }
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toCollection));
    });
  },

  async getCount(): Promise<number> {
    if (isMockMode) {
      return getMockCollections().length;
    }
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
