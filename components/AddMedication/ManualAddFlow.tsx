import React, { useState, useEffect, useRef } from "react";
import { format, addDays } from "date-fns";
import { useUserStore } from "../../store/useUserStore";
import { Medication } from "../../types";
import {
  FORM_COLORS as COLORS,
  FORM_SHAPES as SHAPES,
  FORM_UNITS,
  FORM_DURATIONS as DURATIONS,
  FORM_TIME_PRESETS as TIME_PRESETS,
  DAY_LABELS,
  DAY_NAMES,
  isEventShape,
} from "../../constants/medFormConfig";
import { MedIcon } from "../MedIcons";

// Extract just the unit strings for the picker
const UNITS = FORM_UNITS.map(u => u.unit);
import "./ManualAddFlow.css";

interface ManualAddFlowProps {
  onBack: () => void;
  onAdd: (medication: Partial<Medication>) => void;
}


export const ManualAddFlow: React.FC<ManualAddFlowProps> = ({
  onBack,
  onAdd,
}) => {
  const { getCurrentUser } = useUserStore();
  const currentUser = getCurrentUser();
  const [name, setName] = useState("");
  const [strengthValue, setStrengthValue] = useState("");
  const [strengthUnit, setStrengthUnit] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [customTime, setCustomTime] = useState("");
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [durationIndex, setDurationIndex] = useState(3); // Default "Ongoing"
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [shapeIndex, setShapeIndex] = useState(0);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [schedulePattern, setSchedulePattern] = useState<'daily' | 'specific' | 'alternating'>('daily');
  const [eventDate, setEventDate] = useState(""); // For one-time events like doctor appointments
  const [isRecurring, setIsRecurring] = useState(false); // Toggle for event: one-time vs recurring
  const [recurringWeeks, setRecurringWeeks] = useState(1); // Every X weeks
  const [recurringDay, setRecurringDay] = useState(1); // Day of week (0=Sun, 1=Mon, etc.)
  const [startDateOption, setStartDateOption] = useState<'today' | 'tomorrow' | 'custom'>('today'); // When to start medicine
  const [customStartDate, setCustomStartDate] = useState(""); // Custom start date for medicine

  // Track previous values to detect changes
  const prevStrengthUnit = useRef(strengthUnit);
  const prevShapeIndex = useRef(shapeIndex);
  const valueManuallySet = useRef(false);

  // Phase 1: Auto-adjust amount when unit changes (only if user hasn't manually entered a value)
  useEffect(() => {
    // Only adjust if unit actually changed and user hasn't manually set a value
    if (prevStrengthUnit.current !== strengthUnit && strengthUnit) {
      if (!valueManuallySet.current) {
        const unitConfig = FORM_UNITS.find(u => u.unit === strengthUnit);
        if (unitConfig && strengthUnit) {
          setStrengthValue(unitConfig.defaultValue);
        }
      }
    }
    prevStrengthUnit.current = strengthUnit;
  }, [strengthUnit]);

  // Phase 2: Smart transitions when icon type changes
  useEffect(() => {
    const currentIsEvent = isEventShape(SHAPES[shapeIndex]?.id);
    const wasEvent = isEventShape(SHAPES[prevShapeIndex.current]?.id);

    // Only run on actual changes (not initial render)
    if (prevShapeIndex.current !== shapeIndex) {
      // Medicine → Event transition
      if (!wasEvent && currentIsEvent) {
        setStrengthValue("");
        setStrengthUnit("");
        // For events, default to reasonable duration (not "Ongoing")
        if (durationIndex === 3) {
          setDurationIndex(0); // Default to "7 days"
        }
      }

      // Event → Medicine transition  
      if (wasEvent && !currentIsEvent) {
        if (!strengthUnit) {
          setStrengthValue("1");
          setStrengthUnit("pills");
        }
      }
    }

    prevShapeIndex.current = shapeIndex;
  }, [shapeIndex, durationIndex, strengthUnit]);

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

  // Toggle day selection
  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
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

  const handleSave = () => {
    const today = new Date();
    const currentIsEvent = isEventShape(SHAPES[shapeIndex].id);

    let startDate: string;
    let endDate: string | undefined;
    let daysOfWeek: number[] | undefined;

    if (currentIsEvent) {
      // Events: use eventDate for scheduling
      if (!isRecurring && eventDate) {
        // One-time event: show only on that specific day
        startDate = eventDate;
        endDate = eventDate;
      } else if (isRecurring && eventDate) {
        // Recurring event: start from eventDate, specific day of week, ongoing
        startDate = eventDate;
        endDate = undefined;
        daysOfWeek = [recurringDay];
      } else {
        // Fallback: today
        startDate = format(today, "yyyy-MM-dd");
        endDate = startDate;
      }
    } else {
      // Medicines: use start date option
      if (startDateOption === 'tomorrow') {
        startDate = format(addDays(today, 1), "yyyy-MM-dd");
      } else if (startDateOption === 'custom' && customStartDate) {
        startDate = customStartDate;
      } else {
        startDate = format(today, "yyyy-MM-dd");
      }

      const startDateObj = startDateOption === 'tomorrow' ? addDays(today, 1)
        : startDateOption === 'custom' && customStartDate ? new Date(customStartDate)
        : today;

      // Calculate end date from start date
      if (durationIndex === -1 && customEndDate) {
        endDate = customEndDate;
      } else if (durationIndex > -1 && durationIndex < 3 && DURATIONS[durationIndex].days > 0) {
        endDate = format(addDays(startDateObj, DURATIONS[durationIndex].days), "yyyy-MM-dd");
      }

      daysOfWeek = schedulePattern === 'specific' && selectedDays.length > 0 ? selectedDays : undefined;
    }

    const medication: Partial<Medication> = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      strength: currentIsEvent ? "" : `${strengthValue}${strengthUnit}`,
      dosage: "1 dose",
      dosesPerDay: selectedTimes.length,
      timesOfDay: selectedTimes,
      color: COLORS[colorIndex].class,
      shape: SHAPES[shapeIndex].id,
      startDate,
      endDate,
      daysOfWeek,
      alternatingPattern: !currentIsEvent && schedulePattern === 'alternating' ? true : undefined,
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
        {/* Shape - at top for quick type selection */}
        <div className="manual-add__field">
          <label className="manual-add__label">Type</label>
          <div className="manual-add__scroll-row">
            {SHAPES.map((shape, index) => (
              <button
                key={shape.id}
                className={`manual-add__shape ${shapeIndex === index ? "manual-add__shape--active" : ""}`}
                onClick={() => setShapeIndex(index)}
                title={shape.label}
              >
                <MedIcon shapeId={shape.id} size={22} />
              </button>
            ))}
          </div>
        </div>

        {/* Name - label changes based on type */}
        <div className="manual-add__field">
          <label className="manual-add__label">
            {isEventShape(SHAPES[shapeIndex].id) ? "Event Name" : "Medicine Name"}
          </label>
          <div className="manual-add__input-wrapper">
            <input
              type="text"
              className="manual-add__input"
              placeholder={isEventShape(SHAPES[shapeIndex].id) ? "e.g. Doctor appointment" : "e.g. Aspirin"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="off"
            />
            <button
              type="button"
              className="manual-add__ask-ai"
              onClick={() => {
                if (!currentUser?.isGoogleUser) {
                  alert("🌟 AI features are coming!\n\nRegister with Google now to get 50 free AI credits when we launch.");
                } else {
                  alert("✨ Ask AI is coming soon for your account!");
                }
              }}
            >
              <span className="manual-add__ask-ai-icon">✨</span>
              <span className="manual-add__ask-ai-text">Ask AI</span>
            </button>
          </div>
        </div>

        {/* Strength / Amount - only for medicines */}
        {!isEventShape(SHAPES[shapeIndex].id) && (
          <div className="manual-add__field">
            <label className="manual-add__label">Amount / Strength</label>
            <div className="manual-add__strength-row">
              <div className="manual-add__amount-control">
                <button
                  type="button"
                  className="manual-add__amount-btn"
                  onClick={() => {
                    setStrengthValue(prev => String(Math.max(1, Number(prev) - 1)));
                    valueManuallySet.current = true;
                  }}
                  disabled={!strengthValue || Number(strengthValue) <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  className="manual-add__strength-input"
                  value={strengthValue}
                  onChange={(e) => {
                    setStrengthValue(e.target.value);
                    valueManuallySet.current = true;
                  }}
                  min="1"
                  max="9999"
                />
                <button
                  type="button"
                  className="manual-add__amount-btn"
                  onClick={() => {
                    setStrengthValue(prev => String(Number(prev || 0) + 1));
                    valueManuallySet.current = true;
                  }}
                >
                  +
                </button>
              </div>
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
        )}

        {/* Event Schedule - only for events (appointments) */}
        {isEventShape(SHAPES[shapeIndex].id) && (
          <div className="manual-add__field">
            <label className="manual-add__label">Schedule</label>

            {/* One-time vs Recurring toggle */}
            <div className="manual-add__schedule-toggle">
              <button
                type="button"
                className={`manual-add__toggle-btn ${!isRecurring ? "manual-add__toggle-btn--active" : ""}`}
                onClick={() => setIsRecurring(false)}
              >
                📅 One-time
              </button>
              <button
                type="button"
                className={`manual-add__toggle-btn ${isRecurring ? "manual-add__toggle-btn--active" : ""}`}
                onClick={() => setIsRecurring(true)}
              >
                🔄 Recurring
              </button>
            </div>

            {/* One-time: Just date picker */}
            {!isRecurring && (
              <div className="manual-add__onetime-schedule">
                <p className="manual-add__hint">When is your appointment?</p>
                <input
                  type="date"
                  className="manual-add__date-input manual-add__date-input--full"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
            )}

            {/* Recurring: Every X weeks on Day, starting Date */}
            {isRecurring && (
              <div className="manual-add__recurring-schedule">
                <p className="manual-add__hint">How often?</p>

                {/* Every X weeks */}
                <div className="manual-add__recurring-row">
                  <span className="manual-add__recurring-label">Every</span>
                  <div className="manual-add__weeks-picker">
                    {[1, 2, 3, 4].map((weeks) => (
                      <button
                        key={weeks}
                        type="button"
                        className={`manual-add__weeks-btn ${recurringWeeks === weeks ? "manual-add__weeks-btn--active" : ""}`}
                        onClick={() => setRecurringWeeks(weeks)}
                      >
                        {weeks}
                      </button>
                    ))}
                  </div>
                  <span className="manual-add__recurring-label">week{recurringWeeks > 1 ? "s" : ""}</span>
                </div>

                {/* On which day */}
                <div className="manual-add__recurring-row">
                  <span className="manual-add__recurring-label">On</span>
                  <div className="manual-add__day-picker manual-add__day-picker--compact">
                    {DAY_LABELS.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        className={`manual-add__day-btn ${recurringDay === index ? "manual-add__day-btn--active" : ""}`}
                        onClick={() => setRecurringDay(index)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Starting from */}
                <div className="manual-add__recurring-row">
                  <span className="manual-add__recurring-label">Starting</span>
                  <input
                    type="date"
                    className="manual-add__date-input"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
              </div>
            )}
          </div>
        )}


        {/* Time Picker - label changes based on type */}
        <div className="manual-add__field">
          <label className="manual-add__label">
            {isEventShape(SHAPES[shapeIndex].id) ? "At what time?" : "When to take?"}
          </label>
          <p className="manual-add__hint">
            {isEventShape(SHAPES[shapeIndex].id)
              ? "Select appointment time"
              : "Tap to select times (can pick multiple)"}
          </p>

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

        {/* Days of Week - only for medicines */}
        {!isEventShape(SHAPES[shapeIndex].id) && (
          <div className="manual-add__field">
            <label className="manual-add__label">Which days?</label>

            {/* Schedule Pattern Toggle */}
            <div className="manual-add__schedule-toggle">
              <button
                type="button"
                className={`manual-add__toggle-btn ${schedulePattern === 'daily' ? "manual-add__toggle-btn--active" : ""}`}
                onClick={() => {
                  setSchedulePattern('daily');
                  setSelectedDays([]);
                }}
              >
                📅 Every day
              </button>
              <button
                type="button"
                className={`manual-add__toggle-btn ${schedulePattern === 'specific' ? "manual-add__toggle-btn--active" : ""}`}
                onClick={() => setSchedulePattern('specific')}
              >
                🗓️ Specific days
              </button>
              <button
                type="button"
                className={`manual-add__toggle-btn ${schedulePattern === 'alternating' ? "manual-add__toggle-btn--active" : ""}`}
                onClick={() => {
                  setSchedulePattern('alternating');
                  setSelectedDays([]);
                }}
              >
                🔄 Alternating
              </button>
            </div>

            {/* Day picker - only show for specific days */}
            {schedulePattern === 'specific' && (
              <>
                <p className="manual-add__hint">Select which days of the week</p>
                <div className="manual-add__day-picker">
                  {DAY_LABELS.map((label, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`manual-add__day-btn ${selectedDays.includes(index) ? "manual-add__day-btn--active" : ""}`}
                      onClick={() => toggleDay(index)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Summary */}
            <div className="manual-add__day-summary">
              {schedulePattern === 'daily' && (
                <span className="manual-add__day-chip manual-add__day-chip--every">Every day</span>
              )}
              {schedulePattern === 'alternating' && (
                <span className="manual-add__day-chip manual-add__day-chip--alternating">Every other day (from start date)</span>
              )}
              {schedulePattern === 'specific' && selectedDays.length === 0 && (
                <span className="manual-add__day-chip manual-add__day-chip--hint">Select days above</span>
              )}
              {schedulePattern === 'specific' && selectedDays.length > 0 && selectedDays.map(d => (
                <span key={d} className="manual-add__day-chip">
                  {DAY_NAMES[d]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Start Date - only for medicines */}
        {!isEventShape(SHAPES[shapeIndex].id) && (
          <div className="manual-add__field">
            <label className="manual-add__label">Start Date</label>
            <div className="manual-add__start-options">
              <button
                type="button"
                className={`manual-add__start-btn ${startDateOption === 'today' ? "manual-add__start-btn--active" : ""}`}
                onClick={() => setStartDateOption('today')}
              >
                📅 Today
              </button>
              <button
                type="button"
                className={`manual-add__start-btn ${startDateOption === 'tomorrow' ? "manual-add__start-btn--active" : ""}`}
                onClick={() => setStartDateOption('tomorrow')}
              >
                ⏭️ Tomorrow
              </button>
              <button
                type="button"
                className={`manual-add__start-btn ${startDateOption === 'custom' ? "manual-add__start-btn--active" : ""}`}
                onClick={() => setStartDateOption('custom')}
              >
                🗓️ Pick date
              </button>
            </div>
            {startDateOption === 'custom' && (
              <input
                type="date"
                className="manual-add__date-input manual-add__date-input--full"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                min={format(addDays(new Date(), 2), "yyyy-MM-dd")}
              />
            )}
          </div>
        )}

        {/* Duration - only for medicines */}
        {!isEventShape(SHAPES[shapeIndex].id) && (
          <div className="manual-add__field">
            <label className="manual-add__label">For how long?</label>
            <div className="manual-add__duration-grid">
              {DURATIONS.map((duration, index) => (
                <button
                  key={duration.label}
                  className={`manual-add__duration-btn ${durationIndex === index && !showCalendar ? "manual-add__duration-btn--active" : ""}`}
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
        )}


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
          {isValid
            ? (isEventShape(SHAPES[shapeIndex].id) ? "Add Event" : "Add Medicine")
            : (isEventShape(SHAPES[shapeIndex].id) ? "Enter event name" : "Enter medicine name")
          }
        </button>
      </div>
    </div>
  );
};
