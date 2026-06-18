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
import { db } from '../firebase';
import type { Collection } from '../types';

const COL = 'collections';

function toCollection(d: QueryDocumentSnapshot): Collection {
  return { id: d.id, ...d.data() } as Collection;
}

export const collectionsService = {
  async getAll(): Promise<Collection[]> {
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(toCollection);
  },

  async getFeatured(): Promise<Collection[]> {
    const q = query(
      collection(db, COL),
      where('isFeatured', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(toCollection);
  },

  async getById(id: string): Promise<Collection | null> {
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Collection;
  },

  async getBySlug(slug: string): Promise<Collection | null> {
    const { query: q2, where: w, limit: l, getDocs: gd } = await import('firebase/firestore');
    const qSnap = await gd(q2(collection(db, COL), w('slug', '==', slug), l(1)));
    if (qSnap.empty) return null;
    return toCollection(qSnap.docs[0]);
  },

  async create(data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COL), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Omit<Collection, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, COL, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(callback: (items: Collection[]) => void): Unsubscribe {
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toCollection));
    });
  },

  async getCount(): Promise<number> {
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
