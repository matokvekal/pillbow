import React, { useRef } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useDayCardStore } from "../../store/useDayCardStore";
import { useModalStore } from "../../store/useModalStore";
import { loadAppData, saveAppData } from "../../services/dataService";
import "./SettingsView.css";

interface SettingsViewProps {
  onBack: () => void;
  onManageMeds: () => void;
  onAddMedication: () => void;
  medicationCount: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onManageMeds,
  onAddMedication,
  medicationCount
}) => {
  const { users, currentUserId, getCurrentUser } = useUserStore();
  const { toggleManageList } = useDayCardStore();
  const { pushModal } = useModalStore();
  const currentUser = getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManageMeds = () => {
    onBack(); // Close settings view
    pushModal({ type: "manage" }); // Open manage modal
  };

  const handleExport = () => {
    try {
      const appData = loadAppData();
      const dataStr = JSON.stringify(appData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pillbow-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "⚠️ This will REPLACE all your current data.\n\nContinue?"
    );
    if (!confirmed) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (
          !importedData.medications ||
          !Array.isArray(importedData.medications)
        ) {
          throw new Error("Invalid backup file");
        }
        saveAppData(importedData);
        window.location.reload();
      } catch (error) {
        alert("❌ Invalid backup file");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="settings-v2">
      {/* Header */}
      <div className="settings-v2__header">
        <div className="settings-v2__header-content">
          <div className="settings-v2__user-info">
            <div className="settings-v2__avatar">
              {currentUser?.avatar || "👤"}
            </div>
            <div className="settings-v2__user-details">
              <span className="settings-v2__user-name">
                {currentUser?.name || "User"}
              </span>
              <span className="settings-v2__user-role">
                {medicationCount} medications
              </span>
            </div>
          </div>
          <button className="settings-v2__close" onClick={onBack}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="settings-v2__content">
        {/* Quick Actions */}
        <div className="settings-v2__quick-actions">
          <button
            className="quick-action-card quick-action-card--primary"
            onClick={handleManageMeds}
          >
            <div className="quick-action-card__icon">💊</div>
            <div className="quick-action-card__text">
              <span className="quick-action-card__title">Medications</span>
              <span className="quick-action-card__subtitle">
                {medicationCount} active
              </span>
            </div>
            <svg
              className="quick-action-card__arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Data Section */}
        <div className="settings-v2__section">
          <h3 className="settings-v2__section-title">Data & Backup</h3>
          <div className="settings-v2__cards">
            <button
              className="data-card data-card--export"
              onClick={handleExport}
            >
              <div className="data-card__icon-wrap data-card__icon-wrap--blue">
                <span>📤</span>
              </div>
              <div className="data-card__content">
                <span className="data-card__title">Export</span>
                <span className="data-card__desc">Download backup</span>
              </div>
            </button>

            <button
              className="data-card data-card--import"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="data-card__icon-wrap data-card__icon-wrap--green">
                <span>📥</span>
              </div>
              <div className="data-card__content">
                <span className="data-card__title">Import</span>
                <span className="data-card__desc">Restore backup</span>
              </div>
            </button>

            <button
              className="data-card data-card--add"
              onClick={onAddMedication}
            >
              <div className="data-card__icon-wrap data-card__icon-wrap--purple">
                <span>➕</span>
              </div>
              <div className="data-card__content">
                <span className="data-card__title">Add New</span>
                <span className="data-card__desc">New medication</span>
              </div>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleImport}
          />
        </div>

        {/* Family Section */}
        {users.length > 1 && (
          <div className="settings-v2__section">
            <h3 className="settings-v2__section-title">Family Members</h3>
            <div className="settings-v2__family-list">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`family-member ${user.id === currentUserId ? "family-member--active" : ""}`}
                >
                  <span className="family-member__avatar">{user.avatar}</span>
                  <span className="family-member__name">{user.name}</span>
                  {user.id === currentUserId && (
                    <span className="family-member__badge">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App Info */}
        <div className="settings-v2__footer">
          <div className="app-info">
            <span className="app-info__name">PillBow</span>
            <span className="app-info__version">v2.0</span>
          </div>
          <p className="app-info__tagline">Your medication companion</p>
        </div>
      </div>
    </div>
  );
};
