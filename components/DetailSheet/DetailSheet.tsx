import React, { useEffect } from "react";
import { Medication } from "../../types";
import { useModalStore } from "../../store/useModalStore";
import "./DetailSheet.css";

interface DetailSheetProps {
  medication: Medication;
  onClose: () => void;
}

export const DetailSheet: React.FC<DetailSheetProps> = ({
  medication,
  onClose,
}) => {
  useEffect(() => {
    // Prevent background scroll when modal is open
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      (appContainer as HTMLElement).style.overflow = "hidden";
    }

    return () => {
      // Restore background scroll on close
      if (appContainer) {
        (appContainer as HTMLElement).style.overflow = "hidden";
      }
    };
  }, []);
  return (
    <div className="detail-sheet-overlay">
      <div className="detail-sheet-backdrop" onClick={onClose} />
      <div className="detail-sheet-content">
        <div className="detail-sheet-handle" />

        <div className="detail-sheet-header">
          <div className={`detail-sheet-icon ${medication.color}`}>
            <span className="detail-sheet-icon-emoji">💊</span>
          </div>
          <div className="detail-sheet-info">
            <h3 className="detail-sheet-title">{medication.name}</h3>
            {medication.company && (
              <span className="detail-sheet-company">{medication.company}</span>
            )}
            <span className="detail-sheet-badge">
              {medication.dosage} - {medication.strength}
            </span>
          </div>
        </div>

        <div className="detail-sheet-details">
          <p className="detail-sheet-instructions">{medication.instructions}</p>
          <p className="detail-sheet-schedule">
            {medication.dosesPerDay || 1}x daily at{" "}
            {(medication.timesOfDay || []).join(", ") || "Not scheduled"}
          </p>
        </div>

        <button onClick={onClose} className="detail-sheet-action-btn">
          Close
        </button>
      </div>
    </div>
  );
};
