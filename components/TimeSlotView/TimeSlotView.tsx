import React from "react";
import { Medication, DoseStatus, DayLog } from "../../types";
import { getIconForTime, getLabelForTime } from "../../constants";
import { useDayCardStore } from "../../store/useDayCardStore";
import { MedIcon } from "../MedIcons";
import "./TimeSlotView.css";

// Time-based colors: Morning=green, Mid-morning=yellow, Noon=orange, Afternoon=purple, Evening=blue
const getSlotColor = (time: string): string => {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 9) return "#22c55e";    // Morning - Green
  if (hour < 12) return "#eab308";   // Mid-morning - Yellow
  if (hour < 15) return "#f97316";   // Noon - Orange
  if (hour < 18) return "#a855f7";   // Afternoon - Purple
  return "#3b82f6";                   // Evening - Blue
};

const getSlotBgColor = (time: string): string => {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 9) return "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)";    // Light green
  if (hour < 12) return "linear-gradient(135deg, #fefce8 0%, #fef08a 100%)";   // Light yellow
  if (hour < 15) return "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)";   // Light orange
  if (hour < 18) return "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)";   // Light purple
  return "linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%)";                   // Light blue
};

interface TimeSlotViewProps {
  timeSlots: string[];
  medications: Medication[];
  dayLog?: DayLog;
  isEditable: boolean;
  onSlotClick: (time: string) => void;
}

const getDoseStatusFromLog = (
  dayLog: DayLog | undefined,
  medicationId: string,
  time: string,
): DoseStatus => {
  if (!dayLog) return DoseStatus.PENDING;
  const dose = dayLog.doses.find(
    (d) => d.medicationId === medicationId && d.time === time,
  );
  return dose?.status ?? DoseStatus.PENDING;
};

export const TimeSlotView: React.FC<TimeSlotViewProps> = ({
  timeSlots,
  medications,
  dayLog,
  isEditable,
  onSlotClick,
}) => {
  const { expandedSlot, toggleSlot } = useDayCardStore();

  const getMedicationsForTime = (time: string) => {
    return medications.filter((med) => (med.timesOfDay || []).includes(time));
  };

  const isSlotCompleted = (time: string) => {
    const slotMeds = getMedicationsForTime(time);
    return slotMeds.every(
      (med) => getDoseStatusFromLog(dayLog, med.id, time) === DoseStatus.TAKEN,
    );
  };

  const handleSlotHeaderClick = (time: string) => {
    toggleSlot(time);
  };

  if (timeSlots.length === 0) return null;

  const hasExpanded = expandedSlot !== null;

  return (
    <div
      className={`time-slot-view-new ${hasExpanded ? 'has-expanded-slot' : ''}`}
      data-slot-count={timeSlots.length}
    >
      {timeSlots.map((time) => {
        const slotMeds = getMedicationsForTime(time);
        const slotCompleted = isSlotCompleted(time);
        const icon = getIconForTime(time);
        const label = getLabelForTime(time);
        const isExpanded = expandedSlot === time;
        const takenCount = slotMeds.filter(m => getDoseStatusFromLog(dayLog, m.id, time) === DoseStatus.TAKEN).length;

        // All slots - show compact header with chevron to expand
        const hour = parseInt(time.split(':')[0], 10);

        return (
          <div key={time} className="tsv-slot-wrapper">
            <button
              type="button"
              className={`tsv-slot-header ${slotCompleted ? 'tsv-slot-header--completed' : ''} ${isExpanded ? 'tsv-slot-header--expanded' : ''}`}
              data-time-hour={hour}
              onClick={() => handleSlotHeaderClick(time)}
            >
              <span className="tsv-slot-header__icon">{icon}</span>
              <span className="tsv-slot-header__time">{time}</span>
              <span className="tsv-slot-header__label">{label}</span>

              <div className="tsv-slot-header__pills">
                {slotMeds.length > 0 && (
                  <>
                    <div className={`tsv-slot-header__pill ${slotMeds[0].color}`}>
                      <MedIcon shapeId={slotMeds[0].shape || 'capsule'} size={14} color="white" />
                    </div>
                    <span className="tsv-slot-header__pills-count">{slotMeds.length}X</span>
                  </>
                )}
              </div>

              {/* Show checkmark if completed, nothing if not */}
              {slotCompleted && (
                <span className="tsv-slot-header__check-done">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}

              <div className={`tsv-slot-header__chevron ${isExpanded ? 'tsv-slot-header__chevron--up' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Expanded Medicine Details */}
            {isExpanded && (
              <div className="tsv-slot-expanded">
                <div className="tsv-slot-expanded__header">
                  <span className="tsv-slot-expanded__header-icon">{icon}</span>
                  <span className="tsv-slot-expanded__header-title">{label} Medicines</span>
                  <span className="tsv-slot-expanded__header-count">{takenCount}/{slotMeds.length} taken</span>
                </div>

                {slotMeds.map((med) => {
                  const isTaken = getDoseStatusFromLog(dayLog, med.id, time) === DoseStatus.TAKEN;
                  // Parse dosage to extract count (e.g., "2 tablets" -> 2)
                  const dosageMatch = med.dosage.match(/^(\d+)/);
                  const pillCount = dosageMatch ? dosageMatch[1] : '1';

                  return (
                    <div
                      key={med.id}
                      className={`tsv-med-card ${isTaken ? 'tsv-med-card--taken' : ''}`}
                    >
                      <div className={`tsv-med-card__icon ${med.color}`} data-count={pillCount}>
                        <MedIcon shapeId={med.shape || 'capsule'} size={18} color="white" />
                      </div>
                      <div className="tsv-med-card__info">
                        <span className="tsv-med-card__name">{med.name}</span>
                        <span className="tsv-med-card__strength">{med.strength}</span>
                        <span className="tsv-med-card__dosage">{med.dosage}</span>
                        {med.instructions && (
                          <div className="tsv-med-card__instructions">
                            <span>📋 {med.instructions}</span>
                          </div>
                        )}
                      </div>
                      <button
                        className={`tsv-med-card__check ${isTaken ? 'tsv-med-card__check--done' : ''}`}
                        onClick={() => {
                          if (isEditable) {
                            onSlotClick(time);
                          }
                        }}
                        disabled={!isEditable}
                      >
                        {isTaken ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span>TAP</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
