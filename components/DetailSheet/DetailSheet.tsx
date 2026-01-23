import React, { useEffect, useState } from "react";
import { format, parseISO, differenceInDays, startOfDay } from "date-fns";
import { Medication, getShapeIcon } from "../../types";
import { useModalStore } from "../../store/useModalStore";
import { MedicationEditForm } from "../MedicationEditForm/MedicationEditForm";
import { updateMedication } from "../../services/dataService";
import "./DetailSheet.css";

interface DetailSheetProps {
  medication: Medication;
  onClose: () => void;
  onMedicationUpdate?: (updatedMed: Medication) => void;
}

const getMedStatus = (
  med: Medication
): { label: string; type: string; daysLeft?: number } => {
  if (!med.endDate) return { label: "Ongoing", type: "active" };

  const today = startOfDay(new Date());
  const endDate = startOfDay(parseISO(med.endDate));
  const daysLeft = differenceInDays(endDate, today);

  if (daysLeft < 0) return { label: "Completed", type: "ended" };
  if (daysLeft === 0)
    return { label: "Last day!", type: "last-day", daysLeft: 0 };
  if (daysLeft <= 7)
    return { label: `${daysLeft} days left`, type: "ending-soon", daysLeft };
  return { label: "Active", type: "active", daysLeft };
};

export const DetailSheet: React.FC<DetailSheetProps> = ({
  medication,
  onClose,
  onMedicationUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMed, setCurrentMed] = useState(medication);
  const status = getMedStatus(currentMed);

  // Update currentMed when medication prop changes
  useEffect(() => {
    setCurrentMed(medication);
  }, [medication]);

  useEffect(() => {
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      (appContainer as HTMLElement).style.overflow = "hidden";
    }
    return () => {
      if (appContainer) {
        (appContainer as HTMLElement).style.overflow = "hidden";
      }
    };
  }, []);

  const handleEditSave = (updates: Partial<Medication>) => {
    // Save to localStorage
    updateMedication(medication.id, updates);

    // Update local state
    const updatedMed = { ...currentMed, ...updates };
    setCurrentMed(updatedMed);

    // Notify parent component
    if (onMedicationUpdate) {
      onMedicationUpdate(updatedMed);
    }

    // Close the edit mode
    setIsEditing(false);
  };

  const handleOrderClick = () => {
    const searchQuery = encodeURIComponent(
      `${currentMed.name} ${currentMed.strength} buy online pharmacy`
    );
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  };

  const handleInfoClick = () => {
    const searchQuery = encodeURIComponent(
      `${currentMed.name} drug information side effects`
    );
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  };

  const handleAskAIClick = () => {
    const searchQuery = encodeURIComponent(
      `Tell me about ${currentMed.name} ${currentMed.strength} medication`
    );
    window.open(`https://claude.ai/new?q=${searchQuery}`, "_blank");
  };

  // Edit Mode - Show the new unified edit form
  if (isEditing) {
    return (
      <div className="detail-sheet-overlay">
        <div className="detail-sheet-backdrop" onClick={() => setIsEditing(false)} />
        <div className="detail-sheet-content detail-sheet-content--edit">
          <MedicationEditForm
            medication={currentMed}
            onSave={handleEditSave}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  // View Mode - Show medication details
  return (
    <div className="detail-sheet-overlay">
      <div className="detail-sheet-backdrop" onClick={onClose} />
      <div className="detail-sheet-content">
        <button
          className="manage-view__close-btn detail-sheet__close-x"
          onClick={onClose}
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
        <div className="detail-sheet-handle" />

        {/* Header with pill icon and name */}
        <div className="detail-sheet-header">
          <div className={`detail-sheet-icon ${currentMed.color}`}>
            {currentMed.pillImageUrl ? (
              <img
                src={currentMed.pillImageUrl}
                alt={currentMed.name}
                className="detail-sheet-icon-img"
              />
            ) : (
              <span className="detail-sheet-icon-emoji">
                {getShapeIcon(currentMed.shape)}
              </span>
            )}
          </div>
          <div className="detail-sheet-info">
            <h3 className="detail-sheet-title">{currentMed.name}</h3>
            {currentMed.company && (
              <span className="detail-sheet-company">{currentMed.company}</span>
            )}
            <div className="detail-sheet-badges">
              <span className="detail-sheet-badge">{currentMed.strength}</span>
              <span className="detail-sheet-badge">{currentMed.dosage}</span>
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div
          className={`detail-sheet-status detail-sheet-status--${status.type}`}
        >
          <div className="detail-sheet-status__left">
            {status.type === "ending-soon" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {status.type === "last-day" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {status.type === "ended" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {status.type === "active" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span>{status.label}</span>
          </div>
          {(status.type === "ending-soon" || status.type === "last-day") && (
            <span className="detail-sheet-status__hint">
              Consider refilling
            </span>
          )}
        </div>

        {/* Details grid */}
        <div className="detail-sheet-grid">
          <div className="detail-sheet-grid__item">
            <span className="detail-sheet-grid__label">Schedule</span>
            <span className="detail-sheet-grid__value">
              {currentMed.dosesPerDay || 1}x daily
            </span>
          </div>
          <div className="detail-sheet-grid__item">
            <span className="detail-sheet-grid__label">Times</span>
            <span className="detail-sheet-grid__value">
              {(currentMed.timesOfDay || []).join(", ") || "Not set"}
            </span>
          </div>
          {currentMed.startDate && (
            <div className="detail-sheet-grid__item">
              <span className="detail-sheet-grid__label">Start Date</span>
              <span className="detail-sheet-grid__value">
                {format(parseISO(currentMed.startDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          {currentMed.endDate && (
            <div className="detail-sheet-grid__item">
              <span className="detail-sheet-grid__label">End Date</span>
              <span className="detail-sheet-grid__value">
                {format(parseISO(currentMed.endDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {currentMed.instructions && (
          <div className="detail-sheet-section">
            <h4 className="detail-sheet-section__title">Instructions</h4>
            <p className="detail-sheet-section__text">
              {currentMed.instructions}
            </p>
          </div>
        )}

        {/* Notes */}
        {currentMed.notes && (
          <div className="detail-sheet-section">
            <h4 className="detail-sheet-section__title">Notes</h4>
            <p className="detail-sheet-section__text">{currentMed.notes}</p>
          </div>
        )}

        {/* BIG EDIT Button */}
        <button
          className="detail-sheet-edit-btn"
          onClick={() => setIsEditing(true)}
        >
          <span className="detail-sheet-edit-btn__icon">✏️</span>
          <span className="detail-sheet-edit-btn__text">EDIT</span>
        </button>

        {/* Action Links */}
        <div className="detail-sheet-actions">
          <button
            className="detail-sheet-action detail-sheet-action--order"
            onClick={handleOrderClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Order</span>
          </button>

          <button
            className="detail-sheet-action detail-sheet-action--info"
            onClick={handleInfoClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Info</span>
          </button>

          <button
            className="detail-sheet-action detail-sheet-action--ai"
            onClick={handleAskAIClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
