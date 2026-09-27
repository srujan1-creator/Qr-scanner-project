import React, { useState } from 'react';
import { Wifi, Lock, Eye, EyeOff } from 'lucide-react';
import ValidationMessage from './ValidationMessage';

export default function WifiForm({ data, onChange, errors = {}, touched = false }) {
  const [showPassword, setShowPassword] = useState(false);

  const encryption = data.encryption || 'WPA';
  const isNoPass = encryption === 'nopass';
  const showSsidError = (touched || data.ssid?.length > 0) && errors.ssid;
  const showPasswordError =
    !isNoPass && (touched || data.password?.length > 0 || data.ssid?.length > 0) && errors.password;

  const handleFieldChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="form-fields-stack">
      <div className="form-row-two-col">
        <div className="form-group">
          <label htmlFor="qr-wifi-ssid" className="form-label">
            Network Name (SSID) <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div className="input-with-icon">
            <Wifi size={18} className="input-leading-icon" aria-hidden="true" />
            <input
              id="qr-wifi-ssid"
              type="text"
              className={`form-input has-leading-icon ${showSsidError ? 'input-error' : ''}`}
              placeholder="GDG_SRM_Campus_5G"
              value={data.ssid || ''}
              onChange={(e) => handleFieldChange('ssid', e.target.value)}
              aria-invalid={Boolean(showSsidError)}
              aria-describedby={showSsidError ? 'wifi-ssid-error' : undefined}
            />
          </div>
          {showSsidError && (
            <ValidationMessage id="wifi-ssid-error" message={errors.ssid} type="error" />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="qr-wifi-encryption" className="form-label">
            Encryption Security
          </label>
          <select
            id="qr-wifi-encryption"
            className="form-select"
            value={encryption}
            onChange={(e) => handleFieldChange('encryption', e.target.value)}
          >
            <option value="WPA">WPA / WPA2 / WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None (Open Network)</option>
          </select>
        </div>
      </div>

      {!isNoPass && (
        <div className="form-group">
          <label htmlFor="qr-wifi-password" className="form-label">
            Wi-Fi Password <span className="required-star" aria-hidden="true">*</span>
          </label>
          <div className="input-with-icon has-trailing-btn">
            <Lock size={18} className="input-leading-icon" aria-hidden="true" />
            <input
              id="qr-wifi-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input has-leading-icon has-trailing-action ${
                showPasswordError ? 'input-error' : ''
              }`}
              placeholder={
                encryption === 'WPA'
                  ? 'Enter WPA password (min. 8 characters)'
                  : 'Enter WEP network key'
              }
              value={data.password || ''}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              aria-invalid={Boolean(showPasswordError)}
              aria-describedby={showPasswordError ? 'wifi-password-error' : undefined}
            />
            <button
              type="button"
              className="password-reveal-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide Wi-Fi password' : 'Show Wi-Fi password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {showPasswordError && (
            <ValidationMessage id="wifi-password-error" message={errors.password} type="error" />
          )}
        </div>
      )}

      <div className="form-group checkbox-group">
        <label htmlFor="qr-wifi-hidden" className="checkbox-label">
          <input
            id="qr-wifi-hidden"
            type="checkbox"
            className="form-checkbox"
            checked={Boolean(data.hidden)}
            onChange={(e) => handleFieldChange('hidden', e.target.checked)}
          />
          <span className="checkbox-text">
            <strong>Hidden Network</strong> — This SSID does not broadcast publicly
          </span>
        </label>
      </div>
    </div>
  );
}
