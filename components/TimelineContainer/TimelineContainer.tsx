import React, { useRef } from "react";
import classNames from "classnames";
import { isToday, format } from "date-fns";
import { Medication, DoseStatus, DayLog } from "../../types";
import { InactivePillboxCard } from "../InactivePillboxCard/InactivePillboxCard";
import { ActivePillboxCard } from "../ActivePillboxCard/ActivePillboxCard";
import "./TimelineContainer.css";

interface TimelineContainerProps {
  days: Date[];
  selectedDate: Date | null;
  medications: Medication[];
  dayLogs: Map<string, DayLog>;
  editableDates: Set<string>;
  onStatusChange: (
    dateStr: string,
    medId: string,
    time: string,
    status: DoseStatus,
  ) => void;
  onPillClick: (med: Medication) => void;
  onDayClick: (date: Date) => void;
  onCloseBox: () => void;
}

export const TimelineContainer: React.FC<TimelineContainerProps> = ({
  days,
  selectedDate,
  medications,
  dayLogs,
  editableDates,
  onStatusChange,
  onPillClick,
  onDayClick,
  onCloseBox,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get medications for a specific day
  const getMedicationsForDay = (day: Date) => {
    return medications.filter((med) => {
      if (!med.startDate || !med.endDate) return true;
      const medDate = day.getTime();
      const startDate = new Date(med.startDate).getTime();
      const endDate = new Date(med.endDate).getTime();
      return medDate >= startDate && medDate <= endDate;
    });
  };

  // Get data for the selected day (for the modal)
  const selectedDayData = selectedDate
    ? {
        date: selectedDate,
        dateStr: format(selectedDate, "yyyy-MM-dd"),
        medications: getMedicationsForDay(selectedDate),
        dayLog: dayLogs.get(format(selectedDate, "yyyy-MM-dd")),
        isEditable: editableDates.has(format(selectedDate, "yyyy-MM-dd")),
      }
    : null;

  return (
    <main className={classNames("timeline-container")} ref={scrollRef}>
      {/* Scrollable day list */}
      <div className={classNames("timeline-days")}>
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayMedications = getMedicationsForDay(day);
          const dayLog = dayLogs.get(dateStr);
          const isTodayDate = isToday(day);

          return (
            <div
              id={`day-${day.getTime()}`}
              key={day.getTime()}
              data-date={day.getTime()}
              className={classNames("timeline-day-item", {
                "timeline-day-item--today": isTodayDate,
              })}
            >
              <InactivePillboxCard
                date={day}
                medications={dayMedications}
                dayLog={dayLog}
                isToday={isTodayDate}
                onClick={() => onDayClick(day)}
              />
            </div>
          );
        })}
      </div>

      {/* Fixed modal overlay for selected day */}
      {selectedDayData && (
        <div className="day-box-overlay" onClick={onCloseBox}>
          <div
            className="day-box-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <ActivePillboxCard
              date={selectedDayData.date}
              medications={selectedDayData.medications}
              dayLog={selectedDayData.dayLog}
              isEditable={selectedDayData.isEditable}
              onStatusChange={(medId, time, status) =>
                onStatusChange(selectedDayData.dateStr, medId, time, status)
              }
              onPillClick={onPillClick}
              onClick={onCloseBox}
            />
          </div>
        </div>
      )}
    </main>
  );
};
