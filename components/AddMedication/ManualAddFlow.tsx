import React, { useState } from "react";
import { Medication } from "../../types";
import "./ManualAddFlow.css";

interface ManualAddFlowProps {
  onBack: () => void;
  onAdd: (medication: Partial<Medication>) => void;
}

// Common strength options
const STRENGTH_OPTIONS = [
  "25mg", "50mg", "100mg", "150mg", "200mg", "250mg",
  "300mg", "400mg", "500mg", "750mg", "1000mg"
];

// Color options
const COLOR_OPTIONS = [
  { name: "Blue", class: "bg-blue-300", hex: "#93c5fd" },
  { name: "Green", class: "bg-green-300", hex: "#86efac" },
  { name: "Yellow", class: "bg-yellow-300", hex: "#fcd34d" },
  { name: "Red", class: "bg-red-300", hex: "#fca5a5" },
  { name: "Purple", class: "bg-purple-300", hex: "#d8b4fe" },
  { name: "Pink", class: "bg-pink-300", hex: "#f472b6" },
  { name: "Orange", class: "bg-orange-300", hex: "#fdba74" },
];

export const ManualAddFlow: React.FC<ManualAddFlowProps> = ({
  onBack,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [strengthIndex, setStrengthIndex] = useState(4); // 200mg default
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);

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
    // Generate default times based on timesPerDay
    const defaultTimes: string[] = [];
    if (timesPerDay >= 1) defaultTimes.push("Morning");
    if (timesPerDay >= 2) defaultTimes.push("Evening");
    if (timesPerDay >= 3) defaultTimes.push("Noon");
    if (timesPerDay >= 4) defaultTimes.push("Afternoon");
    if (timesPerDay >= 5) defaultTimes.push("Night");
    if (timesPerDay >= 6) defaultTimes.push("Bedtime");

    const medication: Partial<Medication> = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      strength: STRENGTH_OPTIONS[strengthIndex],
      dosage: "1 tablet",
      dosesPerDay: timesPerDay,
      timesOfDay: defaultTimes,
      color: COLOR_OPTIONS[colorIndex].class,
      startDate: new Date().toISOString().split("T")[0],
    };

    onAdd(medication);
  };

  const isValid = name.trim().length >= 2;

  return (
    <div className="manual-add">
      <div className="manual-add__header">
        <button className="manual-add__back-btn" onClick={onBack}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>BACK</span>
        </button>
      </div>

      <div className="manual-add__content">
        {/* Icon */}
        <div className={`manual-add__icon ${COLOR_OPTIONS[colorIndex].class}`}>
          <span>💊</span>
        </div>

        {/* Title */}
        <h1 className="manual-add__title">ADD BY HAND</h1>

        {/* Name Input */}
        <div className="manual-add__control">
          <label className="manual-add__label">Medicine name</label>
          <input
            type="text"
            className="manual-add__input"
            placeholder="Type name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        {/* Strength Control */}
        <div className="manual-add__control">
          <p className="manual-add__label">How much?</p>
          <div className="manual-add__adjuster">
            <button
              className="manual-add__adj-btn"
              onClick={handleStrengthDown}
              disabled={strengthIndex === 0}
            >
              <span>−</span>
            </button>
            <div className="manual-add__value">
              {STRENGTH_OPTIONS[strengthIndex]}
            </div>
            <button
              className="manual-add__adj-btn"
              onClick={handleStrengthUp}
              disabled={strengthIndex === STRENGTH_OPTIONS.length - 1}
            >
              <span>+</span>
            </button>
          </div>
        </div>

        {/* Times Per Day Control */}
        <div className="manual-add__control">
          <p className="manual-add__label">How many times per day?</p>
          <div className="manual-add__adjuster">
            <button
              className="manual-add__adj-btn"
              onClick={handleTimesDown}
              disabled={timesPerDay === 1}
            >
              <span>−</span>
            </button>
            <div className="manual-add__value">
              {timesPerDay}x
            </div>
            <button
              className="manual-add__adj-btn"
              onClick={handleTimesUp}
              disabled={timesPerDay === 6}
            >
              <span>+</span>
            </button>
          </div>
        </div>

        {/* Color Picker */}
        <div className="manual-add__control">
          <p className="manual-add__label">Color</p>
          <div className="manual-add__colors">
            {COLOR_OPTIONS.map((color, index) => (
              <button
                key={color.name}
                className={`manual-add__color-btn ${colorIndex === index ? "manual-add__color-btn--selected" : ""}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setColorIndex(index)}
                aria-label={color.name}
              >
                {colorIndex === index && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          className="manual-add__save-btn"
          onClick={handleSave}
          disabled={!isValid}
        >
          <span className="manual-add__save-icon">✓</span>
          <span className="manual-add__save-text">ADD MEDICINE</span>
        </button>

        {!isValid && (
          <p className="manual-add__hint">
            Type medicine name to continue
          </p>
        )}
      </div>
    </div>
  );
};
