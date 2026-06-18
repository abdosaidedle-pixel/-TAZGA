import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db, isMockMode } from '../firebase';
import type { WebsiteSettings, HomepageSettings, AdminSettings } from '../types';
import { defaultWebsiteSettings, defaultHomepageSettings } from './mockData';

function getMockWebsite(): WebsiteSettings {
  const data = localStorage.getItem('tazga_mock_website_settings');
  if (!data) {
    localStorage.setItem('tazga_mock_website_settings', JSON.stringify(defaultWebsiteSettings));
    return defaultWebsiteSettings;
  }
  return JSON.parse(data);
}

function getMockHomepage(): HomepageSettings {
  const data = localStorage.getItem('tazga_mock_homepage_settings');
  if (!data) {
    localStorage.setItem('tazga_mock_homepage_settings', JSON.stringify(defaultHomepageSettings));
    return defaultHomepageSettings;
  }
  return JSON.parse(data);
}

function saveMockWebsite(data: WebsiteSettings) {
  localStorage.setItem('tazga_mock_website_settings', JSON.stringify(data));
}

function saveMockHomepage(data: HomepageSettings) {
  localStorage.setItem('tazga_mock_homepage_settings', JSON.stringify(data));
}

export const settingsService = {
  async getWebsite(): Promise<Partial<WebsiteSettings>> {
    if (isMockMode) {
      return getMockWebsite();
    }
    const snap = await getDoc(doc(db, 'settings', 'website'));
    if (!snap.exists()) return {};
    return snap.data() as WebsiteSettings;
  },

  async updateWebsite(data: Partial<WebsiteSettings>): Promise<void> {
    if (isMockMode) {
      const current = getMockWebsite();
      const updated = { ...current, ...data };
      saveMockWebsite(updated);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await setDoc(doc(db, 'settings', 'website'), data, { merge: true });
  },

  async getHomepage(): Promise<Partial<HomepageSettings>> {
    if (isMockMode) {
      return getMockHomepage();
    }
    const snap = await getDoc(doc(db, 'settings', 'homepage'));
    if (!snap.exists()) return {};
    return snap.data() as HomepageSettings;
  },

  async updateHomepage(data: Partial<HomepageSettings>): Promise<void> {
    if (isMockMode) {
      const current = getMockHomepage();
      const updated = { ...current, ...data };
      saveMockHomepage(updated);
      window.dispatchEvent(new Event('tazga_mock_db_update'));
      return;
    }
    await setDoc(doc(db, 'settings', 'homepage'), data, { merge: true });
  },

  async getAdmins(): Promise<AdminSettings> {
    if (isMockMode) {
      const firstSetup = localStorage.getItem('tazga_mock_first_setup');
      return { emails: firstSetup === 'done' ? ['tazga@tazga.com'] : [] };
    }
    const snap = await getDoc(doc(db, 'settings', 'admins'));
    if (!snap.exists()) return { emails: [] };
    return snap.data() as AdminSettings;
  },

  async addAdmin(email: string): Promise<void> {
    if (isMockMode) return;
    await updateDoc(doc(db, 'settings', 'admins'), {
      emails: arrayUnion(email),
    });
  },

  async removeAdmin(email: string): Promise<void> {
    if (isMockMode) return;
    await updateDoc(doc(db, 'settings', 'admins'), {
      emails: arrayRemove(email),
    });
  },

  async initAdmins(email: string): Promise<void> {
    if (isMockMode) {
      localStorage.setItem('tazga_mock_first_setup', 'done');
      return;
    }
    await setDoc(doc(db, 'settings', 'admins'), { emails: [email] }, { merge: true });
  },
};
