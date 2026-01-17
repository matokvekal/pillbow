import React, { useState } from "react";
import { Medication } from "../../types";
import { ScanScreen } from "./ScanScreen";
import { ManualAddFlow } from "./ManualAddFlow";
import { SuccessScreen } from "../MedicationEdit/SuccessScreen";
import "./AddMedication.css";

interface AddMedicationProps {
  onClose: () => void;
  onAdd: (medication: Partial<Medication>) => void;
}

type Screen = "main" | "scan" | "manual" | "success";

export const AddMedication: React.FC<AddMedicationProps> = ({
  onClose,
  onAdd,
}) => {
  const [screen, setScreen] = useState<Screen>("main");
  const [successMessage, setSuccessMessage] = useState("");

  const handleScanComplete = (medication: Partial<Medication>) => {
    onAdd(medication);
    setSuccessMessage(`${medication.name} added!`);
    setScreen("success");
  };

  const handleManualAdd = (medication: Partial<Medication>) => {
    onAdd(medication);
    setSuccessMessage(`${medication.name} added!`);
    setScreen("success");
  };

  const handleSuccess = () => {
    onClose();
  };

  // Main screen - two clear options
  if (screen === "main") {
    return (
      <div className="add-med">
        {/* Close button */}
        <button className="add-med__close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="add-med__main">
          {/* Header */}
          <div className="add-med__header">
            <div className="add-med__icon">
              <span>💊</span>
            </div>
            <h1 className="add-med__title">Add Medicine</h1>
            <p className="add-med__subtitle">Choose how to add</p>
          </div>

          {/* Two big buttons */}
          <div className="add-med__buttons">
            <button
              className="add-med__btn add-med__btn--scan"
              onClick={() => setScreen("scan")}
            >
              <div className="add-med__btn-icon">📷</div>
              <div className="add-med__btn-content">
                <p className="add-med__btn-title">Take Photo</p>
                <p className="add-med__btn-desc">Scan the medicine box</p>
              </div>
              <span className="add-med__btn-arrow">→</span>
            </button>

            <button
              className="add-med__btn add-med__btn--manual"
              onClick={() => setScreen("manual")}
            >
              <div className="add-med__btn-icon">✏️</div>
              <div className="add-med__btn-content">
                <p className="add-med__btn-title">Type It</p>
                <p className="add-med__btn-desc">Enter details yourself</p>
              </div>
              <span className="add-med__btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Scan screen
  if (screen === "scan") {
    return (
      <ScanScreen
        onBack={() => setScreen("main")}
        onScanComplete={handleScanComplete}
        onManualFallback={() => setScreen("manual")}
      />
    );
  }

  // Manual add screen
  if (screen === "manual") {
    return (
      <ManualAddFlow
        onBack={() => setScreen("main")}
        onAdd={handleManualAdd}
      />
    );
  }

  // Success screen
  if (screen === "success") {
    return (
      <SuccessScreen
        message={successMessage}
        onDone={handleSuccess}
      />
    );
  }

  return null;
};
