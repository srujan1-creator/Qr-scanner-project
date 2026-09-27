import React from 'react';
import { QrCode, Sparkles, History } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({
  activeSection,
  onNavigate,
  recentCount = 0,
  theme,
  onToggleTheme
}) {
  return (
    <header className="app-header">
      <div className="container header-inner">
        <div className="brand-group">
          <div className="brand-logo" aria-hidden="true">
            <QrCode size={26} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-name">QR Studio</span>
              <span className="brand-badge">GDG SRM</span>
            </div>
            <p className="brand-subtitle">
              Create beautiful, customizable QR codes instantly.
            </p>
          </div>
        </div>

        <nav className="header-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-link-btn ${activeSection === 'generator' ? 'active' : ''}`}
            onClick={() => onNavigate('generator')}
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>Generator</span>
          </button>

          <button
            type="button"
            className={`nav-link-btn ${activeSection === 'recent' ? 'active' : ''}`}
            onClick={() => onNavigate('recent')}
          >
            <History size={16} aria-hidden="true" />
            <span>Recent</span>
            {recentCount > 0 && (
              <span className="nav-count-badge" aria-label={`${recentCount} recent QR codes`}>
                {recentCount}
              </span>
            )}
          </button>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </nav>
      </div>
    </header>
  );
}
