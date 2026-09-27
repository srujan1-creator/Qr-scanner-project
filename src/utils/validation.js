import { normalizeUrl } from './qrPayload.js';

/**
 * Validates URL input.
 * Returns { isValid, isEmpty, errors: { url?: string } }
 */
export function validateURLData(data = {}) {
  const raw = String(data.url || '').trim();
  if (!raw) {
    return {
      isValid: false,
      isEmpty: true,
      errors: { url: 'Please enter a website URL (e.g., https://example.com).' }
    };
  }

  if (/\s/.test(raw)) {
    return {
      isValid: false,
      isEmpty: false,
      errors: { url: 'URL cannot contain spaces. Use %20 or hyphens instead.' }
    };
  }

  // Reject unsupported protocols if explicitly typed (e.g. ftp:// or javascript:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(raw) && !/^https?:\/\//i.test(raw)) {
    return {
      isValid: false,
      isEmpty: false,
      errors: { url: 'URL must start with http:// or https://.' }
    };
  }

  const normalized = normalizeUrl(raw);
  try {
    const parsed = new URL(normalized);
    const hostname = parsed.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const hasValidDomain = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(hostname) &&
      hostname.split('.').pop().length >= 2;

    if (!isLocalhost && !hasValidDomain) {
      return {
        isValid: false,
        isEmpty: false,
        errors: { url: 'Enter a valid domain name (e.g., https://example.com).' }
      };
    }

    return { isValid: true, isEmpty: false, errors: {} };
  } catch {
    return {
      isValid: false,
      isEmpty: false,
      errors: { url: 'Please enter a valid URL (e.g., https://example.com).' }
    };
  }
}

/**
 * Validates Plain Text input.
 */
export function validateTextData(data = {}) {
  const text = String(data.text || '');
  const trimmed = text.trim();

  if (!trimmed) {
    return {
      isValid: false,
      isEmpty: true,
      errors: { text: 'Please enter some text content to encode into the QR code.' }
    };
  }

  if (trimmed.length > 1200) {
    return {
      isValid: false,
      isEmpty: false,
      errors: {
        text: `Text is too long (${trimmed.length}/1200 characters). Shorter text scans much more reliably.`
      }
    };
  }

  return { isValid: true, isEmpty: false, errors: {} };
}

/**
 * Validates Email input.
 */
export function validateEmailData(data = {}) {
  const email = String(data.email || '').trim();
  const subject = String(data.subject || '').trim();
  const body = String(data.body || '').trim();

  if (!email) {
    return {
      isValid: false,
      isEmpty: true,
      errors: { email: 'Recipient email address is required.' }
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      isEmpty: false,
      errors: { email: 'Enter a valid email address (e.g., name@domain.com).' }
    };
  }

  const errors = {};
  if (subject.length > 200) {
    errors.subject = 'Subject should be 200 characters or fewer.';
  }
  if (body.length > 800) {
    errors.body = 'Message body should be 800 characters or fewer for reliable QR scanning.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    isEmpty: false,
    errors
  };
}

/**
 * Validates Phone Number input.
 */
export function validatePhoneData(data = {}) {
  const raw = String(data.phone || '').trim();

  if (!raw) {
    return {
      isValid: false,
      isEmpty: true,
      errors: { phone: 'Phone number is required.' }
    };
  }

  // Allow leading +, digits, spaces, hyphens, parentheses, dots
  const validCharsRegex = /^\+?[0-9\s\-().]+$/;
  if (!validCharsRegex.test(raw)) {
    return {
      isValid: false,
      isEmpty: false,
      errors: { phone: 'Phone number can only contain digits, +, spaces, hyphens, or parentheses.' }
    };
  }

  const digits = raw.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return {
      isValid: false,
      isEmpty: false,
      errors: {
        phone: `Enter a valid phone number with 7 to 15 digits (currently ${digits.length}).`
      }
    };
  }

  return { isValid: true, isEmpty: false, errors: {} };
}

/**
 * Validates Wi-Fi input.
 */
export function validateWifiData(data = {}) {
  const ssid = String(data.ssid || '').trim();
  const password = String(data.password || '');
  const encryption = data.encryption || 'WPA';

  if (!ssid) {
    return {
      isValid: false,
      isEmpty: true,
      errors: { ssid: 'Network name (SSID) is required.' }
    };
  }

  const errors = {};

  if (ssid.length > 32) {
    errors.ssid = 'Network name (SSID) cannot exceed 32 characters.';
  }

  if (encryption === 'WPA') {
    if (!password) {
      errors.password = 'Password is required for WPA/WPA2/WPA3 networks (or select "None" for open networks).';
    } else if (password.length < 8 || password.length > 63) {
      errors.password = 'WPA password must be between 8 and 63 characters.';
    }
  } else if (encryption === 'WEP') {
    if (!password) {
      errors.password = 'Password/Key is required for WEP networks.';
    } else if (password.length < 5) {
      errors.password = 'WEP key must be at least 5 characters long.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    isEmpty: false,
    errors
  };
}

/**
 * Master validation dispatcher for the active QR type.
 */
export function validateQRInput(type, formData = {}) {
  const typeData = formData[type] || {};

  switch (type) {
    case 'url':
      return validateURLData(typeData);
    case 'text':
      return validateTextData(typeData);
    case 'email':
      return validateEmailData(typeData);
    case 'phone':
      return validatePhoneData(typeData);
    case 'wifi':
      return validateWifiData(typeData);
    default:
      return { isValid: false, isEmpty: true, errors: {} };
  }
}
