import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { WebsiteSettings, HomepageSettings, AdminSettings } from '../types';

export const settingsService = {
  async getWebsite(): Promise<Partial<WebsiteSettings>> {
    const snap = await getDoc(doc(db, 'settings', 'website'));
    if (!snap.exists()) return {};
    return snap.data() as WebsiteSettings;
  },

  async updateWebsite(data: Partial<WebsiteSettings>): Promise<void> {
    await setDoc(doc(db, 'settings', 'website'), data, { merge: true });
  },

  async getHomepage(): Promise<Partial<HomepageSettings>> {
    const snap = await getDoc(doc(db, 'settings', 'homepage'));
    if (!snap.exists()) return {};
    return snap.data() as HomepageSettings;
  },

  async updateHomepage(data: Partial<HomepageSettings>): Promise<void> {
    await setDoc(doc(db, 'settings', 'homepage'), data, { merge: true });
  },

  async getAdmins(): Promise<AdminSettings> {
    const snap = await getDoc(doc(db, 'settings', 'admins'));
    if (!snap.exists()) return { emails: [] };
    return snap.data() as AdminSettings;
  },

  async addAdmin(email: string): Promise<void> {
    await updateDoc(doc(db, 'settings', 'admins'), {
      emails: arrayUnion(email),
    });
  },

  async removeAdmin(email: string): Promise<void> {
    await updateDoc(doc(db, 'settings', 'admins'), {
      emails: arrayRemove(email),
    });
  },

  async initAdmins(email: string): Promise<void> {
    await setDoc(doc(db, 'settings', 'admins'), { emails: [email] }, { merge: true });
  },
};
