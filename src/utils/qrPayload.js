// QR payload builders for URL, Text, Email, Phone, and Wi-Fi formats

export const QR_TYPES = [
  {
    id: 'url',
    label: 'URL',
    shortDesc: 'Website or portfolio link',
    filenameSlug: 'url'
  },
  {
    id: 'text',
    label: 'Plain Text',
    shortDesc: 'Notes, messages, or snippets',
    filenameSlug: 'text'
  },
  {
    id: 'email',
    label: 'Email',
    shortDesc: 'Pre-filled email & subject',
    filenameSlug: 'email'
  },
  {
    id: 'phone',
    label: 'Phone Number',
    shortDesc: 'Direct dial contact number',
    filenameSlug: 'phone'
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    shortDesc: 'One-scan network login',
    filenameSlug: 'wifi'
  }
];

export const DEFAULT_FORM_DATA = {
  url: {
    url: 'https://github.com/srujan1-creator'
  },
  text: {
    text: ''
  },
  email: {
    email: '',
    subject: '',
    body: ''
  },
  phone: {
    phone: ''
  },
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false
  }
};

export const SAMPLE_FORM_DATA = {
  url: {
    url: 'https://github.com/srujan1-creator'
  },
  text: {
    text: 'Built by Srujan — GDG on Campus SRM Technical Domain Task'
  },
  email: {
    email: 'srujan@srmist.edu.in',
    subject: 'GDG SRM Project Submission',
    body: 'Hi team,\n\nSharing my QR Studio web app built with React and Vite.'
  },
  phone: {
    phone: '+91 98765 43210'
  },
  wifi: {
    ssid: 'SRM_Hostel_5G',
    password: 'srmcampus2026',
    encryption: 'WPA',
    hidden: false
  }
};

// Wi-Fi QR format requires escaping \, ;, ,, ", and :
export function escapeWifiField(value = '') {
  return String(value).replace(/([\\;,"':])/g, '\\$1');
}

export function normalizeUrl(rawUrl = '') {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function buildURLPayload(data = {}) {
  return normalizeUrl(data.url || '');
}

export function buildTextPayload(data = {}) {
  return String(data.text || '').trim();
}

export function buildEmailPayload(data = {}) {
  const email = String(data.email || '').trim();
  if (!email) return '';

  const subject = String(data.subject || '').trim();
  const body = String(data.body || '').trim();

  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  const query = params.length ? `?${params.join('&')}` : '';
  return `mailto:${email}${query}`;
}

export function buildPhonePayload(data = {}) {
  const raw = String(data.phone || '').trim();
  if (!raw) return '';

  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  return `tel:${hasPlus ? '+' : ''}${digits}`;
}

export function buildWifiPayload(data = {}) {
  const ssid = String(data.ssid || '').trim();
  if (!ssid) return '';

  const encryption = data.encryption || 'WPA';
  const password = String(data.password || '');
  const hidden = Boolean(data.hidden);

  const safeSsid = escapeWifiField(ssid);
  const safePass = encryption === 'nopass' ? '' : escapeWifiField(password);

  let result = `WIFI:T:${encryption};S:${safeSsid};`;
  if (encryption !== 'nopass' && safePass) {
    result += `P:${safePass};`;
  }
  if (hidden) {
    result += 'H:true;';
  }
  return `${result};`;
}

export function generateQRPayload(type, formData = {}) {
  const current = formData[type] || {};

  switch (type) {
    case 'url':
      return buildURLPayload(current);
    case 'text':
      return buildTextPayload(current);
    case 'email':
      return buildEmailPayload(current);
    case 'phone':
      return buildPhonePayload(current);
    case 'wifi':
      return buildWifiPayload(current);
    default:
      return '';
  }
}

export function getPayloadSummary(type, formData = {}) {
  const current = formData[type] || {};

  switch (type) {
    case 'url':
      return normalizeUrl(current.url) || 'Empty URL';
    case 'text': {
      const text = String(current.text || '').trim();
      return text.length > 45 ? `${text.slice(0, 45)}...` : text || 'Empty text';
    }
    case 'email': {
      const email = String(current.email || '').trim();
      const subject = String(current.subject || '').trim();
      return subject ? `${email} (${subject})` : email || 'Empty email';
    }
    case 'phone':
      return String(current.phone || '').trim() || 'Empty phone';
    case 'wifi': {
      const ssid = String(current.ssid || '').trim();
      const mode = current.encryption === 'nopass' ? 'Open' : current.encryption || 'WPA';
      return ssid ? `${ssid} (${mode})` : 'Empty Wi-Fi';
    }
    default:
      return 'QR Code';
  }
}
