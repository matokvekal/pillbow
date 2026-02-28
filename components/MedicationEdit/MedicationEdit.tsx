import React, { useState } from "react";
import { Medication } from "../../types";
import { StopFlow } from "./StopFlow";
import { ChangeFlow } from "./ChangeFlow";
import { SuccessScreen } from "./SuccessScreen";
import { MedIcon } from "../MedIcons";
import "./MedicationEdit.css";

interface MedicationEditProps {
  medication: Medication;
  onClose: () => void;
  onSave: (action: "stop" | "change", data: any) => void;
}

type Screen = "main" | "stop" | "change" | "success";

export const MedicationEdit: React.FC<MedicationEditProps> = ({
  medication,
  onClose,
  onSave,
}) => {
  const [screen, setScreen] = useState<Screen>("main");
  const [successMessage, setSuccessMessage] = useState("");

  const handleStop = (when: "today" | "tomorrow") => {
    onSave("stop", { when });
    setSuccessMessage(
      when === "today"
        ? `${medication.name} stopped from today`
        : `${medication.name} stops tomorrow`
    );
    setScreen("success");
  };

  const handleChange = (data: { strength: string; timesPerDay: number; changeDate?: string }) => {
    onSave("change", data);
    const today = new Date().toISOString().split('T')[0];
    const isFutureChange = data.changeDate && data.changeDate > today;
    setSuccessMessage(
      isFutureChange
        ? `${medication.name} will change to ${data.strength}, ${data.timesPerDay}x daily from ${data.changeDate}`
        : `${medication.name} updated to ${data.strength}, ${data.timesPerDay}x daily`
    );
    setScreen("success");
  };

  const handleSuccess = () => {
    onClose();
  };

  // Main screen
  if (screen === "main") {
    return (
      <div className="med-edit">
        <div className="med-edit__header">
          <button className="med-edit__back-btn" onClick={onClose}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="med-edit__content">
          {/* Medication Icon */}
          <div className={`med-edit__icon ${medication.color}`}>
            <MedIcon shapeId={medication.shape || 'capsule'} size={28} color="white" />
          </div>

          {/* Medication Name */}
          <h1 className="med-edit__name">{medication.name}</h1>
          <p className="med-edit__strength">{medication.strength}</p>

          {/* Action Buttons */}
          <div className="med-edit__actions">
            <button
              className="med-edit__btn med-edit__btn--green"
              onClick={() => setScreen("change")}
            >
              <span className="med-edit__btn-icon">✏️</span>
              <span className="med-edit__btn-text">CHANGE</span>
              <span className="med-edit__btn-hint">dose or times</span>
            </button>

            <button
              className="med-edit__btn med-edit__btn--red"
              onClick={() => setScreen("stop")}
            >
              <span className="med-edit__btn-icon">🛑</span>
              <span className="med-edit__btn-text">STOP TAKING</span>
              <span className="med-edit__btn-hint">no more doses</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stop flow
  if (screen === "stop") {
    return (
      <StopFlow
        medication={medication}
        onBack={() => setScreen("main")}
        onStop={handleStop}
      />
    );
  }

  // Change flow
  if (screen === "change") {
    return (
      <ChangeFlow
        medication={medication}
        onBack={() => setScreen("main")}
        onChange={handleChange}
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
