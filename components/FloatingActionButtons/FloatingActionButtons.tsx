import React from "react";
import classNames from "classnames";
import { useModalStore } from "../../store/useModalStore";
import "./FloatingActionButtons.css";

interface FloatingActionButtonsProps {
  onAddClick: () => void;
  onTodayClick: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onAddClick,
  onTodayClick
}) => {
  const { modalStack, clearStack } = useModalStore();
  const hasOpenModal = modalStack.length > 0;

  return (
    <div className={classNames("fab-container")}>
      <button
        onClick={onTodayClick}
        className={classNames("fab-today-btn")}
        aria-label="Scroll to today"
      >
        <div className={classNames("fab-today-content")}>
          <span className={classNames("fab-today-text")}>---TODAY---</span>
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

      {/* {hasOpenModal && (
        <button
          className="manage-view__close-btn"
          onClick={clearStack}
          aria-label="Close"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )} */}
    </div>
  );
};
