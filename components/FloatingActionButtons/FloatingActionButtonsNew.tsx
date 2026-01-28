import React from "react";
import "./FloatingActionButtons.css";

interface FloatingActionButtonsProps {
  isScanning: boolean;
  onScan: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTodayClick: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  isScanning,
  onScan,
  onTodayClick
}) => {
  const fabAddBtnClass = isScanning
    ? "fab-add-btn fab-add-btn--scanning"
    : "fab-add-btn";

  return (
    <div className="fab-container">
      <button
        className="fab-today-btn"
        onClick={onTodayClick}
        aria-label="Scroll to today"
      >
        <div className="fab-today-content">
          <span className="fab-today-text">TODAY-</span>
          <div className="fab-today-dot" />
        </div>
      </button>

      <div className="fab-add-container">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onScan}
          className="fab-add-input"
          disabled={isScanning}
          aria-label="Scan medication from image"
        />
        <button
          className={fabAddBtnClass}
          disabled={isScanning}
          aria-label="Add medication from image"
        >
          <svg
            className="fab-add-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4v16m8-8H4" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};
