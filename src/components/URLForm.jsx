import React from 'react';
import { Link2 } from 'lucide-react';
import ValidationMessage from './ValidationMessage';

export default function URLForm({ data, onChange, errors = {}, touched = false }) {
  const showError = (touched || data.url?.length > 0) && errors.url;

  return (
    <div className="form-fields-stack">
      <div className="form-group">
        <label htmlFor="qr-url-input" className="form-label">
          Website URL <span className="required-star" aria-hidden="true">*</span>
        </label>
        <div className="input-with-icon">
          <Link2 size={18} className="input-leading-icon" aria-hidden="true" />
          <input
            id="qr-url-input"
            type="url"
            className={`form-input has-leading-icon ${showError ? 'input-error' : ''}`}
            placeholder="https://gdg.community.dev"
            value={data.url || ''}
            onChange={(e) => onChange({ url: e.target.value })}
            aria-invalid={Boolean(showError)}
            aria-describedby={showError ? 'url-error-msg' : 'url-helper-msg'}
            autoComplete="url"
          />
        </div>
        <p id="url-helper-msg" className="field-hint">
          Enter any full web address (http:// or https://). Missing protocols default to https://.
        </p>
        {showError && (
          <ValidationMessage id="url-error-msg" message={errors.url} type="error" />
        )}
      </div>
    </div>
  );
}
