import React, { useEffect } from 'react';
import './ReminderToast.css';

interface ReminderToastProps {
  medicationName: string;
  time: string;
  minutesUntil: number;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 8000;

export const ReminderToast: React.FC<ReminderToastProps> = ({
  medicationName,
  time,
  minutesUntil,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="reminder-toast" role="alert">
      <span className="reminder-toast__icon">🔔</span>
      <div className="reminder-toast__text">
        <strong>{medicationName}</strong>
        <span>in {minutesUntil} min ({time})</span>
      </div>
      <button className="reminder-toast__dismiss" onClick={onDismiss} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
};
