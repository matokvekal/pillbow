import React from 'react';
import { useReminderStore, ReminderLeadTime } from '../../store/useReminderStore';
import './ReminderModal.css';

const LEAD_TIME_OPTIONS: { value: ReminderLeadTime; label: string }[] = [
  { value: 10, label: '10 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
];

export const ReminderModal: React.FC = () => {
  const {
    enabled,
    leadTimeMinutes,
    isModalOpen,
    permissionGranted,
    setEnabled,
    setLeadTime,
    closeModal,
    setPermissionGranted,
  } = useReminderStore();

  if (!isModalOpen) return null;

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    if (newEnabled && !permissionGranted && 'Notification' in window) {
      Notification.requestPermission().then((result) => {
        setPermissionGranted(result === 'granted');
      });
    }
  };

  return (
    <div className="reminder-overlay" onClick={closeModal}>
      <div className="reminder-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="reminder-modal__close" onClick={closeModal} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="reminder-modal__title">Reminders</h2>

        {/* Enable/Disable */}
        <button
          className={`reminder-modal__toggle ${enabled ? 'reminder-modal__toggle--on' : ''}`}
          onClick={handleToggle}
        >
          <span className="reminder-modal__toggle-icon">{enabled ? '🔔' : '🔕'}</span>
          <span className="reminder-modal__toggle-label">
            {enabled ? 'Reminders On' : 'Reminders Off'}
          </span>
        </button>

        {/* Lead time options */}
        {enabled && (
          <div className="reminder-modal__options">
            <span className="reminder-modal__options-label">Notify me before each dose:</span>
            <div className="reminder-modal__options-grid">
              {LEAD_TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`reminder-modal__option ${
                    leadTimeMinutes === opt.value ? 'reminder-modal__option--selected' : ''
                  }`}
                  onClick={() => setLeadTime(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Permission notice */}
        {enabled && !permissionGranted && 'Notification' in window && (
          <p className="reminder-modal__notice">
            Allow browser notifications for alerts when this tab is in the background.
          </p>
        )}
      </div>
    </div>
  );
};
