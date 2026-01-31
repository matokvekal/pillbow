import React from 'react';
import { useReminderStore } from '../../store/useReminderStore';
import './ReminderBell.css';

export const ReminderBell: React.FC = () => {
  const { enabled, openModal } = useReminderStore();

  return (
    <button
      className={`reminder-bell ${enabled ? 'reminder-bell--active' : ''}`}
      onClick={openModal}
      aria-label={enabled ? 'Reminders on - tap to configure' : 'Reminders off - tap to enable'}
    >
      <svg
        className="reminder-bell__icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};
