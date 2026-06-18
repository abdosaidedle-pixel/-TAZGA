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
import { db, uploadImageToStorage, deleteImageFromStorage } from '../firebase';
import type { MediaFile } from '../types';

const COL = 'media';

function toMedia(d: QueryDocumentSnapshot): MediaFile {
  return { id: d.id, ...d.data() } as MediaFile;
}

export const mediaService = {
  async getAll(folder?: string): Promise<MediaFile[]> {
    let q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    if (folder) q = query(q, where('folder', '==', folder));
    const snap = await getDocs(q);
    return snap.docs.map(toMedia);
  },

  async upload(
    file: File,
    folder = 'media'
  ): Promise<MediaFile> {
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
    await deleteImageFromStorage(storagePath);
    await deleteDoc(doc(db, COL, id));
  },

  subscribeAll(
    callback: (files: MediaFile[]) => void,
    folder?: string
  ): Unsubscribe {
    let q = query(collection(db, COL), orderBy('createdAt', 'desc'));
    if (folder) q = query(q, where('folder', '==', folder));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(toMedia));
    });
  },

  async getCount(): Promise<number> {
    const snap = await getDocs(collection(db, COL));
    return snap.size;
  },
};
