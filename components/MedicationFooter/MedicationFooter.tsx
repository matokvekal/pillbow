import React from "react";
import { format } from "date-fns";
import { Medication } from "../../types";
import { useDayCardStore } from "../../store/useDayCardStore";
import "./MedicationFooter.css";

interface MedicationFooterProps {
  medications: Medication[];
  onMedicationClick: (med: Medication) => void;
}

export const MedicationFooter: React.FC<MedicationFooterProps> = ({
  medications,
  onMedicationClick,
}) => {
  const { isManageListOpen, toggleManageList } = useDayCardStore();

  if (medications.length === 0) return null;

  const toggleIconClass = isManageListOpen ? "medication-footer__toggle-icon medication-footer__toggle-icon--expanded" : "medication-footer__toggle-icon";

  return (
    <div className="medication-footer">
      <button className="medication-footer__toggle" onClick={toggleManageList}>
        <span className="medication-footer__toggle-text">
          {isManageListOpen ? "Hide Details" : "Manage List"}
        </span>
        <svg className={toggleIconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isManageListOpen && (
        <div className="medication-footer__content">
          {medications.map((m) => (
            <div key={m.id} onClick={() => onMedicationClick(m)} className="medication-footer__med-item">
              <div className={`medication-footer__med-icon ${m.color}`}>
                <div className="medication-footer__med-icon-pill" />
              </div>
              <div className="medication-footer__med-info">
                <p className="medication-footer__med-name">{m.name}</p>
                {m.company && <span className="medication-footer__med-company">{m.company}</span>}
                <div className="medication-footer__med-date-range">
                  <span className="medication-footer__med-date">
                    {m.startDate && `From ${format(new Date(m.startDate), "dd-MM-yy")}`}
                    {m.endDate && ` to ${format(new Date(m.endDate), "dd-MM-yy")}`}
                    {!m.startDate && !m.endDate && "Ongoing"}
                  </span>
                </div>
              </div>
              <div className="medication-footer__med-dosage">
                <p className="medication-footer__med-dosage-amount">{m.dosage}</p>
                <p className="medication-footer__med-dosage-strength">{m.strength}</p>
                <p className="medication-footer__med-dosage-times">{m.dosesPerDay}x/day</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
