import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

/**
 * Custom React hook that generates a QR code PNG data URL in real time
 * whenever valid input payload or visual customization settings change.
 */
export function useQRCode({
  payload,
  isValid,
  size = 280,
  fgColor = '#111827',
  bgColor = '#ffffff',
  errorCorrectionLevel = 'M',
  margin = 4
}) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    if (!isValid || !payload) {
      setQrDataUrl('');
      setGenerationError(null);
      setIsGenerating(false);
      return;
    }

    async function renderQR() {
      setIsGenerating(true);
      setGenerationError(null);

      try {
        const clampedSize = Math.min(Math.max(Number(size) || 280, 128), 1024);
        const clampedMargin = Math.min(Math.max(Number(margin) ?? 4, 0), 10);
        const validEcc = ['L', 'M', 'Q', 'H'].includes(errorCorrectionLevel)
          ? errorCorrectionLevel
          : 'M';

        const dataUrl = await QRCode.toDataURL(payload, {
          width: clampedSize,
          margin: clampedMargin,
          errorCorrectionLevel: validEcc,
          color: {
            dark: fgColor || '#111827',
            light: bgColor || '#ffffff'
          }
        });

        if (!isCancelled) {
          setQrDataUrl(dataUrl);
          setIsGenerating(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setQrDataUrl('');
          setGenerationError(
            err?.message || 'Unable to generate QR code for the provided input.'
          );
          setIsGenerating(false);
        }
      }
    }

    renderQR();

    return () => {
      isCancelled = true;
    };
  }, [payload, isValid, size, fgColor, bgColor, errorCorrectionLevel, margin]);

  return {
    qrDataUrl,
    isGenerating,
    generationError
  };
}
