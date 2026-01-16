import React from "react";
import { format, isToday as checkIsToday, isPast, isFuture, startOfDay, differenceInDays, parseISO } from "date-fns";
import classNames from "classnames";
import { Medication, DoseStatus, DayLog } from "../../types";
import { PillGraphic } from "../PillGraphic/PillGraphic";
import "./InactivePillboxCard.css";

// Check medication status for a given date
type MedStatus = "active" | "ending-soon" | "last-day" | "ended";

const getMedicationStatus = (med: Medication, date: Date): MedStatus => {
  if (!med.endDate) return "active";

  const endDate = startOfDay(parseISO(med.endDate));
  const checkDate = startOfDay(date);
  const daysUntilEnd = differenceInDays(endDate, checkDate);

  if (daysUntilEnd < 0) return "ended";
  if (daysUntilEnd === 0) return "last-day";
  if (daysUntilEnd <= 7) return "ending-soon";
  return "active";
};

// Get overall status for all medications on a day
const getDayMedStatus = (medications: Medication[], date: Date): MedStatus | null => {
  if (medications.length === 0) return null;

  const statuses = medications.map(med => getMedicationStatus(med, date));

  // Priority: last-day > ending-soon > ended > active
  if (statuses.includes("last-day")) return "last-day";
  if (statuses.includes("ending-soon")) return "ending-soon";
  if (statuses.every(s => s === "ended")) return "ended";
  return null;
};

interface InactivePillboxCardProps {
  date: Date;
  medications: Medication[];
  dayLog?: DayLog;
  isToday?: boolean;
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

export const InactivePillboxCard: React.FC<InactivePillboxCardProps> = ({
  date,
  medications,
  dayLog,
  isToday = false,
  onClick,
}) => {
  const dayShort = format(date, "EEE").toUpperCase();
  const dayNum = format(date, "d");
  const isTodayDate = isToday || checkIsToday(date);
  const normalizedDate = startOfDay(date);
  const isPastDay = isPast(normalizedDate) && !isTodayDate;
  const isFutureDay = isFuture(normalizedDate) && !isTodayDate;

  // Get medication status for this day
  const medStatus = getDayMedStatus(medications, date);

  return (
    <button
      onClick={onClick}
      className={classNames("inactive-pillbox-card", {
        "inactive-pillbox-card--today": isTodayDate,
        "inactive-pillbox-card--past": isPastDay,
        "inactive-pillbox-card--future": isFutureDay,
        "inactive-pillbox-card--ending-soon": medStatus === "ending-soon",
        "inactive-pillbox-card--last-day": medStatus === "last-day",
        "inactive-pillbox-card--ended": medStatus === "ended",
      })}
    >
      <div className="inactive-pillbox-card__bg" />

      {/* Medication status badge */}
      {medStatus && medStatus !== "active" && (
        <div className={classNames("inactive-pillbox-card__status-badge", {
          "inactive-pillbox-card__status-badge--ending-soon": medStatus === "ending-soon",
          "inactive-pillbox-card__status-badge--last-day": medStatus === "last-day",
          "inactive-pillbox-card__status-badge--ended": medStatus === "ended",
        })}>
          {medStatus === "ending-soon" && (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
              <span>Refill soon</span>
            </>
          )}
          {medStatus === "last-day" && (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
              <span>Last day</span>
            </>
          )}
          {medStatus === "ended" && (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
              <span>Completed</span>
            </>
          )}
        </div>
      )}

      <div className="inactive-pillbox-card__left">
        <div className="inactive-pillbox-card__date-container">
          <span className="inactive-pillbox-card__day-short">{dayShort}</span>
          <span className="inactive-pillbox-card__day-num">{dayNum}</span>
        </div>
        <div className="inactive-pillbox-card__pills-preview">
          {medications.slice(0, 5).map((m, idx) => {
            const medTimes = m.timesOfDay || [];
            const firstTime = medTimes[0] || "06:00";
            const status = getDoseStatusFromLog(dayLog, m.id, firstTime);
            const isTaken = status === DoseStatus.TAKEN;

            return (
              <div
                key={`${m.id}-${idx}`}
                className="inactive-pillbox-card__pill-preview"
              >
                <div className="inactive-pillbox-card__pill-preview-circle">
                  <div
                    className={`inactive-pillbox-card__pill-preview-dot ${m.color}`}
                  />
                </div>
                {isTaken && (
                  <div className="inactive-pillbox-card__pill-preview-check">
                    <svg
                      className="inactive-pillbox-card__pill-preview-check-icon"
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="inactive-pillbox-card__right">
        <span className="inactive-pillbox-card__pill-count">
          {medications.length} PILLS
        </span>
        <svg
          className="inactive-pillbox-card__chevron-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 5l7 7-7 7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
};
