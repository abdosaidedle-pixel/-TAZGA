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
import type { Banner } from '../types';
import { defaultBanners } from './mockData';

const COL = 'banners';

function toBanner(d: QueryDocumentSnapshot): Banner {
  return { id: d.id, ...d.data() } as Banner;
}

function getMockBanners(): Banner[] {
  const data = localStorage.getItem('tazga_mock_banners');
  if (!data) {
    localStorage.setItem('tazga_mock_banners', JSON.stringify(defaultBanners));
    return defaultBanners;
  }
  return JSON.parse(data);
}

function saveMockBanners(banners: Banner[]) {
  localStorage.setItem('tazga_mock_banners', JSON.stringify(banners));
}

export const bannersService = {
  async getAll(): Promise<Banner[]> {
    if (isMockMode) {
      return getMockBanners().sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(toBanner);
  },

  async getActive(): Promise<Banner[]> {
    if (isMockMode) {
      return getMockBanners().filter((b) => b.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const q = query(
      collection(db, COL),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(toBanner);
  },

  async getById(id: string): Promise<Banner | null> {
    if (isMockMode) {
      return getMockBanners().find((b) => b.id === id) || null;
    }
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Banner;
  },

  async create(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (isMockMode) {
      const list = getMockBanners();
      const newId = 'ban-' + Date.now();
      const newBanner: Banner = {
        id: newId,
        ...data,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
      list.push(newBanner);
      saveMockBanners(list);
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

  async update(id: string, data: Partial<Omit<Banner, 'id' | 'createdAt'>>): Promise<void> {
    if (isMockMode) {
      let list = getMockBanners();
      list = list.map((b) => {
        if (b.id === id) {
          return { ...b, ...data, updatedAt: new Date() as any };
        }
        return b;
      });
      saveMockBanners(list);
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
      let list = getMockBanners();
      list = list.filter((b) => b.id !== id);
      saveMockBanners(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(callback: (banners: Banner[]) => void): Unsubscribe {
    if (isMockMode) {
      const handler = () => {
        callback(getMockBanners().sort((a, b) => a.displayOrder - b.displayOrder));
      };
      handler();
      window.addEventListener('tazga_mock_db_update', handler);
      return () => window.removeEventListener('tazga_mock_db_update', handler);
    }
    const q = query(collection(db, COL), orderBy('displayOrder', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toBanner));
    });
  },

  async getCount(): Promise<number> {
    if (isMockMode) {
      return getMockBanners().length;
    }
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
