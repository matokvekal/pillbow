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
    setSuccessMessage(`${medication.name} added from scan!`);
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

  // Main screen - choose scan or manual
  if (screen === "main") {
    return (
      <div className="add-med">
        <div className="add-med__header">
          <button className="add-med__close-btn" onClick={onClose}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="add-med__content">
          {/* Icon */}
          <div className="add-med__icon">
            <span>💊</span>
          </div>

          {/* Title */}
          <h1 className="add-med__title">ADD NEW</h1>
          <p className="add-med__subtitle">Medicine</p>

          {/* Action Buttons */}
          <div className="add-med__actions">
            <button
              className="add-med__btn add-med__btn--scan"
              onClick={() => setScreen("scan")}
            >
              <span className="add-med__btn-icon">📷</span>
              <span className="add-med__btn-text">SCAN</span>
              <span className="add-med__btn-hint">take photo of box</span>
            </button>

            <button
              className="add-med__btn add-med__btn--manual"
              onClick={() => setScreen("manual")}
            >
              <span className="add-med__btn-icon">✍️</span>
              <span className="add-med__btn-text">FILL BY HAND</span>
              <span className="add-med__btn-hint">type the details</span>
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
