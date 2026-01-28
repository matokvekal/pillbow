import React, { useState } from "react";
import { format, addDays, parseISO } from "date-fns";
import { Medication } from "../../types";
import { useModalStore } from "../../store/useModalStore";
import "./MedicationEditForm.css";

interface MedicationEditFormProps {
  medication: Medication;
  onSave: (updates: Partial<Medication>) => void;
  onCancel: () => void;
}

// Common strength options
const STRENGTH_OPTIONS = [
  "25mg", "50mg", "100mg", "150mg", "200mg", "250mg",
  "300mg", "400mg", "500mg", "750mg", "1000mg"
];

// Quick end date options (days from start)
const END_DATE_OPTIONS = [
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "30 days", days: 30 },
  { label: "60 days", days: 60 },
  { label: "90 days", days: 90 },
];

export const MedicationEditForm: React.FC<MedicationEditFormProps> = ({
  medication,
  onSave,
  onCancel,
}) => {
  const { clearStack } = useModalStore();

  // Find current strength index
  const currentStrengthIndex = STRENGTH_OPTIONS.findIndex(
    s => s.toLowerCase() === medication.strength.toLowerCase()
  );

  // Form state
  const [strengthIndex, setStrengthIndex] = useState(
    currentStrengthIndex >= 0 ? currentStrengthIndex : 4
  );
  const [timesPerDay, setTimesPerDay] = useState(medication.dosesPerDay || 1);
  const [startDate, setStartDate] = useState(
    medication.startDate || format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string | null>(medication.endDate || null);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [customEndDays, setCustomEndDays] = useState(30);

  // Handlers
  const handleStrengthDown = () => {
    if (strengthIndex > 0) setStrengthIndex(strengthIndex - 1);
  };

  const handleStrengthUp = () => {
    if (strengthIndex < STRENGTH_OPTIONS.length - 1) setStrengthIndex(strengthIndex + 1);
  };

  const handleTimesSelect = (times: number) => {
    setTimesPerDay(times);
  };

  const handleStartDateSelect = (option: "today" | "tomorrow" | "custom", customDate?: string) => {
    if (option === "today") {
      setStartDate(format(new Date(), "yyyy-MM-dd"));
    } else if (option === "tomorrow") {
      setStartDate(format(addDays(new Date(), 1), "yyyy-MM-dd"));
    } else if (customDate) {
      setStartDate(customDate);
    }
  };

  const handleEndDateSelect = (days: number | "ongoing" | "custom", customDate?: string) => {
    if (days === "ongoing") {
      setEndDate(null);
    } else if (days === "custom" && customDate) {
      setEndDate(customDate);
    } else if (typeof days === "number") {
      const start = parseISO(startDate);
      setEndDate(format(addDays(start, days), "yyyy-MM-dd"));
    }
  };

  const handleCustomEndDaysChange = (delta: number) => {
    const newDays = Math.max(1, Math.min(365, customEndDays + delta));
    setCustomEndDays(newDays);
    const start = parseISO(startDate);
    setEndDate(format(addDays(start, newDays), "yyyy-MM-dd"));
  };

  const handleStop = (when: "today" | "tomorrow") => {
    const today = new Date();
    let stopDate: string;

    if (when === "today") {
      // Set end date to yesterday to mark as completed
      const yesterday = addDays(today, -1);
      stopDate = format(yesterday, "yyyy-MM-dd");
    } else {
      // Set end date to today (stops after today)
      stopDate = format(today, "yyyy-MM-dd");
    }

    onSave({ endDate: stopDate });
    clearStack();
  };

  const handleSave = () => {
    // Generate new times based on timesPerDay
    const timeMap: Record<number, string[]> = {
      1: ["08:00"],
      2: ["08:00", "20:00"],
      3: ["08:00", "14:00", "20:00"],
      4: ["08:00", "12:00", "16:00", "20:00"],
      5: ["08:00", "11:00", "14:00", "17:00", "20:00"],
      6: ["08:00", "10:00", "12:00", "14:00", "18:00", "21:00"],
    };

    const updates: Partial<Medication> = {
      strength: STRENGTH_OPTIONS[strengthIndex],
      dosesPerDay: timesPerDay,
      timesOfDay: timeMap[timesPerDay] || ["08:00"],
      startDate,
      endDate: endDate || undefined,
    };

    onSave(updates);
    clearStack();
  };

  const hasChanges =
    STRENGTH_OPTIONS[strengthIndex] !== medication.strength ||
    timesPerDay !== medication.dosesPerDay ||
    startDate !== medication.startDate ||
    endDate !== medication.endDate;

  return (
    <div className="med-edit-form">
      {/* Header */}
      <div className="med-edit-form__header">
        <button className="med-edit-form__close-btn" onClick={onCancel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h2 className="med-edit-form__title">Edit Medication</h2>
      </div>

      {/* Medication Info */}
      <div className="med-edit-form__med-info">
        <div className={`med-edit-form__med-icon ${medication.color}`}>
          <span>💊</span>
        </div>
        <div className="med-edit-form__med-details">
          <h3 className="med-edit-form__med-name">{medication.name}</h3>
          <p className="med-edit-form__med-current">
            Currently: {medication.strength} • {medication.dosesPerDay}x daily
          </p>
        </div>
      </div>

      <div className="med-edit-form__content">
        {/* Dosage Section */}
        <div className="med-edit-form__section">
          <h4 className="med-edit-form__section-title">DOSAGE</h4>
          <div className="med-edit-form__adjuster">
            <button
              className="med-edit-form__adj-btn"
              onClick={handleStrengthDown}
              disabled={strengthIndex === 0}
            >
              <span>−</span>
            </button>
            <div className="med-edit-form__adj-value">
              {STRENGTH_OPTIONS[strengthIndex]}
            </div>
            <button
              className="med-edit-form__adj-btn"
              onClick={handleStrengthUp}
              disabled={strengthIndex === STRENGTH_OPTIONS.length - 1}
            >
              <span>+</span>
            </button>
          </div>
          {STRENGTH_OPTIONS[strengthIndex] !== medication.strength && (
            <p className="med-edit-form__change-hint">was {medication.strength}</p>
          )}
        </div>

        {/* Schedule Section */}
        <div className="med-edit-form__section">
          <h4 className="med-edit-form__section-title">TIMES PER DAY</h4>
          <div className="med-edit-form__chips">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                className={`med-edit-form__chip ${timesPerDay === num ? "med-edit-form__chip--active" : ""}`}
                onClick={() => handleTimesSelect(num)}
              >
                {num}x
              </button>
            ))}
          </div>
          {timesPerDay !== medication.dosesPerDay && (
            <p className="med-edit-form__change-hint">was {medication.dosesPerDay}x</p>
          )}
        </div>

        {/* Start Date Section */}
        <div className="med-edit-form__section">
          <h4 className="med-edit-form__section-title">START DATE</h4>
          <div className="med-edit-form__chips">
            <button
              className={`med-edit-form__chip ${startDate === format(new Date(), "yyyy-MM-dd") ? "med-edit-form__chip--active" : ""}`}
              onClick={() => handleStartDateSelect("today")}
            >
              Today
            </button>
            <button
              className={`med-edit-form__chip ${startDate === format(addDays(new Date(), 1), "yyyy-MM-dd") ? "med-edit-form__chip--active" : ""}`}
              onClick={() => handleStartDateSelect("tomorrow")}
            >
              Tomorrow
            </button>
            <input
              type="date"
              className="med-edit-form__date-input"
              value={startDate}
              onChange={(e) => handleStartDateSelect("custom", e.target.value)}
            />
          </div>
        </div>

        {/* End Date Section */}
        <div className="med-edit-form__section">
          <h4 className="med-edit-form__section-title">END DATE</h4>
          <div className="med-edit-form__chips med-edit-form__chips--wrap">
            {END_DATE_OPTIONS.map((opt) => {
              const optEndDate = format(addDays(parseISO(startDate), opt.days), "yyyy-MM-dd");
              return (
                <button
                  key={opt.days}
                  className={`med-edit-form__chip ${endDate === optEndDate ? "med-edit-form__chip--active" : ""}`}
                  onClick={() => handleEndDateSelect(opt.days)}
                >
                  {opt.label}
                </button>
              );
            })}
            <button
              className={`med-edit-form__chip ${endDate === null ? "med-edit-form__chip--active" : ""}`}
              onClick={() => handleEndDateSelect("ongoing")}
            >
              Ongoing
            </button>
          </div>

          {/* Custom days adjuster */}
          <div className="med-edit-form__custom-days">
            <span className="med-edit-form__custom-label">Or set custom:</span>
            <div className="med-edit-form__mini-adjuster">
              <button onClick={() => handleCustomEndDaysChange(-7)}>-7</button>
              <button onClick={() => handleCustomEndDaysChange(-1)}>-1</button>
              <span className="med-edit-form__days-value">{customEndDays} days</span>
              <button onClick={() => handleCustomEndDaysChange(1)}>+1</button>
              <button onClick={() => handleCustomEndDaysChange(7)}>+7</button>
            </div>
          </div>

          {endDate && (
            <p className="med-edit-form__end-preview">
              Ends: {format(parseISO(endDate), "EEE, MMM d, yyyy")}
            </p>
          )}
        </div>

        {/* Stop Medication Section */}
        <div className="med-edit-form__section med-edit-form__section--stop">
          <button
            className="med-edit-form__stop-toggle"
            onClick={() => setShowStopConfirm(!showStopConfirm)}
          >
            <span className="med-edit-form__stop-icon">🛑</span>
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

      {/* Action Buttons */}
      <div className="med-edit-form__actions">
        <button className="med-edit-form__btn med-edit-form__btn--cancel" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="med-edit-form__btn med-edit-form__btn--save"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
