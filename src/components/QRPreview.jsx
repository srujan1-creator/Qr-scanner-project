import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  BookmarkPlus,
  QrCode,
  AlertTriangle,
  Sparkles,
  Code2
} from 'lucide-react';
import { QR_TYPES } from '../utils/qrPayload';
import ValidationMessage from './ValidationMessage';

export default function QRPreview({
  selectedType,
  payload,
  validation,
  qrDataUrl,
  isGenerating,
  generationError,
  customization,
  scanReliability,
  onSaveToRecent
}) {
  const [copyStatus, setCopyStatus] = useState(null); // null | 'copied-img' | 'copied-text' | 'error'
  const [downloadError, setDownloadError] = useState(null);
  const [savedToast, setSavedToast] = useState(false);

  const typeMeta = QR_TYPES.find((t) => t.id === selectedType) || QR_TYPES[0];
  const canExport = Boolean(validation?.isValid && qrDataUrl && !generationError);

  const handleDownloadPNG = () => {
    setDownloadError(null);
    if (!canExport) return;

    try {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-studio-${typeMeta.filenameSlug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Persist in Recent QR Codes automatically on download
      if (onSaveToRecent) {
        onSaveToRecent();
      }
    } catch (err) {
      setDownloadError(
        err?.message || 'Unable to trigger PNG download in this browser.'
      );
    }
  };

  const handleCopyQR = async () => {
    if (!canExport) return;
    setDownloadError(null);

    try {
      // Attempt copying PNG blob via ClipboardItem API
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof window.ClipboardItem !== 'undefined'
      ) {
        const response = await fetch(qrDataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new window.ClipboardItem({ 'image/png': blob })
        ]);
        setCopyStatus('copied-img');
      } else if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
        setCopyStatus('copied-text');
      } else {
        throw new Error('Clipboard API is not supported in this browser context.');
      }

      if (onSaveToRecent) {
        onSaveToRecent();
      }

      setTimeout(() => {
        setCopyStatus(null);
      }, 2600);
    } catch {
      // Fallback to text copy if image copy fails
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(payload);
          setCopyStatus('copied-text');
          setTimeout(() => setCopyStatus(null), 2600);
          return;
        }
      } catch {
        // Ignore secondary error
      }
      setCopyStatus('error');
      setTimeout(() => setCopyStatus(null), 3000);
    }
  };

  const handleManualSave = () => {
    if (!canExport || !onSaveToRecent) return;
    onSaveToRecent();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  };

  return (
    <aside className="qr-preview-panel" aria-label="Live QR Code Preview">
      <div className="qr-preview-card card">
        <div className="preview-card-header">
          <div className="preview-title-wrap">
            <span className="live-indicator-dot" aria-hidden="true" />
            <h2 className="preview-card-title">Live QR Preview</h2>
          </div>
          <span className="selected-type-badge" title={`Selected Type: ${typeMeta.label}`}>
            {typeMeta.label}
          </span>
        </div>

        {/* QR Stage */}
        <div className="qr-stage-container">
          {canExport ? (
            <div
              className="qr-canvas-frame"
              style={{
                backgroundColor: customization.bgColor || '#ffffff'
              }}
            >
              <img
                src={qrDataUrl}
                alt={`Generated ${typeMeta.label} QR Code`}
                className="qr-preview-img"
                width={Math.min(customization.size || 280, 280)}
                height={Math.min(customization.size || 280, 280)}
              />
            </div>
          ) : (
            <div className="qr-empty-state" role="status" aria-live="polite">
              <div className="empty-qr-icon-ring" aria-hidden="true">
                <QrCode size={44} strokeWidth={1.6} />
              </div>
              <h3 className="empty-state-heading">
                {validation?.isEmpty
                  ? `Waiting for ${typeMeta.label} Input`
                  : 'Complete Valid Input to Render'}
              </h3>
              <p className="empty-state-text">
                {validation?.isEmpty
                  ? `Enter your ${typeMeta.label.toLowerCase()} details on the left and your customized QR code will appear here in real time.`
                  : Object.values(validation?.errors || {})[0] ||
                    'Fix the highlighted input field to generate a scannable QR code.'}
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="qr-loading-badge" aria-live="polite">
              <Sparkles size={14} aria-hidden="true" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Scan Reliability Warning inside Preview */}
        {canExport && scanReliability?.warnings?.length > 0 && (
          <div className="preview-warning-banner" role="alert">
            <AlertTriangle size={16} aria-hidden="true" className="preview-warn-icon" />
            <span>{scanReliability.warnings[0]}</span>
          </div>
        )}

        {generationError && (
          <ValidationMessage message={generationError} type="error" />
        )}

        {downloadError && (
          <ValidationMessage message={downloadError} type="error" />
        )}

        {/* Metadata Specs Pill Row */}
        <div className="preview-specs-row" aria-label="Current QR Specifications">
          <span className="spec-chip">
            {customization.size}×{customization.size}px
          </span>
          <span className="spec-chip">
            ECC: <strong>{customization.errorCorrectionLevel}</strong>
          </span>
          <span className="spec-chip">
            Margin: <strong>{customization.margin}</strong>
          </span>
          <span className="spec-chip">
            Contrast: <strong>{scanReliability.contrastRatio}:1</strong>
          </span>
        </div>

        {/* Primary Export Actions */}
        <div className="preview-actions-stack">
          <button
            type="button"
            className="btn-primary-download"
            onClick={handleDownloadPNG}
            disabled={!canExport}
            aria-label={`Download PNG as qr-studio-${typeMeta.filenameSlug}.png`}
          >
            <Download size={19} aria-hidden="true" />
            <span>Download PNG</span>
            <span className="download-filename-hint">
              qr-studio-{typeMeta.filenameSlug}.png
            </span>
          </button>

          <div className="secondary-actions-row">
            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleCopyQR}
              disabled={!canExport}
            >
              {copyStatus === 'copied-img' || copyStatus === 'copied-text' ? (
                <>
                  <Check size={17} aria-hidden="true" />
                  <span>
                    {copyStatus === 'copied-img' ? 'Copied QR Image!' : 'Copied Payload!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy size={17} aria-hidden="true" />
                  <span>Copy QR</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-secondary-action"
              onClick={handleManualSave}
              disabled={!canExport}
              title="Save current QR code configuration to Recent QR Codes"
            >
              {savedToast ? (
                <>
                  <Check size={17} aria-hidden="true" />
                  <span>Saved to Recent!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus size={17} aria-hidden="true" />
                  <span>Save to Recent</span>
                </>
              )}
            </button>
          </div>

          {copyStatus === 'error' && (
            <ValidationMessage
              message="Clipboard access was denied by the browser. Please use Download PNG instead."
              type="warning"
            />
          )}
        </div>

        {/* Live Encoded Payload Inspector */}
        {canExport && payload && (
          <div className="payload-inspector">
            <div className="payload-inspector-header">
              <Code2 size={14} aria-hidden="true" />
              <span>Encoded QR Payload</span>
            </div>
            <code className="payload-code-box" title={payload}>
              {payload}
            </code>
          </div>
        )}
      </div>
    </aside>
  );
}
