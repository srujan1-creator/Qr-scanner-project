import React from 'react';
import { AtSign } from 'lucide-react';
import ValidationMessage from './ValidationMessage';

export default function EmailForm({ data, onChange, errors = {}, touched = false }) {
  const showEmailError = (touched || data.email?.length > 0) && errors.email;

  const handleFieldChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="form-fields-stack">
      <div className="form-group">
        <label htmlFor="qr-email-address" className="form-label">
          Recipient Email Address <span className="required-star" aria-hidden="true">*</span>
        </label>
        <div className="input-with-icon">
          <AtSign size={18} className="input-leading-icon" aria-hidden="true" />
          <input
            id="qr-email-address"
            type="email"
            className={`form-input has-leading-icon ${showEmailError ? 'input-error' : ''}`}
            placeholder="gdg@srmist.edu.in"
            value={data.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            aria-invalid={Boolean(showEmailError)}
            aria-describedby={showEmailError ? 'email-error-msg' : undefined}
            autoComplete="email"
          />
        </div>
        {showEmailError && (
          <ValidationMessage id="email-error-msg" message={errors.email} type="error" />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="qr-email-subject" className="form-label">
          Email Subject <span className="optional-tag">(Optional)</span>
        </label>
        <input
          id="qr-email-subject"
          type="text"
          className={`form-input ${errors.subject ? 'input-error' : ''}`}
          placeholder="Technical Domain Inquiry"
          value={data.subject || ''}
          onChange={(e) => handleFieldChange('subject', e.target.value)}
          aria-invalid={Boolean(errors.subject)}
        />
        {errors.subject && (
          <ValidationMessage message={errors.subject} type="error" />
        )}
      </div>

      <div className="form-group">
        <label htmlFor="qr-email-body" className="form-label">
          Message Body <span className="optional-tag">(Optional)</span>
        </label>
        <textarea
          id="qr-email-body"
          rows={3}
          className={`form-textarea ${errors.body ? 'input-error' : ''}`}
          placeholder="Write the pre-filled email message..."
          value={data.body || ''}
          onChange={(e) => handleFieldChange('body', e.target.value)}
          aria-invalid={Boolean(errors.body)}
        />
        {errors.body && (
          <ValidationMessage message={errors.body} type="error" />
        )}
      </div>
    </div>
  );
}
