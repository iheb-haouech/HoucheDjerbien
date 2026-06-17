import { defaultPageContent } from './contentSchema';
import { listings as defaultListings, services as defaultServices } from './mockData';
import LOCAL_ASSETS from '../assets/images';

export { defaultPageContent };

const LISTINGS_KEY = 'djerba-listings';
const BOOKINGS_KEY = 'djerba-bookings';
const USERS_KEY = 'djerba-users';
const SERVICES_KEY = 'djerba-services';
const HOMEPAGE_KEY = 'djerba-homepage';
const REQUESTS_KEY = 'djerba-requests';
const CLEANING_REQUESTS_KEY = 'djerba-cleaning-requests';
const CONSTRUCTION_REQUESTS_KEY = 'djerba-construction-requests';
const CONTENT_KEY = 'djerba-page-content';

const safeParseArray = (value, fallback) => {
  try {
    const result = JSON.parse(value);
    return Array.isArray(result) ? result : fallback;
  } catch {
    return fallback;
  }
};

const safeParseObject = (value, fallback) => {
  try {
    const result = JSON.parse(value);
    return result && typeof result === 'object' && !Array.isArray(result) ? result : fallback;
  } catch {
    return fallback;
  }
};

const defaultHomepageConfig = {
  layout: 'hero',
  images: LOCAL_ASSETS.gallery,
  heroVideo: '',
  useHeroVideo: false,
};

const STORAGE_ERROR = 'STORAGE_FULL';

const isStorageFull = (error) => {
  return error?.name === 'QuotaExceededError' ||
         error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
         String(error?.message || '').includes('FILE_ERROR_NO_SPACE') ||
         error?.code === 22 ||
         error?.code === 1014;
};

const readArray = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = safeParseArray(stored, null);
      if (parsed) return parsed;
    }
    // Try session storage as fallback
    try {
      const sessionStored = sessionStorage.getItem(key);
      if (sessionStored) {
        const parsed = safeParseArray(sessionStored, null);
        if (parsed) return parsed;
      }
    } catch {}
    return fallback;
  } catch (error) {
    if (isStorageFull(error)) {
      try { sessionStorage.setItem(STORAGE_ERROR, '1'); } catch {}
    }
    return fallback;
  }
};

const writeArray = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(Array.isArray(data) ? data : []));
  } catch (error) {
    if (!isStorageFull(error)) throw error;
    try {
      // Fallback to session storage
      sessionStorage.setItem(key, JSON.stringify(Array.isArray(data) ? data : []));
    } catch {}
  }
};

const readObject = (key, fallback = {}) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = safeParseObject(stored, null);
      if (parsed) return parsed;
    }
    // Try session storage as fallback
    try {
      const sessionStored = sessionStorage.getItem(key);
      if (sessionStored) {
        const parsed = safeParseObject(sessionStored, null);
        if (parsed) return parsed;
      }
    } catch {}
    return fallback;
  } catch (error) {
    if (isStorageFull(error)) {
      try { sessionStorage.setItem(STORAGE_ERROR, '1'); } catch {}
    }
    return fallback;
  }
};

const writeObject = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data && typeof data === 'object' ? data : {}));
  } catch (error) {
    if (!isStorageFull(error)) throw error;
    try {
      // Fallback to session storage
      sessionStorage.setItem(key, JSON.stringify(data && typeof data === 'object' ? data : {}));
    } catch {}
  }
};

// Listings
export const loadListings = () => readArray(LISTINGS_KEY, defaultListings);
export const saveListings = (listings) => writeArray(LISTINGS_KEY, listings);

// Bookings
export const loadBookings = () => readArray(BOOKINGS_KEY, []);
export const saveBookings = (bookings) => writeArray(BOOKINGS_KEY, bookings);

// Users
export const loadUsers = () => readArray(USERS_KEY, []);
export const saveUsers = (users) => writeArray(USERS_KEY, users);

// Services
export const loadServices = () => readArray(SERVICES_KEY, defaultServices);
export const saveServices = (services) => writeArray(SERVICES_KEY, services);

// Homepage config
export const loadHomepageConfig = () => readObject(HOMEPAGE_KEY, defaultHomepageConfig);
export const saveHomepageConfig = (config) => writeObject(HOMEPAGE_KEY, config || defaultHomepageConfig);

// Consultation requests
export const loadConsultationRequests = () => readArray(REQUESTS_KEY, []);
export const saveConsultationRequests = (requests) => writeArray(REQUESTS_KEY, requests);

// Cleaning requests
export const loadCleaningRequests = () => readArray(CLEANING_REQUESTS_KEY, []);
export const saveCleaningRequests = (requests) => writeArray(CLEANING_REQUESTS_KEY, requests);

// Construction requests
export const loadConstructionRequests = () => readArray(CONSTRUCTION_REQUESTS_KEY, []);
export const saveConstructionRequests = (requests) => writeArray(CONSTRUCTION_REQUESTS_KEY, requests);

// CMS page content
export const loadPageContent = () => readObject(CONTENT_KEY, defaultPageContent);
export const savePageContent = (content) => writeObject(CONTENT_KEY, content);

export const loadSectionContent = (page, section) => {
  const content = loadPageContent();
  return content[page]?.[section] || null;
};

export const updateSectionContent = (page, section, updates) => {
  const content = loadPageContent() || {};
  if (!content[page]) content[page] = {};
  content[page][section] = { ...(content[page][section] || {}), ...updates };
  savePageContent(content);
  window.dispatchEvent(new Event('content-updated'));
  return content[page][section];
};
