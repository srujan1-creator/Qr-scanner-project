import React from 'react';
import { Sliders, RotateCcw, ArrowLeftRight, ShieldCheck } from 'lucide-react';
import Presets from './Presets';
import ValidationMessage from './ValidationMessage';

const ECC_LEVELS = [
  { id: 'L', label: 'L — Low (7%)', desc: 'Cleanest grid, best for large displays' },
  { id: 'M', label: 'M — Medium (15%)', desc: 'Balanced everyday standard' },
  { id: 'Q', label: 'Q — Quartile (25%)', desc: 'High resilience against wear' },
  { id: 'H', label: 'H — High (30%)', desc: 'Maximum damage & smudge recovery' }
];

export default function QRCustomizer({
  customization,
  onChangeCustomization,
  onSelectPreset,
  onResetCustomization,
  scanReliability
}) {
  const {
    size = 280,
    fgColor = '#111827',
    bgColor = '#ffffff',
    errorCorrectionLevel = 'M',
    margin = 4,
    presetId = 'classic'
  } = customization;

  const handleField = (key, value) => {
    onChangeCustomization({
      ...customization,
      [key]: value,
      presetId: 'custom'
    });
  };

  const handleHexInput = (key, rawValue) => {
    const val = rawValue.startsWith('#') ? rawValue : `#${rawValue}`;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      handleField(key, val);
    }
  };

  const handleSwapColors = () => {
    onChangeCustomization({
      ...customization,
      fgColor: bgColor,
      bgColor: fgColor,
      presetId: 'custom'
    });
  };

  return (
    <div className="qr-customizer-card card">
      <div className="section-header-row with-actions">
        <div className="section-title-group">
          <span className="step-pill">Step 3</span>
          <h2 className="section-title">
            <Sliders size={18} aria-hidden="true" />
            <span>Customize & Design</span>
          </h2>
        </div>

        <button
          type="button"
          className="btn-reset"
          onClick={onResetCustomization}
          title="Restore default QR appearance and settings"
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Visual Presets */}
      <Presets activePresetId={presetId} onSelectPreset={onSelectPreset} />

      <hr className="section-divider" />

      {/* Color Pickers */}
      <div className="customizer-grid">
        <div className="form-group">
          <label htmlFor="fg-color-picker" className="form-label">
            Foreground Color (Dots)
          </label>
          <div className="color-control-row">
            <input
              id="fg-color-picker"
              type="color"
              className="color-Well-input"
              value={/^#[0-9A-Fa-f]{6}$/.test(fgColor) ? fgColor : '#111827'}
              onChange={(e) => handleField('fgColor', e.target.value)}
              aria-label="Choose foreground color"
            />
            <input
              type="text"
              className="form-input color-hex-input"
              value={fgColor}
              onChange={(e) => handleHexInput('fgColor', e.target.value)}
              maxLength={7}
              aria-label="Foreground hex color code"
            />
          </div>
        </div>

        <div className="swap-colors-col">
          <button
            type="button"
            className="swap-colors-btn"
            onClick={handleSwapColors}
            aria-label="Swap foreground and background colors"
            title="Swap foreground and background colors"
          >
            <ArrowLeftRight size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="bg-color-picker" className="form-label">
            Background Color
          </label>
          <div className="color-control-row">
            <input
              id="bg-color-picker"
              type="color"
              className="color-Well-input"
              value={/^#[0-9A-Fa-f]{6}$/.test(bgColor) ? bgColor : '#ffffff'}
              onChange={(e) => handleField('bgColor', e.target.value)}
              aria-label="Choose background color"
            />
            <input
              type="text"
              className="form-input color-hex-input"
              value={bgColor}
              onChange={(e) => handleHexInput('bgColor', e.target.value)}
              maxLength={7}
              aria-label="Background hex color code"
            />
          </div>
        </div>
      </div>

      {/* Scan Reliability / Contrast Warning Feedback */}
      <div className="contrast-status-bar">
        <div className="contrast-ratio-pill">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>
            Contrast Ratio: <strong>{scanReliability.contrastRatio}:1</strong>
          </span>
          <span className={`reliability-badge badge-${scanReliability.level}`}>
            {scanReliability.level === 'excellent' && 'Excellent Scanability'}
            {scanReliability.level === 'good' && 'Good Scanability'}
            {scanReliability.level === 'warning' && 'Caution'}
            {scanReliability.level === 'critical' && 'Low Readability'}
          </span>
        </div>

        {scanReliability.warnings.length > 0 && (
          <div className="reliability-warnings-stack">
            {scanReliability.warnings.map((warnText, idx) => (
              <ValidationMessage
                key={idx}
                message={warnText}
                type={scanReliability.level === 'critical' ? 'error' : 'warning'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sliders for Size & Margin */}
      <div className="sliders-two-col">
        <div className="form-group">
          <div className="label-row">
            <label htmlFor="qr-size-slider" className="form-label">
              QR Size (Resolution)
            </label>
            <span className="slider-value-badge">{size} × {size} px</span>
          </div>
          <input
            id="qr-size-slider"
            type="range"
            min="140"
            max="512"
            step="4"
            className="range-slider"
            value={size}
            onChange={(e) => handleField('size', Number(e.target.value))}
          />
          <div className="slider-ticks">
            <span>140px</span>
            <span>280px</span>
            <span>512px</span>
          </div>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="qr-margin-slider" className="form-label">
              Quiet Zone (Margin / Padding)
            </label>
            <span className="slider-value-badge">{margin} modules</span>
          </div>
          <input
            id="qr-margin-slider"
            type="range"
            min="0"
            max="8"
            step="1"
            className="range-slider"
            value={margin}
            onChange={(e) => handleField('margin', Number(e.target.value))}
          />
          <div className="slider-ticks">
            <span>0 (None)</span>
            <span>4 (Standard)</span>
            <span>8 (Wide)</span>
          </div>
        </div>
      </div>

      {/* Error Correction Level */}
      <div className="form-group ecc-group">
        <label className="form-label">Error Correction Level</label>
        <div
          className="ecc-options-grid"
          role="radiogroup"
          aria-label="Error Correction Level"
        >
          {ECC_LEVELS.map((ecc) => {
            const isSelected = errorCorrectionLevel === ecc.id;
            return (
              <button
                key={ecc.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`ecc-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleField('errorCorrectionLevel', ecc.id)}
              >
                <span className="ecc-code">{ecc.id}</span>
                <div className="ecc-text">
                  <span className="ecc-name">{ecc.label}</span>
                  <span className="ecc-desc">{ecc.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
