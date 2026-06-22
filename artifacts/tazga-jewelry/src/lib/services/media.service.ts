import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, uploadImageToStorage, deleteImageFromStorage, isMockMode } from '../firebase';
import type { MediaFile } from '../types';

const COL = 'media';

function toMedia(d: QueryDocumentSnapshot): MediaFile {
  return { id: d.id, ...d.data() } as MediaFile;
}

function getMockMedia(): MediaFile[] {
  const data = localStorage.getItem('tazga_mock_media');
  if (!data) return [];
  return JSON.parse(data);
}

function saveMockMedia(media: MediaFile[]) {
  localStorage.setItem('tazga_mock_media', JSON.stringify(media));
}

export const mediaService = {
  async getAll(folder?: string): Promise<MediaFile[]> {
    if (isMockMode) {
      let list = getMockMedia();
      if (folder) list = list.filter((m) => m.folder === folder);
      return list;
    }
    let q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    if (folder) q = query(q, where('folder', '==', folder));
    const snap = await getDocs(q);
    return snap.docs.map(toMedia);
  },

  async upload(
    file: File,
    folder = 'media'
  ): Promise<MediaFile> {
    if (isMockMode) {
      const sanitizedName = file.name.replace(/\s+/g, '_');
      const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;
      const url = await uploadImageToStorage(file, storagePath);
      const list = getMockMedia();
      const newMedia: MediaFile = {
        id: 'media-' + Date.now(),
        filename: file.name,
        url,
        storagePath,
        mimetype: file.type,
        size: file.size,
        folder,
        createdAt: new Date() as any,
      };
      list.unshift(newMedia);
      saveMockMedia(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return newMedia;
    }

    const sanitizedName = file.name.replace(/\s+/g, '_');
    const storagePath = `${folder}/${Date.now()}_${sanitizedName}`;
    const url = await uploadImageToStorage(file, storagePath);
    const ref = await addDoc(collection(db, COL), {
      filename: file.name,
      url,
      storagePath,
      mimetype: file.type,
      size: file.size,
      folder,
      createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      filename: file.name,
      url,
      storagePath,
      mimetype: file.type,
      size: file.size,
      folder,
      createdAt: serverTimestamp() as any,
    };
  },

  async delete(id: string, storagePath: string): Promise<void> {
    if (isMockMode) {
      await deleteImageFromStorage(storagePath);
      let list = getMockMedia();
      list = list.filter((m) => m.id !== id);
      saveMockMedia(list);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await deleteImageFromStorage(storagePath);
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(
    callback: (files: MediaFile[]) => void,
    folder?: string
  ): Unsubscribe {
    if (isMockMode) {
      const handler = () => {
        let list = getMockMedia();
        if (folder) list = list.filter((m) => m.folder === folder);
        callback(list);
      };
      handler();
      window.addEventListener('tazga_mock_db_update', handler);
      return () => window.removeEventListener('tazga_mock_db_update', handler);
    }
    let q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    if (folder) q = query(q, where('folder', '==', folder));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toMedia));
    });
  },

  async getCount(): Promise<number> {
    if (isMockMode) {
      return getMockMedia().length;
    }
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
