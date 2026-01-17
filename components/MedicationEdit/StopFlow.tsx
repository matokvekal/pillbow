import React from "react";
import { format, addDays } from "date-fns";
import { Medication } from "../../types";
import "./StopFlow.css";

interface StopFlowProps {
  medication: Medication;
  onBack: () => void;
  onStop: (when: "today" | "tomorrow") => void;
}

export const StopFlow: React.FC<StopFlowProps> = ({
  medication,
  onBack,
  onStop,
}) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  return (
    <div className="stop-flow">
      <div className="stop-flow__header">
        <button className="stop-flow__back-btn" onClick={onBack}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>BACK</span>
        </button>
      </div>

      <div className="stop-flow__content">
        {/* Stop Icon */}
        <div className="stop-flow__icon">
          <span>🛑</span>
        </div>

        {/* Title */}
        <h1 className="stop-flow__title">STOP</h1>
        <h2 className="stop-flow__med-name">{medication.name}</h2>

        {/* Question */}
        <p className="stop-flow__question">When to stop?</p>

        {/* Date Buttons */}
        <div className="stop-flow__buttons">
          <button
            className="stop-flow__date-btn"
            onClick={() => onStop("today")}
          >
            <span className="stop-flow__date-icon">📅</span>
            <span className="stop-flow__date-label">TODAY</span>
            <span className="stop-flow__date-value">
              {format(today, "EEE, MMM d")}
            </span>
            <span className="stop-flow__date-hint">No more doses today</span>
          </button>

          <button
            className="stop-flow__date-btn"
            onClick={() => onStop("tomorrow")}
          >
            <span className="stop-flow__date-icon">📅</span>
            <span className="stop-flow__date-label">TOMORROW</span>
            <span className="stop-flow__date-value">
              {format(tomorrow, "EEE, MMM d")}
            </span>
            <span className="stop-flow__date-hint">Finish today's doses first</span>
          </button>
        </div>

        {/* Info */}
        <p className="stop-flow__info">
          ℹ️ Past doses will stay in your history
        </p>
      </div>
    </div>
  );
};
