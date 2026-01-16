import React from "react";
import { Medication, DoseStatus, DayLog } from "../../types";
import { getIconForTime, getLabelForTime } from "../../constants";
import "./ListView.css";

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
  const getMedicationsForTime = (time: string) => {
    return medications.filter((med) => (med.timesOfDay || []).includes(time));
  };

  const isSlotCompleted = (time: string) => {
    const slotMeds = getMedicationsForTime(time);
    return slotMeds.every(
      (med) => getDoseStatusFromLog(dayLog, med.id, time) === DoseStatus.TAKEN,
    );
  };

  return (
    <div className="list-view">
      {timeSlots.length === 0 ? (
        <div className="list-view__empty">
          <span>No medications scheduled for this day</span>
        </div>
      ) : (
        timeSlots.map((time) => {
          const slotMeds = getMedicationsForTime(time);
          const slotCompleted = isSlotCompleted(time);
          const icon = getIconForTime(time);
          const label = getLabelForTime(time);
          const groupClass = slotCompleted
            ? "list-view__group list-view__group--completed"
            : "list-view__group";
          const checkBtnClass = `list-view__check-btn ${slotCompleted ? "list-view__check-btn--completed" : ""} ${isEditable ? "list-view__check-btn--editable" : ""}`;

          return (
            <div key={time} className={groupClass}>
              <div className="list-view__header">
                <span className="list-view__icon">{icon}</span>
                <span className="list-view__time">{time}</span>
                <span className="list-view__label">{label}</span>

                <button
                  className={checkBtnClass}
                  onClick={() => onSlotClick(time)}
                  disabled={!isEditable}
                  aria-label={`Mark ${time} medications as ${slotCompleted ? "pending" : "taken"}`}
                >
                  {slotCompleted ? (
                    <svg
                      className="list-view__check-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <div className="list-view__check-empty" />
                  )}
                </button>
              </div>

              <div className="list-view__items">
                {slotMeds.map((m) => (
                  <div
                    key={`${time}-${m.id}`}
                    onClick={() => onMedicationClick(m)}
                    className="list-view__item"
                  >
                    <div className={`list-view__item-icon ${m.color}`}>
                      <div className="list-view__item-pill" />
                    </div>
                    <div className="list-view__item-info">
                      <span className="list-view__item-name">{m.name}</span>
                      <span className="list-view__item-details">
                        {m.dosage} - {m.strength}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
