import React from "react";
import { format, parseISO, differenceInDays, startOfDay } from "date-fns";
import classNames from "classnames";
import { Medication } from "../../types";
import { isEventShape } from "../../constants/medFormConfig";
import { MedIcon } from "../MedIcons";
import "./ManageView.css";

interface ManageViewProps {
  medications: Medication[];
  onMedicationClick: (med: Medication) => void;
  onBack: () => void;
}

type MedStatus = "active" | "ending-soon" | "ended" | "upcoming";

const getMedStatus = (med: Medication): MedStatus => {
  const isEvent = isEventShape(med.shape);

  if (!med.endDate) return "active";

  const today = startOfDay(new Date());
  const endDate = startOfDay(parseISO(med.endDate));
  const daysUntilEnd = differenceInDays(endDate, today);

  if (daysUntilEnd < 0) return "ended";

  // One-time events show "upcoming" instead of "ending soon"
  if (isEvent) return "upcoming";

  if (daysUntilEnd <= 7) return "ending-soon";
  return "active";
};

const getStatusLabel = (status: MedStatus, med?: Medication): string => {
  switch (status) {
    case "ending-soon":
      return "Ending soon";
    case "ended":
      return "Completed";
    case "upcoming":
      // Show the date for events
      if (med?.endDate) {
        return format(parseISO(med.endDate), "MMM d");
      }
      return "Upcoming";
    default:
      return "Active";
  }
};

export const ManageView: React.FC<ManageViewProps> = ({
  medications,
  onMedicationClick,
  onBack
}) => {
  // Group medications by status
  const activeMeds = medications.filter((m) => {
    const status = getMedStatus(m);
    return status === "active" || status === "upcoming";
  });
  const endingSoonMeds = medications.filter(
    (m) => getMedStatus(m) === "ending-soon"
  );
  const endedMeds = medications.filter((m) => getMedStatus(m) === "ended");

  const renderMedicationCard = (med: Medication) => {
    const status = getMedStatus(med);

    return (
      <button
        key={med.id}
        className={classNames("manage-med-card", {
          "manage-med-card--ending": status === "ending-soon",
          "manage-med-card--ended": status === "ended"
        })}
        onClick={() => onMedicationClick(med)}
      >
        <div className={classNames("manage-med-card__icon", med.color)}>
          <MedIcon shapeId={med.shape || 'capsule'} size={20} color="white" />
        </div>

        <div className="manage-med-card__info">
          <h3 className="manage-med-card__name">{med.name}</h3>
          <p className="manage-med-card__details">
            {med.strength} • {med.dosage}
          </p>
          <p className="manage-med-card__schedule">{med.dosesPerDay}x daily</p>
        </div>

        <div className="manage-med-card__right">
          <span
            className={classNames("manage-med-card__status", {
              "manage-med-card__status--active": status === "active",
              "manage-med-card__status--upcoming": status === "upcoming",
              "manage-med-card__status--ending": status === "ending-soon",
              "manage-med-card__status--ended": status === "ended"
            })}
          >
            {getStatusLabel(status, med)}
          </span>
          <svg
            className="manage-med-card__chevron"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    );
  };

  return (
    <div className="manage-view">
      <div className="manage-view__header">
        <h1 className="manage-view__title">Manage My Medications</h1>
        <div className="manage-view__count">{medications.length} total</div>
        <button
          className="manage-view__close-btn"
          onClick={onBack}
          aria-label="Close"
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="manage-view__content">
        {/* Ending Soon Section */}
        {endingSoonMeds.length > 0 && (
          <div className="manage-view__section">
            <div className="manage-view__section-header manage-view__section-header--warning">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Ending Soon</span>
              <span className="manage-view__section-count">
                {endingSoonMeds.length}
              </span>
            </div>
            <div className="manage-view__list">
              {endingSoonMeds.map(renderMedicationCard)}
            </div>
          </div>
        )}

        {/* Active Section */}
        {activeMeds.length > 0 && (
          <div className="manage-view__section">
            <div className="manage-view__section-header">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Active</span>
              <span className="manage-view__section-count">
                {activeMeds.length}
              </span>
            </div>
            <div className="manage-view__list">
              {activeMeds.map(renderMedicationCard)}
            </div>
          </div>
        )}

        {/* Completed Section */}
        {endedMeds.length > 0 && (
          <div className="manage-view__section">
            <div className="manage-view__section-header manage-view__section-header--muted">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Completed</span>
              <span className="manage-view__section-count">
                {endedMeds.length}
              </span>
            </div>
            <div className="manage-view__list">
              {endedMeds.map(renderMedicationCard)}
            </div>
          </div>
        )}

        {medications.length === 0 && (
          <div className="manage-view__empty">
            <span className="manage-view__empty-icon">💊</span>
            <p>No medications yet</p>
            <p className="manage-view__empty-hint">
              Scan a prescription to add one
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
