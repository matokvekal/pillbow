import React from "react";
import classNames from "classnames";
import "./FloatingActionButtons.css";

interface FloatingActionButtonsProps {
  onAddClick: () => void;
  onTodayClick: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onAddClick,
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

      <button
        className={classNames("fab-add-btn")}
        onClick={onAddClick}
        aria-label="Add new medication"
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
  );
};
