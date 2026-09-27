import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import QRTypeSelector from './components/QRTypeSelector';
import QRForm from './components/QRForm';
import QRCustomizer from './components/QRCustomizer';
import QRPreview from './components/QRPreview';
import RecentQRCodes from './components/RecentQRCodes';
import ValidationMessage from './components/ValidationMessage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useQRCode } from './hooks/useQRCode';
import {
  DEFAULT_FORM_DATA,
  SAMPLE_FORM_DATA,
  generateQRPayload
} from './utils/qrPayload';
import { validateQRInput } from './utils/validation';
import {
  DEFAULT_CUSTOMIZATION,
  evaluateScanReliability
} from './utils/contrast';
import {
  RECENT_QR_STORAGE_KEY,
  THEME_STORAGE_KEY,
  buildRecentEntry,
  upsertRecentQRList
} from './utils/qrStorage';

export default function App() {
  const [theme, setTheme, themeStorageError] = useLocalStorage(
    THEME_STORAGE_KEY,
    'light'
  );

  useEffect(() => {
    const activeTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const [activeSection, setActiveSection] = useState('generator');
  const [selectedType, setSelectedType] = useState('url');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);

  const [recentItems, setRecentItems, recentStorageError] = useLocalStorage(
    RECENT_QR_STORAGE_KEY,
    []
  );

  const validation = useMemo(
    () => validateQRInput(selectedType, formData),
    [selectedType, formData]
  );

  const payload = useMemo(() => {
    if (!validation.isValid) return '';
    return generateQRPayload(selectedType, formData);
  }, [selectedType, formData, validation.isValid]);

  const scanReliability = useMemo(
    () =>
      evaluateScanReliability({
        fgColor: customization.fgColor,
        bgColor: customization.bgColor,
        size: customization.size,
        margin: customization.margin,
        payloadLength: payload.length
      }),
    [
      customization.fgColor,
      customization.bgColor,
      customization.size,
      customization.margin,
      payload.length
    ]
  );

  const { qrDataUrl, isGenerating, generationError } = useQRCode({
    payload,
    isValid: validation.isValid,
    size: customization.size,
    fgColor: customization.fgColor,
    bgColor: customization.bgColor,
    errorCorrectionLevel: customization.errorCorrectionLevel,
    margin: customization.margin
  });

  const saveCurrentToRecent = useCallback(() => {
    if (!validation.isValid || !payload || !qrDataUrl) return;

    const currentTypeData = formData[selectedType] || {};
    const entry = buildRecentEntry({
      type: selectedType,
      typeData: currentTypeData,
      customization,
      payload,
      dataUrl: qrDataUrl
    });

    setRecentItems((prev) => upsertRecentQRList(prev, entry));
  }, [
    validation.isValid,
    payload,
    qrDataUrl,
    formData,
    selectedType,
    customization,
    setRecentItems
  ]);

  const autoSaveTimerRef = useRef(null);
  useEffect(() => {
    if (!validation.isValid || !payload || !qrDataUrl) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveCurrentToRecent();
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [payload, qrDataUrl, validation.isValid, saveCurrentToRecent]);

  const handleUpdateTypeData = useCallback((typeKey, updatedFields) => {
    setFormData((prev) => ({
      ...prev,
      [typeKey]: updatedFields
    }));
  }, []);

  const handleFillSample = useCallback((typeKey) => {
    const sample = SAMPLE_FORM_DATA[typeKey];
    if (sample) {
      setFormData((prev) => ({
        ...prev,
        [typeKey]: { ...sample }
      }));
    }
  }, []);

  const handleClearCurrentType = useCallback((typeKey) => {
    const emptyMap = {
      url: { url: '' },
      text: { text: '' },
      email: { email: '', subject: '', body: '' },
      phone: { phone: '' },
      wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false }
    };
    setFormData((prev) => ({
      ...prev,
      [typeKey]: emptyMap[typeKey] || {}
    }));
  }, []);

  const handleSelectPreset = useCallback((preset) => {
    setCustomization((prev) => ({
      ...prev,
      fgColor: preset.fgColor,
      bgColor: preset.bgColor,
      errorCorrectionLevel: preset.errorCorrectionLevel,
      margin: preset.margin,
      presetId: preset.id
    }));
  }, []);

  const handleResetCustomization = useCallback(() => {
    setCustomization(DEFAULT_CUSTOMIZATION);
  }, []);

  const handleNavigate = useCallback((section) => {
    setActiveSection(section);
    const targetId =
      section === 'recent' ? 'recent-qr-section' : 'generator-top-section';
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleReuseRecentItem = useCallback((item) => {
    if (!item || !item.type) return;

    setSelectedType(item.type);
    if (item.inputData) {
      setFormData((prev) => ({
        ...prev,
        [item.type]: { ...item.inputData }
      }));
    }
    if (item.customization) {
      setCustomization({
        ...DEFAULT_CUSTOMIZATION,
        ...item.customization
      });
    }
    setActiveSection('generator');
    const topEl = document.getElementById('generator-top-section');
    if (topEl) {
      topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleDeleteRecentItem = useCallback(
    (id) => {
      setRecentItems((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item.id !== id) : []
      );
    },
    [setRecentItems]
  );

  const handleClearAllRecent = useCallback(() => {
    setRecentItems([]);
  }, [setRecentItems]);

  return (
    <div className="app-shell">
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        recentCount={Array.isArray(recentItems) ? recentItems.length : 0}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="main-content container">
        <section id="generator-top-section" className="hero-heading-section">
          <div className="hero-heading-content">
            <span className="eyebrow-badge">
              QR Code Generator &amp; Designer
            </span>
            <h1 className="main-page-heading">Create your QR code</h1>
            <p className="main-page-subtitle">
              Choose a QR type, customize colors and error recovery, check contrast in
              real time, and export clean PNGs directly from your browser.
            </p>
          </div>
        </section>

        {(themeStorageError || recentStorageError) && (
          <div className="storage-warning-wrap">
            <ValidationMessage
              message={
                recentStorageError ||
                themeStorageError ||
                'Browser localStorage is restricted; recent items may only persist for this session.'
              }
              type="warning"
            />
          </div>
        )}

        <div className="workspace-grid">
          <div className="workspace-left-panel">
            <QRTypeSelector
              selectedType={selectedType}
              onSelectType={setSelectedType}
            />

            <QRForm
              selectedType={selectedType}
              formData={formData}
              onUpdateTypeData={handleUpdateTypeData}
              onFillSample={handleFillSample}
              onClearCurrentType={handleClearCurrentType}
              validation={validation}
            />

            <QRCustomizer
              customization={customization}
              onChangeCustomization={setCustomization}
              onSelectPreset={handleSelectPreset}
              onResetCustomization={handleResetCustomization}
              scanReliability={scanReliability}
            />
          </div>

          <div className="workspace-right-panel">
            <QRPreview
              selectedType={selectedType}
              payload={payload}
              validation={validation}
              qrDataUrl={qrDataUrl}
              isGenerating={isGenerating}
              generationError={generationError}
              customization={customization}
              scanReliability={scanReliability}
              onSaveToRecent={saveCurrentToRecent}
            />
          </div>
        </div>

        <RecentQRCodes
          recentItems={Array.isArray(recentItems) ? recentItems : []}
          onReuseItem={handleReuseRecentItem}
          onDeleteItem={handleDeleteRecentItem}
          onClearAll={handleClearAllRecent}
        />
      </main>

      <footer className="app-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <strong>QR Studio</strong> — Built by Srujan (@srujan1-creator)
          </div>
          <p className="footer-meta">
            React + Vite · GDG on Campus SRM Technical Domain Task
          </p>
        </div>
      </footer>
    </div>
  );
}
