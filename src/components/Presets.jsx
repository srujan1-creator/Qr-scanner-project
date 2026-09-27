import React from 'react';
import { Palette, Check } from 'lucide-react';
import { VISUAL_PRESETS } from '../utils/contrast';

export default function Presets({ activePresetId, onSelectPreset }) {
  return (
    <div className="presets-section">
      <div className="subsection-header">
        <span className="subsection-title">
          <Palette size={16} aria-hidden="true" />
          Visual Style Presets
        </span>
        <span className="subsection-subtitle">
          One-click themes — customize freely afterward
        </span>
      </div>

      <div className="presets-grid" role="group" aria-label="Visual Presets">
        {VISUAL_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-card-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectPreset(preset)}
              aria-pressed={isSelected}
              title={preset.description}
            >
              <div className="preset-swatch-pair" aria-hidden="true">
                <span
                  className="swatch-outer"
                  style={{ backgroundColor: preset.bgColor }}
                >
                  <span
                    className="swatch-inner"
                    style={{ backgroundColor: preset.fgColor }}
                  />
                </span>
              </div>

              <div className="preset-info">
                <span className="preset-name">
                  {preset.name}
                  {isSelected && <Check size={13} className="preset-check" aria-hidden="true" />}
                </span>
                <span className="preset-meta">
                  ECC {preset.errorCorrectionLevel} · Margin {preset.margin}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
