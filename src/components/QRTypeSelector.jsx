import React from 'react';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import { QR_TYPES } from '../utils/qrPayload';

const TYPE_ICONS = {
  url: Globe,
  text: FileText,
  email: Mail,
  phone: Phone,
  wifi: Wifi
};

export default function QRTypeSelector({ selectedType, onSelectType }) {
  return (
    <div className="qr-type-selector-card card">
      <div className="section-header-row">
        <span className="step-pill">Step 1</span>
        <h2 className="section-title">Select QR Content Type</h2>
      </div>

      <div
        className="qr-type-grid"
        role="tablist"
        aria-label="QR Code Content Types"
      >
        {QR_TYPES.map((typeObj) => {
          const IconComponent = TYPE_ICONS[typeObj.id] || Globe;
          const isSelected = selectedType === typeObj.id;

          return (
            <button
              key={typeObj.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`qr-type-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectType(typeObj.id)}
            >
              <span className="qr-type-icon-wrap" aria-hidden="true">
                <IconComponent size={20} />
              </span>
              <span className="qr-type-label">{typeObj.label}</span>
              <span className="qr-type-desc">{typeObj.shortDesc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
