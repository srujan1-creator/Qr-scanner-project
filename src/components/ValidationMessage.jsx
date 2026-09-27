import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

/**
 * Accessible message component that pairs icons + text (never relying on color alone)
 * for form validation errors, contrast warnings, or status feedback.
 */
export default function ValidationMessage({
  message,
  type = 'error', // 'error' | 'warning' | 'info' | 'success'
  id
}) {
  if (!message) return null;

  const iconMap = {
    error: <AlertCircle size={16} aria-hidden="true" className="validation-icon" />,
    warning: <AlertTriangle size={16} aria-hidden="true" className="validation-icon" />,
    info: <Info size={16} aria-hidden="true" className="validation-icon" />,
    success: <CheckCircle2 size={16} aria-hidden="true" className="validation-icon" />
  };

  return (
    <div
      id={id}
      className={`validation-message validation-${type}`}
      role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {iconMap[type] || iconMap.error}
      <span>{message}</span>
    </div>
  );
}
