import React from 'react';
import {
  History,
  RotateCcw,
  Trash2,
  Clock,
  QrCode,
  Sparkles
} from 'lucide-react';
import { QR_TYPES } from '../utils/qrPayload';
import { formatTimestamp, MAX_RECENT_ITEMS } from '../utils/qrStorage';

export default function RecentQRCodes({
  recentItems = [],
  onReuseItem,
  onDeleteItem,
  onClearAll
}) {
  const getTypeLabel = (typeId) => {
    const found = QR_TYPES.find((t) => t.id === typeId);
    return found ? found.label : String(typeId || 'QR').toUpperCase();
  };

  return (
    <section
      id="recent-qr-section"
      className="recent-qr-section"
      aria-labelledby="recent-qr-heading"
    >
      <div className="recent-section-header">
        <div className="recent-title-group">
          <div className="recent-icon-box" aria-hidden="true">
            <History size={20} />
          </div>
          <div>
            <h2 id="recent-qr-heading" className="recent-heading">
              Recent QR Codes
            </h2>
            <p className="recent-subtitle">
              Automatically saved in your browser (up to {MAX_RECENT_ITEMS} recent designs).
              Restore any configuration with one click.
            </p>
          </div>
        </div>

        {recentItems.length > 0 && (
          <button
            type="button"
            className="btn-clear-all"
            onClick={onClearAll}
            title="Remove all recent QR codes from browser storage"
          >
            <Trash2 size={15} aria-hidden="true" />
            <span>Clear All ({recentItems.length})</span>
          </button>
        )}
      </div>

      {recentItems.length === 0 ? (
        <div className="recent-empty-card card">
          <div className="recent-empty-icon" aria-hidden="true">
            <QrCode size={36} strokeWidth={1.6} />
          </div>
          <h3 className="recent-empty-title">No Recent QR Codes Yet</h3>
          <p className="recent-empty-desc">
            When you generate, download, copy, or click{' '}
            <strong>&ldquo;Save to Recent&rdquo;</strong> on any QR code, it will
            be saved here automatically so you can reuse or edit it anytime —
            even after refreshing the page.
          </p>
        </div>
      ) : (
        <div className="recent-grid">
          {recentItems.map((item) => {
            const typeLabel = getTypeLabel(item.type);
            const fg = item.customization?.fgColor || '#111827';
            const bg = item.customization?.bgColor || '#ffffff';
            const ecc = item.customization?.errorCorrectionLevel || 'M';

            return (
              <article key={item.id} className="recent-item-card card">
                <div className="recent-item-top">
                  <div
                    className="recent-thumb-box"
                    style={{ backgroundColor: bg }}
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={`${typeLabel} QR thumbnail`}
                        className="recent-thumb-img"
                        width={72}
                        height={72}
                      />
                    ) : (
                      <QrCode size={40} color={fg} />
                    )}
                  </div>

                  <div className="recent-item-info">
                    <div className="recent-badges-row">
                      <span className="recent-type-pill">{typeLabel}</span>
                      <span className="recent-preset-pill">
                        ECC {ecc} · {item.customization?.size || 280}px
                      </span>
                    </div>

                    <p className="recent-item-summary" title={item.summary}>
                      {item.summary}
                    </p>

                    <div className="recent-item-time">
                      <Clock size={13} aria-hidden="true" />
                      <time dateTime={item.createdAt}>
                        {formatTimestamp(item.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>

                <div className="recent-item-actions">
                  <button
                    type="button"
                    className="btn-reuse"
                    onClick={() => onReuseItem(item)}
                    aria-label={`Reuse ${typeLabel} QR code: ${item.summary}`}
                  >
                    <RotateCcw size={15} aria-hidden="true" />
                    <span>Reuse</span>
                  </button>

                  <button
                    type="button"
                    className="btn-delete-item"
                    onClick={() => onDeleteItem(item.id)}
                    aria-label={`Delete ${typeLabel} QR code from recent list`}
                    title="Delete from recent history"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
