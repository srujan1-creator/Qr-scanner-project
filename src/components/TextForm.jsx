import React from 'react';
import ValidationMessage from './ValidationMessage';

export default function TextForm({ data, onChange, errors = {}, touched = false }) {
  const textValue = data.text || '';
  const charCount = textValue.trim().length;
  const showError = (touched || textValue.length > 0) && errors.text;

  return (
    <div className="form-fields-stack">
      <div className="form-group">
        <div className="label-row">
          <label htmlFor="qr-text-input" className="form-label">
            Plain Text Content <span className="required-star" aria-hidden="true">*</span>
          </label>
          <span
            className={`char-counter ${charCount > 1200 ? 'char-counter-danger' : ''}`}
            aria-live="polite"
          >
            {charCount} / 1200 chars
          </span>
        </div>
        <textarea
          id="qr-text-input"
          rows={4}
          className={`form-textarea ${showError ? 'input-error' : ''}`}
          placeholder="Type or paste any text, note, code snippet, or event details..."
          value={textValue}
          onChange={(e) => onChange({ text: e.target.value })}
          aria-invalid={Boolean(showError)}
          aria-describedby={showError ? 'text-error-msg' : 'text-helper-msg'}
        />
        <p id="text-helper-msg" className="field-hint">
          Plain text QR codes work completely offline when scanned by any smartphone camera.
        </p>
        {showError && (
          <ValidationMessage id="text-error-msg" message={errors.text} type="error" />
        )}
      </div>
    </div>
  );
}
