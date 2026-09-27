import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle-btn"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <>
          <Sun size={18} aria-hidden="true" className="theme-icon sun-icon" />
          <span className="theme-toggle-label">Light</span>
        </>
      ) : (
        <>
          <Moon size={18} aria-hidden="true" className="theme-icon moon-icon" />
          <span className="theme-toggle-label">Dark</span>
        </>
      )}
    </button>
  );
}
