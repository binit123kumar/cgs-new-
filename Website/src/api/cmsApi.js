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
  return getJson('/settings');
}
