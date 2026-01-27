import React from "react";
import { format, isToday, isPast, isFuture } from "date-fns";
import "./CardHeader.css";

interface CardHeaderProps {
  date: Date;
  takenCount: number;
  totalDoses: number;
  isEditable: boolean;
  onClose: () => void;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  date,
  takenCount,
  totalDoses,
  isEditable,
  onClose
}) => {
  const dayName = isToday(date) ? "Today" : format(date, "EEEE");
  const monthYear = format(date, "MMMM yyyy");
  const dayNum = format(date, "d");
  const dayShort = format(date, "EEE").toUpperCase();

  const isPastDay = isPast(date) && !isToday(date);
  const isFutureDay = isFuture(date) && !isToday(date);

  const getStatusStyle = () => {
    if (isPastDay) return "card-header__badge--past";
    if (isFutureDay) return "card-header__badge--future";
    return "card-header__badge--today";
  };

  const getStatusLabel = () => {
    if (isPastDay) return "DONE";
    if (isFutureDay) return "SCHEDULED";
    return "DONE";
  };

  const badgeClass = `card-header__badge ${getStatusStyle()}`;

  return (
    <div className="card-header">
      <div className="card-header__left">
        <div className="card-header__date-box">
          <span className="card-header__day-short">{dayShort}</span>
          <span className="card-header__day-num">{dayNum}</span>
        </div>
        <div>
          <h2 className="card-header__title">{dayName}</h2>
          <p className="card-header__subtitle">{monthYear}</p>
        </div>
      </div>

      <div className="card-header__right">
        {!isEditable && (
          <div
            className="card-header__lock-icon"
            title={
              isPastDay
                ? "Past days cannot be edited"
                : "Future days cannot be edited"
            }
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}

        {/* Close button on the right */}
        <button
          className="card-header__close-btn"
          onClick={onClose}
          aria-label="Close card"
        >
          <svg
            className="card-header__close-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
