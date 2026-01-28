import React from "react";
import { format, isToday as checkIsToday, isPast, isFuture, startOfDay, differenceInDays, parseISO } from "date-fns";
import classNames from "classnames";
import { Medication, DoseStatus, DayLog } from "../../types";
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

      {/* Content wrapper */}
      <div className="inactive-pillbox-card__content">
        <div className="inactive-pillbox-card__left">
          <div className="inactive-pillbox-card__date-container">
            <span className="inactive-pillbox-card__day-short">{dayShort}</span>
            <span className="inactive-pillbox-card__day-num">{dayNum}</span>
            <span className="inactive-pillbox-card__month">{format(date, "MMM")}</span>
          </div>

          {/* Time Slice Preview */}
          <div className="inactive-pillbox-card__timeline-preview">
            {(() => {
              // 1. Get all unique times for active meds on this day
              const allTimes: string[] = Array.from(new Set(
                (medications.flatMap(m => m.timesOfDay || ["06:00"]) as string[])
              )).sort();

              if (allTimes.length === 0) return <div className="timeline-empty-bar" />;

              return (
                <div className="timeline-bar-container">
                  {allTimes.slice(0, 5).map((time, idx) => {
                    const hour = parseInt(time.split(':')[0], 10);

                    // Determine time group class for coloring
                    let timeGroupClass = "time-group-night";
                    if (hour < 6) timeGroupClass = "time-group-early";
                    else if (hour < 9) timeGroupClass = "time-group-morning";
                    else if (hour < 12) timeGroupClass = "time-group-midmorning";
                    else if (hour < 15) timeGroupClass = "time-group-noon";
                    else if (hour < 18) timeGroupClass = "time-group-afternoon";
                    else if (hour < 21) timeGroupClass = "time-group-evening";

                    // Determine status for this slot
                    const medsInSlot = medications.filter(m =>
                      (m.timesOfDay || ["06:00"]).includes(time)
                    );
                    const isSlotTaken = medsInSlot.every(m =>
                      getDoseStatusFromLog(dayLog, m.id, time) === DoseStatus.TAKEN
                    );

                    return (
                      <div
                        key={`${time}-${idx}`}
                        className={classNames("timeline-slice-group", timeGroupClass)}
                        style={{ flex: 1 }}
                      >
                        <div
                          className={classNames("timeline-slice", {
                            "timeline-slice--taken": isSlotTaken
                          })}
                          data-time-hour={hour}
                        >
                          {/* Label Overlay (Time Only) */}
                          <div className="timeline-slice-label">
                            <span className="timeline-slice-time">{time}</span>
                          </div>

                          {/* Taken Checkmark (Small, at the side) */}
                          {isSlotTaken && (
                            <div className="timeline-slice-check">
                              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="inactive-pillbox-card__right">
          {/* Reminder Clock Icon */}
          <button
            className="inactive-pillbox-card__clock-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              // Placeholder for clock action
              console.log("Open reminders for", date);
            }}
            aria-label="Set Reminder"
          >
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </button>

          {/* Pill Icon with Count */}
          <div className="inactive-pillbox-card__pill-icon-wrapper">
            <svg
              width="36"
              height="20"
              viewBox="0 0 36 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inactive-pillbox-card__pill-svg"
            >
              <rect width="36" height="20" rx="10" fill="var(--color-primary-100)" />
              <rect x="0.5" y="0.5" width="35" height="19" rx="9.5" stroke="var(--color-primary-200)" />
            </svg>
            <span className="inactive-pillbox-card__pill-count-text">
              {medications.length}
            </span>
          </div>

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
      </div>
    </button>
  );
};
