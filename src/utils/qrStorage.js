import { getPayloadSummary } from './qrPayload.js';

export const RECENT_QR_STORAGE_KEY = 'qr_studio_recent_items_v1';
export const THEME_STORAGE_KEY = 'qr_studio_theme_v1';
export const MAX_RECENT_ITEMS = 10;

/**
 * Safely reads and parses JSON from localStorage without throwing.
 */
export function safeGetStorage(key, fallbackValue) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { value: fallbackValue, error: null };
    }
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return { value: fallbackValue, error: null };
    }
    return { value: JSON.parse(raw), error: null };
  } catch (err) {
    return {
      value: fallbackValue,
      error: err?.message || 'Unable to access browser localStorage.'
    };
  }
}

/**
 * Safely serializes and writes JSON to localStorage without throwing.
 */
export function safeSetStorage(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ok: false, error: 'localStorage is not supported in this browser.' };
    }
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true, error: null };
  } catch (err) {
    return {
      ok: false,
      error: err?.message || 'Failed to save data to browser localStorage.'
    };
  }
}

/**
 * Creates a recent QR entry object ready for storage.
 * Deduplicates by payload + visual settings and caps the list at MAX_RECENT_ITEMS (10).
 */
export function buildRecentEntry({
  type,
  typeData,
  customization,
  payload,
  dataUrl
}) {
  const timestamp = new Date().toISOString();
  const id = `qr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const summary = getPayloadSummary(type, { [type]: typeData });

  return {
    id,
    type,
    inputData: { ...typeData },
    customization: { ...customization },
    presetId: customization.presetId || 'custom',
    payload,
    summary,
    thumbnail: dataUrl || '',
    createdAt: timestamp
  };
}

/**
 * Inserts a new recent item at the top of the existing array,
 * removing older identical configurations and trimming to MAX_RECENT_ITEMS.
 */
export function upsertRecentQRList(existingList = [], newEntry) {
  const safeList = Array.isArray(existingList) ? existingList : [];
  const filtered = safeList.filter((item) => {
    const samePayload = item.payload === newEntry.payload && item.type === newEntry.type;
    const sameColors =
      item.customization?.fgColor === newEntry.customization?.fgColor &&
      item.customization?.bgColor === newEntry.customization?.bgColor &&
      item.customization?.errorCorrectionLevel === newEntry.customization?.errorCorrectionLevel &&
      item.customization?.margin === newEntry.customization?.margin;
    return !(samePayload && sameColors);
  });

  return [newEntry, ...filtered].slice(0, MAX_RECENT_ITEMS);
}

/**
 * Formats an ISO timestamp into a friendly readable date & time string.
 */
export function formatTimestamp(isoString) {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return 'Just now';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  } catch {
    return 'Recently';
  }
}
