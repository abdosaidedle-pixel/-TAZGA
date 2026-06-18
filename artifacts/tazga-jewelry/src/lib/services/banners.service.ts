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
import type { Banner } from '../types';

const COL = 'banners';

function toBanner(d: QueryDocumentSnapshot): Banner {
  return { id: d.id, ...d.data() } as Banner;
}

export const bannersService = {
  async getAll(): Promise<Banner[]> {
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(toBanner);
  },

  async getActive(): Promise<Banner[]> {
    const q = query(
      collection(db, COL),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(toBanner);
  },

  async getById(id: string): Promise<Banner | null> {
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Banner;
  },

  async create(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COL), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Omit<Banner, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, COL, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(callback: (banners: Banner[]) => void): Unsubscribe {
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toBanner));
    });
  },

  async getCount(): Promise<number> {
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
