import React from "react";
import { format } from "date-fns";
import { Medication, DoseStatus, DayLog } from "../../types";
import { useModalStore } from "../../store/useModalStore";
import { ActivePillboxCard } from "../ActivePillboxCard/ActivePillboxCard";
import { ManageView } from "../ManageView/ManageView";
import { DetailSheet } from "../DetailSheet/DetailSheet";
import "./ModalContainer.css";

interface ModalContainerProps {
  medications: Medication[];
  dayLogs: Map<string, DayLog>;
  editableDates: Set<string>;
  onStatusChange: (dateStr: string, medId: string, time: string, status: DoseStatus) => void;
  onMedicationUpdate: (updatedMed: Medication) => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  medications,
  dayLogs,
  editableDates,
  onStatusChange,
  onMedicationUpdate,
}) => {
  const { modalStack, popModal, pushModal, replaceModal, clearStack } = useModalStore();

  if (modalStack.length === 0) return null;

  const currentModal = modalStack[modalStack.length - 1];

  const handleBack = () => {
    popModal();
  };

  const handleClose = () => {
    clearStack();
  };

  const handleManageClick = () => {
    pushModal({ type: 'manage' });
  };

  const handleMedicationClick = (medication: Medication) => {
    pushModal({ type: 'detail', data: { medication } });
  };

  const handleDayPillClick = (medication: Medication) => {
    // When clicking a pill from the day view, open detail
    pushModal({ type: 'detail', data: { medication } });
  };

  const renderCurrentModal = () => {
    switch (currentModal.type) {
      case 'day': {
        const { date, medications: dayMedications } = currentModal.data;
        const dateStr = format(date, "yyyy-MM-dd");
        const dayLog = dayLogs.get(dateStr);
        const isEditable = editableDates.has(dateStr);

        return (
          <ActivePillboxCard
            date={date}
            medications={dayMedications}
            dayLog={dayLog}
            isEditable={isEditable}
            onStatusChange={(medId, time, status) =>
              onStatusChange(dateStr, medId, time, status)
            }
            onPillClick={handleDayPillClick}
            onClick={handleClose}
            onManageClick={handleManageClick}
          />
        );
      }

      case 'manage': {
        return (
          <ManageView
            medications={medications}
            onMedicationClick={handleMedicationClick}
            onBack={handleClose}
          />
        );
      }

      case 'detail': {
        const { medication } = currentModal.data;
        return (
          <DetailSheet
            medication={medication}
            onClose={handleClose}
            onMedicationUpdate={onMedicationUpdate}
          />
        );
      }

      default:
        return null;
    }
  };

  // DetailSheet has its own overlay, render it directly
  if (currentModal.type === 'detail') {
    return renderCurrentModal();
  }

  // Day and Manage views need the modal container overlay
  return (
    <div className="modal-container-overlay" onClick={handleClose}>
      <div
        className="modal-container-content"
        onClick={(e) => e.stopPropagation()}
      >
        {renderCurrentModal()}
      </div>
    </div>
  );
};
