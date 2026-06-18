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
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Product } from '../types';

const COL = 'products';

function toProduct(doc: QueryDocumentSnapshot): Product {
  return { id: doc.id, ...doc.data() } as Product;
}

export const productsService = {
  async getAll(opts?: { search?: string; categoryId?: string; collectionId?: string; pageSize?: number }): Promise<Product[]> {
    let q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    if (opts?.categoryId) q = query(q, where('categoryId', '==', opts.categoryId));
    if (opts?.collectionId) q = query(q, where('collectionId', '==', opts.collectionId));
    if (opts?.pageSize) q = query(q, limit(opts.pageSize));
    const snap = await getDocs(q);
    let products = snap.docs.map(toProduct);
    if (opts?.search) {
      const s = opts.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.nameAr?.includes(s) ||
          p.sku?.toLowerCase().includes(s)
      );
    }
    return products;
  },

  async getById(id: string): Promise<Product | null> {
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const q = query(collection(db, COL), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return toProduct(snap.docs[0]);
  },

  async getFeatured(count = 8): Promise<Product[]> {
    const q = query(
      collection(db, COL),
      where('isFeatured', '==', true),
      where('inStock', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map(toProduct);
  },

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(collection(db, COL), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, COL, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(
    callback: (products: Product[]) => void,
    opts?: { categoryId?: string }
  ): Unsubscribe {
    let q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    if (opts?.categoryId) q = query(q, where('categoryId', '==', opts.categoryId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toProduct));
    });
  },

  async getCount(): Promise<number> {
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
