import React from "react";
import { Medication, DoseStatus, DayLog } from "../../types";
import { getIconForTime, getLabelForTime } from "../../constants";
import { useDayCardStore } from "../../store/useDayCardStore";
import { MedIcon } from "../MedIcons";
import "./ListView.css";

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

interface ListViewProps {
  timeSlots: string[];
  medications: Medication[];
  dayLog?: DayLog;
  isEditable: boolean;
  onSlotClick: (time: string) => void;
  onMedicationClick: (med: Medication) => void;
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

export const ListView: React.FC<ListViewProps> = ({
  timeSlots,
  medications,
  dayLog,
  isEditable,
  onSlotClick,
  onMedicationClick,
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

  if (timeSlots.length === 0) {
    return (
      <div className="list-view">
        <div className="list-view__empty">
          <span>No medications scheduled for this day</span>
        </div>
      </div>
    );
  }

  return (
    <div className="list-view">
      {timeSlots.map((time, slotIndex) => {
        const slotMeds = getMedicationsForTime(time);
        const slotCompleted = isSlotCompleted(time);
        const icon = getIconForTime(time);
        const label = getLabelForTime(time);
        const isExpanded = expandedSlot === time;
        const takenCount = slotMeds.filter(
          (m) => getDoseStatusFromLog(dayLog, m.id, time) === DoseStatus.TAKEN
        ).length;
        const slotColor = getSlotColor(time);
        const slotBgColor = getSlotBgColor(time);

        return (
          <div key={time} className="lv-slot-wrapper">
            {/* Compact Header Row - Time-based colors */}
            <button
              type="button"
              className={`lv-slot-header ${slotCompleted ? 'lv-slot-header--completed' : ''} ${isExpanded ? 'lv-slot-header--expanded' : ''}`}
              style={{
                borderLeftColor: slotColor,
                background: slotCompleted ? undefined : slotBgColor
              }}
              onClick={() => toggleSlot(time)}
            >
              {/* Time Icon */}
              <span className="lv-slot-header__icon">{icon}</span>

              {/* Time & Label */}
              <div className="lv-slot-header__time-block">
                <span className="lv-slot-header__time">{time}</span>
                <span className="lv-slot-header__label">{label}</span>
              </div>

              {/* Pill Icons - show all up to 5, then +N */}
              <div className="lv-slot-header__pills">
                {slotMeds.slice(0, 5).map((m) => (
                  <div key={m.id} className={`lv-slot-header__pill ${m.color}`}>
                    <MedIcon shapeId={m.shape || 'capsule'} size={14} color="white" />
                  </div>
                ))}
                {slotMeds.length > 5 && (
                  <span className="lv-slot-header__more">+{slotMeds.length - 5}</span>
                )}
              </div>

              {/* Pills Count */}
              <div className="lv-slot-header__count-box" style={{ backgroundColor: slotColor }}>
                <span className="lv-slot-header__count-num">{slotMeds.length}</span>
                <span className="lv-slot-header__count-label">pills</span>
              </div>

              {/* Taken Status */}
              <span className="lv-slot-header__status">{takenCount}/{slotMeds.length}</span>

              {/* Expand Arrow */}
              <div className={`lv-slot-header__chevron ${isExpanded ? 'lv-slot-header__chevron--up' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Expanded Medicine List */}
            {isExpanded && (
              <div className="lv-slot-expanded">
                {slotMeds.map((med) => {
                  const isTaken = getDoseStatusFromLog(dayLog, med.id, time) === DoseStatus.TAKEN;
                  return (
                    <div
                      key={med.id}
                      className={`lv-med-card ${isTaken ? 'lv-med-card--taken' : ''}`}
                      onClick={() => onMedicationClick(med)}
                    >
                      <div className={`lv-med-card__icon ${med.color}`}>
                        <MedIcon shapeId={med.shape || 'capsule'} size={18} color="white" />
                      </div>
                      <div className="lv-med-card__info">
                        <span className="lv-med-card__name">{med.name}</span>
                        <span className="lv-med-card__strength">{med.strength}</span>
                        <span className="lv-med-card__dosage">{med.dosage}</span>
                      </div>
                      <button
                        className={`lv-med-card__check ${isTaken ? 'lv-med-card__check--done' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditable) onSlotClick(time);
                        }}
                        disabled={!isEditable}
                      >
                        {isTaken ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
