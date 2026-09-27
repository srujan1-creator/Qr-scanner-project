import React from 'react';
import { Wand2, Eraser } from 'lucide-react';
import URLForm from './URLForm';
import TextForm from './TextForm';
import EmailForm from './EmailForm';
import PhoneForm from './PhoneForm';
import WifiForm from './WifiForm';
import { QR_TYPES } from '../utils/qrPayload';

export default function QRForm({
  selectedType,
  formData,
  onUpdateTypeData,
  onFillSample,
  onClearCurrentType,
  validation
}) {
  const activeTypeMeta = QR_TYPES.find((t) => t.id === selectedType) || QR_TYPES[0];
  const currentData = formData[selectedType] || {};
  const errors = validation?.errors || {};

  return (
    <div className="qr-form-card card">
      <div className="section-header-row with-actions">
        <div className="section-title-group">
          <span className="step-pill">Step 2</span>
          <h2 className="section-title">{activeTypeMeta.label} Details</h2>
        </div>

        <div className="form-quick-actions">
          <button
            type="button"
            className="btn-ghost-sm"
            onClick={() => onFillSample(selectedType)}
            title="Fill with sample data to test quickly"
          >
            <Wand2 size={14} aria-hidden="true" />
            <span>Fill Sample</span>
          </button>
          <button
            type="button"
            className="btn-ghost-sm"
            onClick={() => onClearCurrentType(selectedType)}
            title="Clear current form inputs"
          >
            <Eraser size={14} aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="qr-form-body">
        {selectedType === 'url' && (
          <URLForm
            data={currentData}
            onChange={(updated) => onUpdateTypeData('url', updated)}
            errors={errors}
          />
        )}

        {selectedType === 'text' && (
          <TextForm
            data={currentData}
            onChange={(updated) => onUpdateTypeData('text', updated)}
            errors={errors}
          />
        )}

        {selectedType === 'email' && (
          <EmailForm
            data={currentData}
            onChange={(updated) => onUpdateTypeData('email', updated)}
            errors={errors}
          />
        )}

        {selectedType === 'phone' && (
          <PhoneForm
            data={currentData}
            onChange={(updated) => onUpdateTypeData('phone', updated)}
            errors={errors}
          />
        )}

        {selectedType === 'wifi' && (
          <WifiForm
            data={currentData}
            onChange={(updated) => onUpdateTypeData('wifi', updated)}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
}
