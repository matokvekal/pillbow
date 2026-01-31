import React, { useState } from "react";
import { Medication } from "../../types";
import { ManualAddFlow } from "./ManualAddFlow";
import { SuccessScreen } from "../MedicationEdit/SuccessScreen";

interface AddMedicationProps {
  onClose: () => void;
  onAdd: (medication: Partial<Medication>) => void;
}

export const AddMedication: React.FC<AddMedicationProps> = ({
  onClose,
  onAdd,
}) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleManualAdd = (medication: Partial<Medication>) => {
    onAdd(medication);
    setSuccessMessage(`${medication.name} added!`);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        message={successMessage}
        onDone={onClose}
      />
    );
  }

  return (
    <ManualAddFlow
      onBack={onClose}
      onAdd={handleManualAdd}
    />
  );
};
