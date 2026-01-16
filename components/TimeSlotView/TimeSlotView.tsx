import React from "react";
import { Medication, DoseStatus, DayLog } from "../../types";
import { getIconForTime, getLabelForTime } from "../../constants";
import { PillGraphic } from "../PillGraphic/PillGraphic";
import "./TimeSlotView.css";

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
  const getMedicationsForTime = (time: string) => {
    return medications.filter((med) => (med.timesOfDay || []).includes(time));
  };

  const isSlotCompleted = (time: string) => {
    const slotMeds = getMedicationsForTime(time);
    return slotMeds.every(
      (med) => getDoseStatusFromLog(dayLog, med.id, time) === DoseStatus.TAKEN,
    );
  };

  if (timeSlots.length === 0) return null;

  return (
    <div className={`time-slot-view time-slot-view--slots-${timeSlots.length}`}>
      {timeSlots.map((time) => {
        const slotMeds = getMedicationsForTime(time);
        const slotCompleted = isSlotCompleted(time);
        const icon = getIconForTime(time);
        const label = getLabelForTime(time);
        const slotClass = slotCompleted
          ? "time-slot-view__slot time-slot-view__slot--completed"
          : "time-slot-view__slot";
        const checkBtnClass = `time-slot-view__check-btn ${slotCompleted ? "time-slot-view__check-btn--completed" : ""} ${isEditable ? "time-slot-view__check-btn--editable" : ""}`;

        return (
          <div key={time} className={slotClass}>
            <button
              className={checkBtnClass}
              onClick={() => onSlotClick(time)}
              disabled={!isEditable}
              aria-label={`Mark ${time} medications as ${slotCompleted ? "pending" : "taken"}`}
            >
              {slotCompleted ? (
                <svg
                  className="time-slot-view__check-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <div className="time-slot-view__check-empty" />
              )}
            </button>

            <div className="time-slot-view__icon">{icon}</div>

            <span className="time-slot-view__time">{time}</span>

            <div className="time-slot-view__pills">
              {slotMeds.map((m) => (
                <div
                  key={`${time}-${m.id}`}
                  className="time-slot-view__pill-item"
                >
                  <PillGraphic
                    color={m.color}
                    size="sm"
                    count={m.dosage}
                    strength={m.strength}
                  />
                </div>
              ))}
            </div>

            <div className="time-slot-view__label">
              <p className="time-slot-view__label-text">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
