import React, { useState } from "react";
import { Medication } from "../../types";
import "./ChangeFlow.css";

interface ChangeFlowProps {
  medication: Medication;
  onBack: () => void;
  onChange: (data: { strength: string; timesPerDay: number }) => void;
}

// Common strength options
const STRENGTH_OPTIONS = [
  "25mg", "50mg", "100mg", "150mg", "200mg", "250mg",
  "300mg", "400mg", "500mg", "750mg", "1000mg"
];

export const ChangeFlow: React.FC<ChangeFlowProps> = ({
  medication,
  onBack,
  onChange,
}) => {
  // Find current strength index
  const currentStrengthIndex = STRENGTH_OPTIONS.findIndex(
    s => s.toLowerCase() === medication.strength.toLowerCase()
  );

  const [strengthIndex, setStrengthIndex] = useState(
    currentStrengthIndex >= 0 ? currentStrengthIndex : 4 // default to 200mg
  );
  const [timesPerDay, setTimesPerDay] = useState(medication.dosesPerDay || 1);

  const handleStrengthDown = () => {
    if (strengthIndex > 0) {
      setStrengthIndex(strengthIndex - 1);
    }
  };

  const handleStrengthUp = () => {
    if (strengthIndex < STRENGTH_OPTIONS.length - 1) {
      setStrengthIndex(strengthIndex + 1);
    }
  };

  const handleTimesDown = () => {
    if (timesPerDay > 1) {
      setTimesPerDay(timesPerDay - 1);
    }
  };

  const handleTimesUp = () => {
    if (timesPerDay < 6) {
      setTimesPerDay(timesPerDay + 1);
    }
  };

  const handleSave = () => {
    onChange({
      strength: STRENGTH_OPTIONS[strengthIndex],
      timesPerDay,
    });
  };

  const hasChanges =
    STRENGTH_OPTIONS[strengthIndex] !== medication.strength ||
    timesPerDay !== medication.dosesPerDay;

  return (
    <div className="change-flow">
      <div className="change-flow__header">
        <button className="change-flow__back-btn" onClick={onBack}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>BACK</span>
        </button>
      </div>

      <div className="change-flow__content">
        {/* Icon */}
        <div className={`change-flow__icon ${medication.color}`}>
          <span>💊</span>
        </div>

        {/* Title */}
        <h1 className="change-flow__title">CHANGE</h1>
        <h2 className="change-flow__med-name">{medication.name}</h2>

        {/* Strength Control */}
        <div className="change-flow__control">
          <p className="change-flow__label">How much?</p>
          <div className="change-flow__adjuster">
            <button
              className="change-flow__adj-btn"
              onClick={handleStrengthDown}
              disabled={strengthIndex === 0}
            >
              <span>−</span>
            </button>
            <div className="change-flow__value">
              {STRENGTH_OPTIONS[strengthIndex]}
            </div>
            <button
              className="change-flow__adj-btn"
              onClick={handleStrengthUp}
              disabled={strengthIndex === STRENGTH_OPTIONS.length - 1}
            >
              <span>+</span>
            </button>
          </div>
          {STRENGTH_OPTIONS[strengthIndex] !== medication.strength && (
            <p className="change-flow__change-hint">
              was {medication.strength}
            </p>
          )}
        </div>

        {/* Times Per Day Control */}
        <div className="change-flow__control">
          <p className="change-flow__label">How many times per day?</p>
          <div className="change-flow__adjuster">
            <button
              className="change-flow__adj-btn"
              onClick={handleTimesDown}
              disabled={timesPerDay === 1}
            >
              <span>−</span>
            </button>
            <div className="change-flow__value">
              {timesPerDay}x
            </div>
            <button
              className="change-flow__adj-btn"
              onClick={handleTimesUp}
              disabled={timesPerDay === 6}
            >
              <span>+</span>
            </button>
          </div>
          {timesPerDay !== medication.dosesPerDay && (
            <p className="change-flow__change-hint">
              was {medication.dosesPerDay}x
            </p>
          )}
        </div>

        {/* Save Button */}
        <button
          className="change-flow__save-btn"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          <span className="change-flow__save-icon">✓</span>
          <span className="change-flow__save-text">SAVE CHANGES</span>
        </button>

        {!hasChanges && (
          <p className="change-flow__no-changes">
            Change dose or times to save
          </p>
        )}
      </div>
    </div>
  );
};
