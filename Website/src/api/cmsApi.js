/**
 * cmsApi.js
 *
 * Thin wrapper around the CGS CMS backend (ASP.NET Core Web API).
 * Every function fails soft: on any network/API error it resolves to an
 * empty array/null instead of throwing, so pages can safely fall back to
 * their existing static content when the backend isn't reachable yet.
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

async function getJson(path) {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null; // backend unreachable — caller should fall back to static content
  }
}

// Only return records that are Active, sorted by displayOrder (backend already
// sorts, but we defensively re-sort in case items were toggled recently).
function activeSorted(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((x) => x.isActive)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export async function getAbout() {
  const data = await getJson('/about');
  return activeSorted(data).filter((a) => a.showOnAboutPage);
}

export async function getFaculty() {
  const data = await getJson('/faculty');
  return activeSorted(data);
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
  return getJson('/settings');
}
