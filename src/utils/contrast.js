// Color contrast and scan reliability checks

export const DEFAULT_CUSTOMIZATION = {
  size: 280,
  fgColor: '#111827',
  bgColor: '#ffffff',
  errorCorrectionLevel: 'M',
  margin: 4,
  presetId: 'classic'
};

export const VISUAL_PRESETS = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Standard black on white',
    fgColor: '#111827',
    bgColor: '#ffffff',
    errorCorrectionLevel: 'M',
    margin: 4
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Deep slate on cool grey',
    fgColor: '#0f172a',
    bgColor: '#f1f5f9',
    errorCorrectionLevel: 'Q',
    margin: 4
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Warm charcoal on cream',
    fgColor: '#1e293b',
    bgColor: '#fffbeb',
    errorCorrectionLevel: 'M',
    margin: 4
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep navy on ice blue',
    fgColor: '#0c4a6e',
    bgColor: '#f0f9ff',
    errorCorrectionLevel: 'Q',
    margin: 4
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Tight border with high ECC',
    fgColor: '#18181b',
    bgColor: '#fafafa',
    errorCorrectionLevel: 'H',
    margin: 2
  }
];

export function hexToRgb(hex = '#000000') {
  const cleaned = String(hex).replace('#', '').trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    if ([r, g, b].some(Number.isNaN)) return { r: 0, g: 0, b: 0 };
    return { r, g, b };
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return { r: 0, g: 0, b: 0 };
    return { r, g, b };
  }
  return { r: 0, g: 0, b: 0 };
}

export function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastRatio(hex1, hex2) {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function evaluateScanReliability({
  fgColor = '#111827',
  bgColor = '#ffffff',
  size = 280,
  margin = 4,
  payloadLength = 25
} = {}) {
  const fgLum = getRelativeLuminance(fgColor);
  const bgLum = getRelativeLuminance(bgColor);
  const contrastRatio = getContrastRatio(fgColor, bgColor);

  const warnings = [];

  if (contrastRatio < 2.5) {
    warnings.push(
      `Low contrast may affect QR scanning (${contrastRatio}:1 is too low for most cameras).`
    );
  } else if (contrastRatio < 4.5) {
    warnings.push(
      `Low contrast may affect QR scanning (current ratio: ${contrastRatio}:1, aim for 4.5:1+).`
    );
  }

  if (fgLum > bgLum) {
    warnings.push(
      'Foreground color is lighter than background. Inverted QR codes may fail on some scanners.'
    );
  }

  if (Number(margin) < 2) {
    warnings.push(
      'Small margin (< 2) may reduce readability if the QR touches surrounding elements.'
    );
  }

  if (Number(size) < 180 && payloadLength > 120) {
    warnings.push(
      'Long content at a small QR size may make modules too dense to scan easily.'
    );
  }

  let level = 'excellent';
  if (contrastRatio < 2.5) {
    level = 'critical';
  } else if (warnings.length > 0 || contrastRatio < 4.5) {
    level = 'warning';
  } else if (contrastRatio < 7) {
    level = 'good';
  }

  return {
    contrastRatio,
    isInverted: fgLum > bgLum,
    level,
    warnings
  };
}
