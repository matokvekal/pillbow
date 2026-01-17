import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { Medication } from "../../types";
import "./ManualAddFlow.css";

interface ManualAddFlowProps {
  onBack: () => void;
  onAdd: (medication: Partial<Medication>) => void;
}

// Color options - 10 colors
const COLORS = [
  { class: "bg-blue-300", hex: "#93c5fd" },
  { class: "bg-green-300", hex: "#86efac" },
  { class: "bg-yellow-300", hex: "#fcd34d" },
  { class: "bg-red-300", hex: "#fca5a5" },
  { class: "bg-purple-300", hex: "#d8b4fe" },
  { class: "bg-orange-300", hex: "#fdba74" },
  { class: "bg-pink-300", hex: "#f9a8d4" },
  { class: "bg-cyan-300", hex: "#67e8f9" },
  { class: "bg-gray-300", hex: "#d1d5db" },
  { class: "bg-white", hex: "#ffffff" },
];

// Shape options - 10 shapes with visual icons
const SHAPES = [
  { id: "round-small", label: "Small Round", icon: "●" },
  { id: "round-large", label: "Large Round", icon: "⬤" },
  { id: "oval", label: "Oval", icon: "⬮" },
  { id: "capsule", label: "Capsule", icon: "💊" },
  { id: "tablet", label: "Tablet", icon: "▬" },
  { id: "diamond", label: "Diamond", icon: "◆" },
  { id: "square", label: "Square", icon: "■" },
  { id: "triangle", label: "Triangle", icon: "▲" },
  { id: "heart", label: "Heart", icon: "♥" },
  { id: "oblong", label: "Oblong", icon: "⬭" },
];

// Strength units
const UNITS = ["mg", "ml", "pills", "drops"];

// Duration presets
const DURATIONS = [
  { label: "7 days", days: 7 },
  { label: "2 weeks", days: 14 },
  { label: "1 month", days: 30 },
  { label: "Ongoing", days: 0 },
];

export const ManualAddFlow: React.FC<ManualAddFlowProps> = ({
  onBack,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [strengthValue, setStrengthValue] = useState("100");
  const [strengthUnit, setStrengthUnit] = useState("mg");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [durationIndex, setDurationIndex] = useState(3); // Default "Ongoing"
  const [showCalendar, setShowCalendar] = useState(false);
  const [customEndDate, setCustomEndDate] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);

  const handleSave = () => {
    const timeMap: Record<number, string[]> = {
      1: ["08:00"],
      2: ["08:00", "20:00"],
      3: ["08:00", "14:00", "20:00"],
      4: ["08:00", "12:00", "16:00", "20:00"],
    };

    const today = new Date();
    const startDate = format(today, "yyyy-MM-dd");

    // Calculate end date
    let endDate: string | undefined;
    if (showCalendar && customEndDate) {
      endDate = customEndDate;
    } else if (durationIndex < 3 && DURATIONS[durationIndex].days > 0) {
      endDate = format(addDays(today, DURATIONS[durationIndex].days), "yyyy-MM-dd");
    }

    const medication: Partial<Medication> = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      strength: `${strengthValue} ${strengthUnit}`,
      dosage: "1 dose",
      dosesPerDay: timesPerDay,
      timesOfDay: timeMap[timesPerDay] || ["08:00"],
      color: COLORS[colorIndex].class,
      shape: SHAPES[shapeIndex].id,
      startDate,
      endDate,
      instructions: "",
    };

    onAdd(medication);
  };

  const isValid = name.trim().length >= 2;

  const handleDurationSelect = (index: number) => {
    setDurationIndex(index);
    setShowCalendar(false);
    setCustomEndDate("");
  };

  const getEndDateDisplay = () => {
    if (showCalendar && customEndDate) {
      return format(new Date(customEndDate), "MMM d, yyyy");
    }
    if (durationIndex < 3 && DURATIONS[durationIndex].days > 0) {
      return format(addDays(new Date(), DURATIONS[durationIndex].days), "MMM d, yyyy");
    }
    return "No end date";
  };

  return (
    <div className="manual-add">
      {/* Header */}
      <div className="manual-add__header">
        <button className="manual-add__back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="manual-add__title">New Medicine</h1>
        <div style={{ width: "3rem" }} />
      </div>

      {/* Form */}
      <div className="manual-add__form">
        {/* Medicine Name */}
        <div className="manual-add__field">
          <label className="manual-add__label">Medicine Name</label>
          <input
            type="text"
            className="manual-add__input"
            placeholder="e.g. Aspirin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            autoComplete="off"
          />
        </div>

        {/* Strength / Amount */}
        <div className="manual-add__field">
          <label className="manual-add__label">Amount / Strength</label>
          <div className="manual-add__strength-row">
            <input
              type="number"
              className="manual-add__strength-input"
              value={strengthValue}
              onChange={(e) => setStrengthValue(e.target.value)}
              min="1"
              max="9999"
            />
            <div className="manual-add__unit-picker">
              {UNITS.map((unit) => (
                <button
                  key={unit}
                  className={`manual-add__unit-btn ${strengthUnit === unit ? "manual-add__unit-btn--active" : ""}`}
                  onClick={() => setStrengthUnit(unit)}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* How Often */}
        <div className="manual-add__field">
          <label className="manual-add__label">How often per day?</label>
          <div className="manual-add__stepper">
            <button
              className="manual-add__stepper-btn"
              onClick={() => setTimesPerDay(Math.max(1, timesPerDay - 1))}
              disabled={timesPerDay <= 1}
            >
              −
            </button>
            <div className="manual-add__stepper-value">
              <span className="manual-add__stepper-num">{timesPerDay}</span>
              <span className="manual-add__stepper-text">
                {timesPerDay === 1 ? "time" : "times"}
              </span>
            </div>
            <button
              className="manual-add__stepper-btn"
              onClick={() => setTimesPerDay(Math.min(4, timesPerDay + 1))}
              disabled={timesPerDay >= 4}
            >
              +
            </button>
          </div>
        </div>

        {/* Duration */}
        <div className="manual-add__field">
          <label className="manual-add__label">For how long?</label>
          <div className="manual-add__duration-grid">
            {DURATIONS.map((duration, index) => (
              <button
                key={duration.label}
                className={`manual-add__duration-btn ${
                  durationIndex === index && !showCalendar ? "manual-add__duration-btn--active" : ""
                }`}
                onClick={() => handleDurationSelect(index)}
              >
                {duration.label}
              </button>
            ))}
          </div>
          {/* Calendar option */}
          <button
            className={`manual-add__calendar-btn ${showCalendar ? "manual-add__calendar-btn--active" : ""}`}
            onClick={() => {
              setShowCalendar(true);
              setDurationIndex(-1);
            }}
          >
            <span>📅</span>
            <span>Pick end date</span>
          </button>
          {showCalendar && (
            <input
              type="date"
              className="manual-add__date-input"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
            />
          )}
          {(durationIndex < 3 || (showCalendar && customEndDate)) && (
            <p className="manual-add__end-date">
              Ends: {getEndDateDisplay()}
            </p>
          )}
        </div>

        {/* Shape */}
        <div className="manual-add__field">
          <label className="manual-add__label">Shape</label>
          <div className="manual-add__scroll-row">
            {SHAPES.map((shape, index) => (
              <button
                key={shape.id}
                className={`manual-add__shape ${shapeIndex === index ? "manual-add__shape--active" : ""}`}
                onClick={() => setShapeIndex(index)}
                title={shape.label}
              >
                {shape.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="manual-add__field">
          <label className="manual-add__label">Color</label>
          <div className="manual-add__scroll-row">
            {COLORS.map((color, index) => {
              const isLight = color.class === "bg-white" || color.class === "bg-gray-300";
              return (
                <button
                  key={color.class}
                  className={`manual-add__color ${colorIndex === index ? "manual-add__color--active" : ""}`}
                  style={{
                    backgroundColor: color.hex,
                    color: isLight ? "#475569" : "white",
                  }}
                  onClick={() => setColorIndex(index)}
                >
                  {colorIndex === index && "✓"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="manual-add__footer">
        <button
          className="manual-add__save"
          onClick={handleSave}
          disabled={!isValid}
        >
          {isValid ? "Add Medicine" : "Enter medicine name"}
        </button>
      </div>
    </div>
  );
};
