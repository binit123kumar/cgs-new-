/**
 * cmsApi.js
 *
 * Thin wrapper around the CGS CMS backend (ASP.NET Core Web API).
 * Provides consistent error handling, retries, and caching.
 */

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7050/api';

export const API_BASE = API_URL.replace(/\/api\/?$/, '');

// Turns a relative path returned by the backend (e.g. "/uploads/about/x.jpg")
// into a full URL an <img>/<a> tag can use directly.
export function fileUrl(relativePath) {
  if (!relativePath) return null;
  if (/^https?:\/\//i.test(relativePath)) return relativePath; // already absolute
  return `${API_BASE}${relativePath}`;
}

// Simple in-memory cache for GET requests
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithRetry(url, options = {}, retries = 2, delay = 500) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      return json.data ?? null;
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
}

function getCacheKey(path) {
  return `GET:${path}`;
}

function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(path) {
  const key = getCacheKey(path);
  cache.delete(key);
}

async function getJson(path, options = {}) {
  const { useCache = true, ...fetchOptions } = options;
  const cacheKey = getCacheKey(path);

  if (useCache && fetchOptions.method !== 'POST') {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }

  try {
    const data = await fetchWithRetry(`${API_URL}${path}`, fetchOptions);
    if (useCache && fetchOptions.method !== 'POST') {
      setCache(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${path}]:`, error.message);
    throw error; // Let caller handle fallback
  }
}

function valueOf(item, lowerName, upperName) {
  return item?.[lowerName] ?? item?.[upperName];
}

// Only return records that are Active, sorted by displayOrder (backend already
// sorts, but we defensively re-sort in case items were toggled recently).
function activeSorted(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((x) => valueOf(x, 'isActive', 'IsActive') !== false)
    .sort((a, b) => (valueOf(a, 'displayOrder', 'DisplayOrder') ?? 0) - (valueOf(b, 'displayOrder', 'DisplayOrder') ?? 0));
}

export async function getAbout() {
  const data = await getJson('/about');
  return activeSorted(data).filter((a) => valueOf(a, 'showOnAboutPage', 'ShowOnAboutPage') !== false);
}

export async function getFaculty() {
  const data = await getJson('/faculty');
  return activeSorted(data);
}

// Guest faculty are managed in the Faculty module using the Guest Faculty
// checkbox. Keeping this as a derived list avoids duplicate CMS entries.
export async function getGuestFaculty() {
  const faculty = await getFaculty();
  return faculty.filter((member) => valueOf(member, 'isGuestFaculty', 'IsGuestFaculty') === true || valueOf(member, 'isGuestFaculty', 'IsGuestFaculty') === 'true');
}

export async function getStaff() {
  const data = await getJson('/staff');
  return activeSorted(data);
}

export async function getGallery() {
  const data = await getJson('/gallery');
  return activeSorted(data);
}

export async function getSlider() {
  const data = await getJson('/slider');
  return activeSorted(data);
}

export async function getEvents() {
  const data = await getJson('/events');
  return activeSorted(data);
}

export async function getNews() {
  const data = await getJson('/news');
  return activeSorted(data);
}

export async function getNotices() {
  const data = await getJson('/notice');
  return activeSorted(data);
}

export async function getCourses() {
  const data = await getJson('/courses');
  return activeSorted(data);
}

export async function getDownloads() {
  const data = await getJson('/downloads');
  return activeSorted(data);
}

export async function getPublications() {
  const data = await getJson('/publications');
  return activeSorted(data);
}

export async function getSettings() {
  const data = await getJson('/settings', { useCache: false });
  return data;
}

export async function getAimObjectives() {
  const data = await getJson('/aimobjective');
  return activeSorted(data);
}

export async function getNavigation() {
  const data = await getJson('/navigation');
  return activeSorted(data);
}

export async function getFooterLinks() {
  const data = await getJson('/footerlinks');
  return activeSorted(data);
}

export async function getFacilities() {
  const data = await getJson('/facilities');
  return activeSorted(data);
}

// Admin API functions (require authentication)
export async function adminGetAll(endpoint) {
  return getJson(endpoint, { useCache: false });
}

export async function adminCreate(endpoint, formData) {
  invalidateCache(endpoint);
  return fetchWithRetry(`${API_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });
}

export async function adminUpdate(endpoint, formData) {
  invalidateCache(endpoint);
  return fetchWithRetry(`${API_URL}${endpoint}`, {
    method: 'PUT',
    body: formData,
  });
}

export async function adminDelete(endpoint) {
  invalidateCache(endpoint);
  return fetchWithRetry(`${API_URL}${endpoint}`, {
    method: 'DELETE',
  });
}

export async function adminToggleStatus(endpoint) {
  invalidateCache(endpoint);
  return fetchWithRetry(`${API_URL}${endpoint}`, {
    method: 'PATCH',
  });
}

// Export cache utilities for advanced use
export const apiCache = {
  clear: () => cache.clear(),
  invalidate: invalidateCache,
};