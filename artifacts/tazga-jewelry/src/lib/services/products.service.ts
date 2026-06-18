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
import { db, isMockMode } from '../firebase';
import type { Product } from '../types';
import { defaultProducts } from './mockData';

const COL = 'products';

function toProduct(doc: QueryDocumentSnapshot): Product {
  return { id: doc.id, ...doc.data() } as Product;
}

// Local storage helpers
function getMockProducts(): Product[] {
  const data = localStorage.getItem('tazga_mock_products');
  if (!data) {
    localStorage.setItem('tazga_mock_products', JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(data);
}

function saveMockProducts(products: Product[]) {
  localStorage.setItem('tazga_mock_products', JSON.stringify(products));
}

export const productsService = {
  async getAll(opts?: { search?: string; categoryId?: string; collectionId?: string; pageSize?: number }): Promise<Product[]> {
    if (isMockMode) {
      let list = getMockProducts();
      if (opts?.categoryId) list = list.filter((p) => p.categoryId === opts.categoryId);
      if (opts?.collectionId) list = list.filter((p) => p.collectionId === opts.collectionId);
      if (opts?.search) {
        const s = opts.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.nameAr?.includes(s) ||
            p.sku?.toLowerCase().includes(s)
        );
      }
      if (opts?.pageSize) list = list.slice(0, opts.pageSize);
      return list;
    }

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
    if (isMockMode) {
      const list = getMockProducts();
      return list.find((p) => p.id === id) || null;
    }
    const snap = await getDoc(doc(db, COL, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    if (isMockMode) {
      const list = getMockProducts();
      return list.find((p) => p.slug === slug) || null;
    }
    const q = query(collection(db, COL), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return toProduct(snap.docs[0]);
  },

  async getFeatured(count = 8): Promise<Product[]> {
    if (isMockMode) {
      const list = getMockProducts();
      return list.filter((p) => p.isFeatured && p.inStock).slice(0, count);
    }
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
    if (isMockMode) {
      const list = getMockProducts();
      const newId = 'prod-' + Date.now();
      const newProduct: Product = {
        id: newId,
        ...data,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
      list.unshift(newProduct);
      saveMockProducts(list);
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

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
    if (isMockMode) {
      let list = getMockProducts();
      list = list.map((p) => {
        if (p.id === id) {
          return { ...p, ...data, updatedAt: new Date() as any };
        }
        return p;
      });
      saveMockProducts(list);
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
      let list = getMockProducts();
      list = list.filter((p) => p.id !== id);
      saveMockProducts(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(
    callback: (products: Product[]) => void,
    opts?: { categoryId?: string }
  ): Unsubscribe {
    if (isMockMode) {
      const handler = () => {
        let list = getMockProducts();
        if (opts?.categoryId) list = list.filter((p) => p.categoryId === opts.categoryId);
        callback(list);
      };
      handler();
      window.addEventListener('tazga_mock_db_update', handler);
      return () => window.removeEventListener('tazga_mock_db_update', handler);
    }
    let q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    if (opts?.categoryId) q = query(q, where('categoryId', '==', opts.categoryId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toProduct));
    });
  },

  async getCount(): Promise<number> {
    if (isMockMode) {
      return getMockProducts().length;
    }
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
