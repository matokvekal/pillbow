import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { Medication, getShapeIcon } from "../../types";
import { useModalStore } from "../../store/useModalStore";
import {
  FORM_COLORS,
  FORM_SHAPES,
  FORM_UNITS,
  FORM_DURATIONS,
  FORM_TIME_PRESETS,
  DAY_LABELS,
  DAY_NAMES,
  isEventShape,
} from "../../constants/medFormConfig";
import "./MedicationEditForm.css";

interface MedicationEditFormProps {
  medication: Medication;
  onSave: (updates: Partial<Medication>) => void;
  onCancel: () => void;
}

/** Parse "100 mg" -> { value: "100", unit: "mg" } */
function parseStrength(strength: string): { value: string; unit: string } {
  const match = strength.match(/^(\d+)\s*(.+)$/);
  if (match) {
    const unit = match[2].trim().toLowerCase();
    const knownUnit = FORM_UNITS.find(u => u.unit === unit);
    return { value: match[1], unit: knownUnit?.unit || "mg" };
  }
  // Fallback: try to extract just the number
  const numMatch = strength.match(/(\d+)/);
  return { value: numMatch ? numMatch[1] : "100", unit: "mg" };
}

/** Find which duration preset matches startDate/endDate, or -1 for custom / calendar */
function findDurationIndex(startDate?: string, endDate?: string): number {
  if (!endDate) return 3; // "Ongoing"
  if (!startDate) return -1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const idx = FORM_DURATIONS.findIndex(d => d.days === diffDays);
  return idx >= 0 ? idx : -1; // -1 = custom calendar
}

export const MedicationEditForm: React.FC<MedicationEditFormProps> = ({
  medication,
  onSave,
  onCancel,
}) => {
  const { clearStack } = useModalStore();

  // Parse initial values from medication
  const parsed = parseStrength(medication.strength);
  const initColorIndex = FORM_COLORS.findIndex(c => c.class === medication.color);
  const initShapeIndex = FORM_SHAPES.findIndex(s => s.id === medication.shape);
  const initDurationIndex = findDurationIndex(medication.startDate, medication.endDate);

  // Form state
  const [name, setName] = useState(medication.name);
  const [strengthValue, setStrengthValue] = useState(parsed.value);
  const [strengthUnit, setStrengthUnit] = useState(parsed.unit);
  const [selectedTimes, setSelectedTimes] = useState<string[]>(medication.timesOfDay || []);
  const [customTime, setCustomTime] = useState("");
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>(medication.daysOfWeek || []);
  const [durationIndex, setDurationIndex] = useState(initDurationIndex);
  const [customEndDate, setCustomEndDate] = useState(medication.endDate || "");
  const [showCalendar, setShowCalendar] = useState(initDurationIndex === -1);
  const [colorIndex, setColorIndex] = useState(initColorIndex >= 0 ? initColorIndex : 0);
  const [shapeIndex, setShapeIndex] = useState(initShapeIndex >= 0 ? initShapeIndex : 0);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Toggle time selection
  const toggleTime = (time: string) => {
    setSelectedTimes(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time].sort()
    );
  };

  // Add custom time
  const addCustomTime = () => {
    if (customTime && !selectedTimes.includes(customTime)) {
      setSelectedTimes(prev => [...prev, customTime].sort());
      setCustomTime("");
      setShowCustomTime(false);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleDurationSelect = (index: number) => {
    setDurationIndex(index);
    setShowCalendar(false);
  };

  const getEndDateDisplay = () => {
    if (durationIndex === -1 && customEndDate) {
      return format(new Date(customEndDate), "MMM d, yyyy");
    }
    if (durationIndex > -1 && durationIndex < 3 && FORM_DURATIONS[durationIndex].days > 0) {
      const start = medication.startDate ? new Date(medication.startDate) : new Date();
      return format(addDays(start, FORM_DURATIONS[durationIndex].days), "MMM d, yyyy");
    }
    return "No end date";
  };

  // Stop medication handler (kept from original)
  const handleStop = (when: "today" | "tomorrow") => {
    const today = new Date();
    let stopDate: string;
    if (when === "today") {
      stopDate = format(addDays(today, -1), "yyyy-MM-dd");
    } else {
      stopDate = format(today, "yyyy-MM-dd");
    }
    onSave({ endDate: stopDate });
    clearStack();
  };

  // Save handler
  const handleSave = () => {
    const startDate = medication.startDate || format(new Date(), "yyyy-MM-dd");

    let endDate: string | undefined;
    if (durationIndex === -1 && customEndDate) {
      endDate = customEndDate;
    } else if (durationIndex > -1 && durationIndex < 3 && FORM_DURATIONS[durationIndex].days > 0) {
      const start = medication.startDate ? new Date(medication.startDate) : new Date();
      endDate = format(addDays(start, FORM_DURATIONS[durationIndex].days), "yyyy-MM-dd");
    }
    // durationIndex === 3 means "Ongoing" -> no endDate

    const updates: Partial<Medication> = {
      name: name.trim(),
      strength: `${strengthValue} ${strengthUnit}`,
      dosesPerDay: selectedTimes.length,
      timesOfDay: selectedTimes,
      startDate,
      endDate: endDate || undefined,
      daysOfWeek: selectedDays.length > 0 ? selectedDays : undefined,
      color: FORM_COLORS[colorIndex].class,
      shape: FORM_SHAPES[shapeIndex].id,
    };

    onSave(updates);
    clearStack();
  };

  // Detect changes
  const hasChanges =
    name.trim() !== medication.name ||
    `${strengthValue} ${strengthUnit}` !== medication.strength ||
    JSON.stringify(selectedTimes) !== JSON.stringify(medication.timesOfDay || []) ||
    JSON.stringify(selectedDays) !== JSON.stringify(medication.daysOfWeek || []) ||
    durationIndex !== findDurationIndex(medication.startDate, medication.endDate) ||
    (durationIndex === -1 && customEndDate !== (medication.endDate || "")) ||
    FORM_COLORS[colorIndex].class !== medication.color ||
    FORM_SHAPES[shapeIndex].id !== (medication.shape || "capsule");

  const isValid = name.trim().length >= 2 && selectedTimes.length > 0;

  return (
    <div className="med-edit-form">
      {/* Header */}
      <div className="med-edit-form__header">
        <button className="med-edit-form__close-btn" onClick={onCancel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={`med-edit-form__med-icon ${medication.color}`}>
          <span>{getShapeIcon(medication.shape)}</span>
        </div>
        <div className="med-edit-form__med-details">
          <h3 className="med-edit-form__med-name">{medication.name}</h3>
          <p className="med-edit-form__med-current">Edit Medicine</p>
        </div>
      </div>

      {/* Scrollable form content */}
      <div className="med-edit-form__content">
        {/* Name */}
        <div className="med-edit-form__field">
          <label className="med-edit-form__label">
            {isEventShape(medication.shape || "") ? "Event Name" : "Medicine Name"}
          </label>
          <input
            type="text"
            className="med-edit-form__input"
            placeholder={isEventShape(medication.shape || "") ? "e.g. Dentist Visit" : "e.g. Aspirin"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Amount / Strength */}
        <div className="med-edit-form__field">
          <label className="med-edit-form__label">Amount / Strength</label>
          <div className="med-edit-form__strength-row">
            <input
              type="number"
              className="med-edit-form__strength-input"
              value={strengthValue}
              onChange={(e) => setStrengthValue(e.target.value)}
              min="1"
              max="9999"
            />
            <div className="med-edit-form__unit-picker">
              {FORM_UNITS.map(({ unit }) => (
                <button
                  key={unit}
                  className={`med-edit-form__unit-btn ${strengthUnit === unit ? "med-edit-form__unit-btn--active" : ""}`}
                  onClick={() => setStrengthUnit(unit)}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* When to Take - Time Picker */}
        <div className="med-edit-form__field">
          <label className="med-edit-form__label">When to take?</label>
          <p className="med-edit-form__hint">Tap to select times (can pick multiple)</p>

          <div className="med-edit-form__time-grid">
            {FORM_TIME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`med-edit-form__time-btn ${selectedTimes.includes(preset.time) ? "med-edit-form__time-btn--active" : ""}`}
                onClick={() => toggleTime(preset.time)}
              >
                <span className="med-edit-form__time-icon">{preset.icon}</span>
                <span className="med-edit-form__time-label">{preset.label}</span>
                <span className="med-edit-form__time-value">{preset.time}</span>
                {selectedTimes.includes(preset.time) && (
                  <span className="med-edit-form__time-check">{"\u2713"}</span>
                )}
              </button>
            ))}
          </div>

          {/* Custom Time */}
          <div className="med-edit-form__custom-time">
            {!showCustomTime ? (
              <button
                className="med-edit-form__custom-time-btn"
                onClick={() => setShowCustomTime(true)}
              >
                <span>{"\u23F0"}</span>
                <span>Add custom time</span>
              </button>
            ) : (
              <div className="med-edit-form__custom-time-row">
                <input
                  type="time"
                  className="med-edit-form__time-input"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  step="60"
                  autoFocus
                />
                <button
                  className="med-edit-form__custom-time-add"
                  onClick={addCustomTime}
                  disabled={!customTime}
                >
                  Add
                </button>
                <button
                  className="med-edit-form__custom-time-cancel"
                  onClick={() => {
                    setShowCustomTime(false);
                    setCustomTime("");
                  }}
                >
                  {"\u2715"}
                </button>
              </div>
            )}
          </div>

          {/* Selected Times Summary */}
          <div className="med-edit-form__selected-times">
            <span className="med-edit-form__selected-label">Selected:</span>
            <div className="med-edit-form__selected-chips">
              {selectedTimes.length === 0 && (
                <span className="med-edit-form__time-chip med-edit-form__time-chip--empty">Pick a time above</span>
              )}
              {selectedTimes.map(time => {
                const preset = FORM_TIME_PRESETS.find(p => p.time === time);
                return (
                  <span key={time} className="med-edit-form__time-chip">
                    {preset?.icon || "\u23F0"} {time}
                    <button
                      className="med-edit-form__time-chip-remove"
                      onClick={() => toggleTime(time)}
                    >
                      {"\u2715"}
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Days of Week */}
        <div className="med-edit-form__field">
          <label className="med-edit-form__label">Which days?</label>
          <p className="med-edit-form__hint">Leave empty for every day</p>
          <div className="med-edit-form__day-picker">
            {DAY_LABELS.map((label, index) => (
              <button
                key={index}
                className={`med-edit-form__day-btn ${selectedDays.includes(index) ? "med-edit-form__day-btn--active" : ""}`}
                onClick={() => toggleDay(index)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="med-edit-form__day-summary">
            {selectedDays.length === 0 ? (
              <span className="med-edit-form__day-chip med-edit-form__day-chip--every">Every day</span>
            ) : (
              selectedDays.map(d => (
                <span key={d} className="med-edit-form__day-chip">
                  {DAY_NAMES[d]}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="med-edit-form__field">
          <label className="med-edit-form__label">For how long?</label>
          <div className="med-edit-form__duration-grid">
            {FORM_DURATIONS.map((duration, index) => (
              <button
                key={duration.label}
                className={`med-edit-form__duration-btn ${durationIndex === index && !showCalendar ? "med-edit-form__duration-btn--active" : ""}`}
                onClick={() => handleDurationSelect(index)}
              >
                {duration.label}
              </button>
            ))}
          </div>
          {/* Calendar option */}
          <div className="med-edit-form__date-section">
            <button
              className={`med-edit-form__calendar-btn ${showCalendar ? "med-edit-form__calendar-btn--active" : ""}`}
              onClick={() => {
                if (!showCalendar) {
                  setShowCalendar(true);
                  setDurationIndex(-1);
                  setTimeout(() => {
                    const dateInput = document.querySelector('.med-edit-form__date-input') as HTMLInputElement;
                    if (dateInput) {
                      try {
                        dateInput.showPicker();
                      } catch {
                        dateInput.focus();
                      }
                    }
                  }, 0);
                } else {
                  setShowCalendar(false);
                }
              }}
            >
              <span>{"\u{1F4C5}"}</span>
              <span>{showCalendar ? "Hide date picker" : "Pick end date"}</span>
            </button>

            {showCalendar && (
              <div className="med-edit-form__date-input-wrapper">
                <input
                  type="date"
                  className="med-edit-form__date-input"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  autoFocus
                />
              </div>
            )}

            {(durationIndex < 3 || (showCalendar && customEndDate)) && (
              <p className="med-edit-form__end-date">
                Ends: {getEndDateDisplay()}
              </p>
            )}
          </div>
        </div>

        {/* Icon / Shape */}
        <div className="med-edit-form__field">
          <label className="med-edit-form__label">Icon</label>
          <div className="med-edit-form__scroll-row">
            {FORM_SHAPES.map((shape, index) => (
              <button
                key={shape.id}
                className={`med-edit-form__shape ${shapeIndex === index ? "med-edit-form__shape--active" : ""}`}
                onClick={() => setShapeIndex(index)}
                title={shape.label}
              >
                {shape.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="med-edit-form__field">
          <label className="med-edit-form__label">Color</label>
          <div className="med-edit-form__scroll-row">
            {FORM_COLORS.map((color, index) => {
              const isLight = color.class === "bg-white" || color.class === "bg-gray-300";
              return (
                <button
                  key={color.class}
                  className={`med-edit-form__color ${colorIndex === index ? "med-edit-form__color--active" : ""}`}
                  style={{
                    backgroundColor: color.hex,
                    color: isLight ? "#475569" : "white",
                  }}
                  onClick={() => setColorIndex(index)}
                >
                  {colorIndex === index && "\u2713"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stop Medication Section */}
        <div className="med-edit-form__section--stop">
          <button
            className="med-edit-form__stop-toggle"
            onClick={() => setShowStopConfirm(!showStopConfirm)}
          >
            <span className="med-edit-form__stop-icon">{"\u{1F6D1}"}</span>
            <span>STOP THIS MEDICATION</span>
            <svg
              className={`med-edit-form__chevron ${showStopConfirm ? "med-edit-form__chevron--open" : ""}`}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {showStopConfirm && (
            <div className="med-edit-form__stop-options">
              <p className="med-edit-form__stop-question">When to stop?</p>
              <div className="med-edit-form__stop-buttons">
                <button
                  className="med-edit-form__stop-btn"
                  onClick={() => handleStop("today")}
                >
                  <span className="med-edit-form__stop-btn-label">Today</span>
                  <span className="med-edit-form__stop-btn-hint">No more doses</span>
                </button>
                <button
                  className="med-edit-form__stop-btn"
                  onClick={() => handleStop("tomorrow")}
                >
                  <span className="med-edit-form__stop-btn-label">Tomorrow</span>
                  <span className="med-edit-form__stop-btn-hint">Finish today first</span>
                </button>
                <button
                  className="med-edit-form__stop-btn med-edit-form__stop-btn--cancel"
                  onClick={() => setShowStopConfirm(false)}
                >
                  <span className="med-edit-form__stop-btn-label">Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="med-edit-form__actions">
        <button
          className="med-edit-form__btn med-edit-form__btn--save"
          onClick={handleSave}
          disabled={!hasChanges || !isValid}
        >
          {!isValid ? "Enter name & select times" : hasChanges ? "Save Changes" : "No Changes"}
        </button>
      </div>
    </div>
  );
};
