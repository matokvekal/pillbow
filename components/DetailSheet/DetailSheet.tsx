import React, { useEffect, useState } from "react";
import { format, parseISO, differenceInDays, startOfDay } from "date-fns";
import { Medication } from "../../types";
import { useModalStore } from "../../store/useModalStore";
import { MedicationEdit } from "../MedicationEdit";
import "./DetailSheet.css";

interface DetailSheetProps {
  medication: Medication;
  onClose: () => void;
}

const getMedStatus = (med: Medication): { label: string; type: string; daysLeft?: number } => {
  if (!med.endDate) return { label: "Ongoing", type: "active" };

  const today = startOfDay(new Date());
  const endDate = startOfDay(parseISO(med.endDate));
  const daysLeft = differenceInDays(endDate, today);

  if (daysLeft < 0) return { label: "Completed", type: "ended" };
  if (daysLeft === 0) return { label: "Last day!", type: "last-day", daysLeft: 0 };
  if (daysLeft <= 7) return { label: `${daysLeft} days left`, type: "ending-soon", daysLeft };
  return { label: "Active", type: "active", daysLeft };
};

export const DetailSheet: React.FC<DetailSheetProps> = ({
  medication,
  onClose,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const status = getMedStatus(medication);

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

  const handleEditSave = (action: "stop" | "change", data: any) => {
    console.log("Edit action:", action, data);
    // TODO: Update medication in data store
  };

  const handleOrderClick = () => {
    const searchQuery = encodeURIComponent(`${medication.name} ${medication.strength} buy online pharmacy`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  };

  const handleInfoClick = () => {
    const searchQuery = encodeURIComponent(`${medication.name} drug information side effects`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  };

  const handleAskAIClick = () => {
    const searchQuery = encodeURIComponent(`Tell me about ${medication.name} ${medication.strength} medication`);
    window.open(`https://claude.ai/new?q=${searchQuery}`, "_blank");
  };

  return (
    <div className="detail-sheet-overlay">
      <div className="detail-sheet-backdrop" onClick={onClose} />
      <div className="detail-sheet-content">
        <div className="detail-sheet-handle" />

        {/* Header with pill icon and name */}
        <div className="detail-sheet-header">
          <div className={`detail-sheet-icon ${medication.color}`}>
            {medication.pillImageUrl ? (
              <img src={medication.pillImageUrl} alt={medication.name} className="detail-sheet-icon-img" />
            ) : (
              <span className="detail-sheet-icon-emoji">💊</span>
            )}
          </div>
          <div className="detail-sheet-info">
            <h3 className="detail-sheet-title">{medication.name}</h3>
            {medication.company && (
              <span className="detail-sheet-company">{medication.company}</span>
            )}
            <div className="detail-sheet-badges">
              <span className="detail-sheet-badge">{medication.strength}</span>
              <span className="detail-sheet-badge">{medication.dosage}</span>
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div className={`detail-sheet-status detail-sheet-status--${status.type}`}>
          <div className="detail-sheet-status__left">
            {status.type === "ending-soon" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
            )}
            {status.type === "last-day" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
            )}
            {status.type === "ended" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
            )}
            {status.type === "active" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
              </svg>
            )}
            <span>{status.label}</span>
          </div>
          {(status.type === "ending-soon" || status.type === "last-day") && (
            <span className="detail-sheet-status__hint">Consider refilling</span>
          )}
        </div>

        {/* Details grid */}
        <div className="detail-sheet-grid">
          <div className="detail-sheet-grid__item">
            <span className="detail-sheet-grid__label">Schedule</span>
            <span className="detail-sheet-grid__value">
              {medication.dosesPerDay || 1}x daily
            </span>
          </div>
          <div className="detail-sheet-grid__item">
            <span className="detail-sheet-grid__label">Times</span>
            <span className="detail-sheet-grid__value">
              {(medication.timesOfDay || []).join(", ") || "Not set"}
            </span>
          </div>
          {medication.startDate && (
            <div className="detail-sheet-grid__item">
              <span className="detail-sheet-grid__label">Start Date</span>
              <span className="detail-sheet-grid__value">
                {format(parseISO(medication.startDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          {medication.endDate && (
            <div className="detail-sheet-grid__item">
              <span className="detail-sheet-grid__label">End Date</span>
              <span className="detail-sheet-grid__value">
                {format(parseISO(medication.endDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {medication.instructions && (
          <div className="detail-sheet-section">
            <h4 className="detail-sheet-section__title">Instructions</h4>
            <p className="detail-sheet-section__text">{medication.instructions}</p>
          </div>
        )}

        {/* Notes */}
        {medication.notes && (
          <div className="detail-sheet-section">
            <h4 className="detail-sheet-section__title">Notes</h4>
            <p className="detail-sheet-section__text">{medication.notes}</p>
          </div>
        )}

        {/* BIG EDIT Button */}
        <button
          className="detail-sheet-edit-btn"
          onClick={() => setShowEdit(true)}
        >
          <span className="detail-sheet-edit-btn__icon">✏️</span>
          <span className="detail-sheet-edit-btn__text">EDIT</span>
        </button>

        {/* Action Links */}
        <div className="detail-sheet-actions">
          <button className="detail-sheet-action detail-sheet-action--order" onClick={handleOrderClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Order</span>
          </button>

          <button className="detail-sheet-action detail-sheet-action--info" onClick={handleInfoClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Info</span>
          </button>

          <button className="detail-sheet-action detail-sheet-action--ai" onClick={handleAskAIClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Ask AI</span>
          </button>
        </div>

        <button onClick={onClose} className="detail-sheet-close-btn">
          Close
        </button>
      </div>

      {/* Edit Flow */}
      {showEdit && (
        <MedicationEdit
          medication={medication}
          onClose={() => setShowEdit(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};
