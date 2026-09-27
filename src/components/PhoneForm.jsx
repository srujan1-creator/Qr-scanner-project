import React from 'react';
import { PhoneCall } from 'lucide-react';
import ValidationMessage from './ValidationMessage';

export default function PhoneForm({ data, onChange, errors = {}, touched = false }) {
  const showError = (touched || data.phone?.length > 0) && errors.phone;

  return (
    <div className="form-fields-stack">
      <div className="form-group">
        <label htmlFor="qr-phone-input" className="form-label">
          Phone Number <span className="required-star" aria-hidden="true">*</span>
        </label>
        <div className="input-with-icon">
          <PhoneCall size={18} className="input-leading-icon" aria-hidden="true" />
          <input
            id="qr-phone-input"
            type="tel"
            className={`form-input has-leading-icon ${showError ? 'input-error' : ''}`}
            placeholder="+91 98765 43210"
            value={data.phone || ''}
            onChange={(e) => onChange({ phone: e.target.value })}
            aria-invalid={Boolean(showError)}
            aria-describedby={showError ? 'phone-error-msg' : 'phone-helper-msg'}
            autoComplete="tel"
          />
        </div>
        <p id="phone-helper-msg" className="field-hint">
          Include country code (e.g., +91) for international dialing compatibility.
        </p>
        {showError && (
          <ValidationMessage id="phone-error-msg" message={errors.phone} type="error" />
        )}
      </div>
    </div>
  );
}
