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

// Time presets - easy selection
const TIME_PRESETS = [
  { id: "morning", label: "Morning", time: "08:00", icon: "🌅" },
  { id: "noon", label: "Noon", time: "12:00", icon: "☀️" },
  { id: "afternoon", label: "Afternoon", time: "15:00", icon: "🌤️" },
  { id: "evening", label: "Evening", time: "19:00", icon: "🌆" },
  { id: "night", label: "Night", time: "22:00", icon: "🌙" },
];

export const ManualAddFlow: React.FC<ManualAddFlowProps> = ({
  onBack,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [strengthValue, setStrengthValue] = useState("100");
  const [strengthUnit, setStrengthUnit] = useState("mg");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["08:00"]); // Default morning
  const [customTime, setCustomTime] = useState("");
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [durationIndex, setDurationIndex] = useState(3); // Default "Ongoing"
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);

  // Toggle time selection
  const toggleTime = (time: string) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        // Don't allow removing if it's the last one
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== time);
      }
      return [...prev, time].sort();
    });
  };

  // Add custom time
  const addCustomTime = () => {
    if (customTime && !selectedTimes.includes(customTime)) {
      setSelectedTimes(prev => [...prev, customTime].sort());
      setCustomTime("");
      setShowCustomTime(false);
    }
  };

  const handleSave = () => {
    const today = new Date();
    const startDate = format(today, "yyyy-MM-dd");

    // Calculate end date
    let endDate: string | undefined;
    if (durationIndex === -1 && customEndDate) {
      endDate = customEndDate;
    } else if (durationIndex > -1 && durationIndex < 3 && DURATIONS[durationIndex].days > 0) {
      endDate = format(addDays(today, DURATIONS[durationIndex].days), "yyyy-MM-dd");
    }

    const medication: Partial<Medication> = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      strength: `${strengthValue} ${strengthUnit}`,
      dosage: "1 dose",
      dosesPerDay: selectedTimes.length,
      timesOfDay: selectedTimes,
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
    // Don't clear customEndDate so it's remembered if they switch back
    // setCustomEndDate(""); 
  };

  const getEndDateDisplay = () => {
    if (durationIndex === -1 && customEndDate) {
      return format(new Date(customEndDate), "MMM d, yyyy");
    }
    if (durationIndex > -1 && durationIndex < 3 && DURATIONS[durationIndex].days > 0) {
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

        {/* When to Take - Time Picker */}
        <div className="manual-add__field">
          <label className="manual-add__label">When to take?</label>
          <p className="manual-add__hint">Tap to select times (can pick multiple)</p>

          <div className="manual-add__time-grid">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`manual-add__time-btn ${selectedTimes.includes(preset.time) ? "manual-add__time-btn--active" : ""}`}
                onClick={() => toggleTime(preset.time)}
              >
                <span className="manual-add__time-icon">{preset.icon}</span>
                <span className="manual-add__time-label">{preset.label}</span>
                <span className="manual-add__time-value">{preset.time}</span>
                {selectedTimes.includes(preset.time) && (
                  <span className="manual-add__time-check">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Custom Time */}
          <div className="manual-add__custom-time">
            {!showCustomTime ? (
              <button
                className="manual-add__custom-time-btn"
                onClick={() => setShowCustomTime(true)}
              >
                <span>⏰</span>
                <span>Add custom time</span>
              </button>
            ) : (
              <div className="manual-add__custom-time-row">
                <input
                  type="time"
                  className="manual-add__time-input"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  autoFocus
                />
                <button
                  className="manual-add__custom-time-add"
                  onClick={addCustomTime}
                  disabled={!customTime}
                >
                  Add
                </button>
                <button
                  className="manual-add__custom-time-cancel"
                  onClick={() => {
                    setShowCustomTime(false);
                    setCustomTime("");
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Selected Times Summary */}
          <div className="manual-add__selected-times">
            <span className="manual-add__selected-label">Selected:</span>
            <div className="manual-add__selected-chips">
              {selectedTimes.map(time => {
                const preset = TIME_PRESETS.find(p => p.time === time);
                return (
                  <span key={time} className="manual-add__time-chip">
                    {preset?.icon || "⏰"} {time}
                    {selectedTimes.length > 1 && (
                      <button
                        className="manual-add__time-chip-remove"
                        onClick={() => toggleTime(time)}
                      >
                        ✕
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="manual-add__field">
          <label className="manual-add__label">For how long?</label>
          <div className="manual-add__duration-grid">
            {DURATIONS.map((duration, index) => (
              <button
                key={duration.label}
                className={`manual-add__duration-btn ${durationIndex === index && !showCalendar ? "manual-add__duration-btn--active" : ""
                  }`}
                onClick={() => handleDurationSelect(index)}
              >
                {duration.label}
              </button>
            ))}
          </div>
          {/* Calendar option */}
          <div className="manual-add__date-section">
            <button
              className={`manual-add__calendar-btn ${showCalendar ? "manual-add__calendar-btn--active" : ""}`}
              onClick={() => {
                if (!showCalendar) {
                  setShowCalendar(true);
                  setDurationIndex(-1);
                  // Attempt to focus the input on the next tick
                  setTimeout(() => {
                    const dateInput = document.querySelector('.manual-add__date-input') as HTMLInputElement;
                    if (dateInput) {
                      try {
                        dateInput.showPicker();
                      } catch (e) {
                        dateInput.focus();
                      }
                    }
                  }, 0);
                } else {
                  setShowCalendar(false);
                }
              }}
            >
              <span>📅</span>
              <span>{showCalendar ? "Hide date picker" : "Pick end date"}</span>
            </button>

            {showCalendar && (
              <div className="manual-add__date-input-wrapper">
                <input
                  type="date"
                  className="manual-add__date-input"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  autoFocus
                />
              </div>
            )}

            {(durationIndex < 3 || (showCalendar && customEndDate)) && (
              <p className="manual-add__end-date">
                Ends: {getEndDateDisplay()}
              </p>
            )}
          </div>
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
