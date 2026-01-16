import React, { useMemo } from "react";
import classNames from "classnames";
import { Medication, DoseStatus, DayLog } from "../../types";
import { CardHeader } from "../CardHeader/CardHeader";
import { TimeSlotView } from "../TimeSlotView/TimeSlotView";
import { ListView } from "../ListView/ListView";
import { MedicationFooter } from "../MedicationFooter/MedicationFooter";
import "./ActivePillboxCard.css";

interface ActivePillboxCardProps {
  date: Date;
  medications: Medication[];
  dayLog?: DayLog;
  isEditable: boolean;
  onStatusChange: (medId: string, time: string, status: DoseStatus) => void;
  onPillClick: (med: Medication) => void;
  onClick: () => void;
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

export const ActivePillboxCard: React.FC<ActivePillboxCardProps> = ({
  date,
  medications,
  dayLog,
  isEditable,
  onStatusChange,
  onPillClick,
  onClick,
}) => {
  // Get unique time slots from all medications for this day
  const timeSlots = useMemo(() => {
    const times = new Set<string>();
    medications.forEach((med) => {
      const medTimes = med.timesOfDay || [];
      medTimes.forEach((time) => times.add(time));
    });
    return Array.from(times).sort();
  }, [medications]);

  // Calculate total doses and taken count
  const { totalDoses, takenCount } = useMemo(() => {
    let total = 0;
    let taken = 0;

    medications.forEach((med) => {
      const medTimes = med.timesOfDay || [];
      medTimes.forEach((time) => {
        total++;
        const status = getDoseStatusFromLog(dayLog, med.id, time);
        if (status === DoseStatus.TAKEN) taken++;
      });
    });

    return { totalDoses: total, takenCount: taken };
  }, [medications, dayLog]);

  // Determine display mode: 'slots' (1-5 time slots) or 'list' (more than 5)
  const displayMode = timeSlots.length <= 5 ? "slots" : "list";

  const getMedicationsForTime = (time: string) => {
    return medications.filter((med) => (med.timesOfDay || []).includes(time));
  };

  const isSlotCompleted = (time: string) => {
    const slotMeds = getMedicationsForTime(time);
    return slotMeds.every(
      (med) => getDoseStatusFromLog(dayLog, med.id, time) === DoseStatus.TAKEN,
    );
  };

  // Handle clicking on slot checkmark - toggles ALL pills in that slot
  const handleSlotClick = (time: string) => {
    if (!isEditable) return;

    const slotMeds = getMedicationsForTime(time);
    const allTaken = isSlotCompleted(time);
    const newStatus = allTaken ? DoseStatus.PENDING : DoseStatus.TAKEN;

    // Toggle all pills in this slot
    slotMeds.forEach((med) => {
      onStatusChange(med.id, time, newStatus);
    });
  };

  return (
    <div
      className={classNames("active-pillbox-card", {
        "active-pillbox-card--readonly": !isEditable,
      })}
    >
      <div className={classNames("active-pillbox-card__inner")}>
        <CardHeader
          date={date}
          takenCount={takenCount}
          totalDoses={totalDoses}
          isEditable={isEditable}
          onClose={onClick}
        />

        {/* Time Slots View (1-5 slots) */}
        {displayMode === "slots" && timeSlots.length > 0 && (
          <TimeSlotView
            timeSlots={timeSlots}
            medications={medications}
            dayLog={dayLog}
            isEditable={isEditable}
            onSlotClick={handleSlotClick}
          />
        )}

        {/* List View (more than 5 slots or no medications) */}
        {(displayMode === "list" || timeSlots.length === 0) && (
          <ListView
            timeSlots={timeSlots}
            medications={medications}
            dayLog={dayLog}
            isEditable={isEditable}
            onSlotClick={handleSlotClick}
            onMedicationClick={onPillClick}
          />
        )}

        {/* Expandable Footer Section */}
        <MedicationFooter
          medications={medications}
          onMedicationClick={onPillClick}
        />
      </div>
    </div>
  );
};
