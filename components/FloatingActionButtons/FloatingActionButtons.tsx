import React from "react";
import classNames from "classnames";
import "./FloatingActionButtons.css";

interface FloatingActionButtonsProps {
  isScanning: boolean;
  onScan: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTodayClick: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  isScanning,
  onScan,
  onTodayClick,
}) => {
  return (
    <div className={classNames("fab-container")}>
      <button
        onClick={onTodayClick}
        className={classNames("fab-today-btn")}
        aria-label="Scroll to today"
      >
        <div className={classNames("fab-today-content")}>
          <span className={classNames("fab-today-text")}>TODAY</span>
          <div className={classNames("fab-today-dot")} />
        </div>
      </button>

      <div className={classNames("fab-add-container")}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onScan}
          className={classNames("fab-add-input")}
          disabled={isScanning}
          aria-label="Scan medication from image"
        />
        <button
          className={classNames("fab-add-btn", {
            "fab-add-btn--scanning": isScanning,
          })}
          disabled={isScanning}
          aria-label="Add medication from image"
        >
          <svg
            className={classNames("fab-add-icon")}
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
