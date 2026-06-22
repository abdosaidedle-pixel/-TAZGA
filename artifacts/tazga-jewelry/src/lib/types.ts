import type { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  inventory: number;
  sku: string;
  inStock: boolean;
  isFeatured: boolean;
  description: string;
  descriptionAr: string;
  material: string;
  images: string[];
  categoryId: string;
  collectionId: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  coverImage: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Collection {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  coverImage: string;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Banner {
  id: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  buttonText: string;
  buttonTextAr: string;
  buttonLink: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  storagePath: string;
  mimetype: string;
  size: number;
  folder: string;
  createdAt: Timestamp;
}

export interface WebsiteSettings {
  storeName: string;
  storeNameAr: string;
  tagline: string;
  taglineAr: string;
  email: string;
  phone: string;
  address: string;
  addressAr: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  whatsapp: string;
  footerText: string;
  footerTextAr: string;
  logoUrl: string;
}

export interface HomepageSettings {
  heroTitle: string;
  heroTitleAr: string;
  heroSubtitle: string;
  heroSubtitleAr: string;
  heroButtonText: string;
  heroButtonLink: string;
  aboutTitle: string;
  aboutBody: string;
  aboutBodyAr: string;
  featuredSectionTitle: string;
  showTestimonials: boolean;
  stats: { label: string; value: string }[];
}

export interface AdminSettings {
  emails: string[];
}
