import React, { useRef } from "react";
import { useUserStore } from "../../store/useUserStore";
import { useDayCardStore } from "../../store/useDayCardStore";
import { useModalStore } from "../../store/useModalStore";
import { loadAppData, saveAppData, clearAllData } from "../../services/dataService";
import { MOCK_VITAMINS } from "../../constants";
import { AppData } from "../../types";
import "./SettingsView.css";

const DEMO_USER_ID = "user_demo";

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

  const handleShare = async () => {
    const shareData = {
      title: "PillBow - Medication Tracker",
      text: "Track your medications easily with PillBow!",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("✅ Link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled or error
      console.log("Share cancelled or failed");
    }
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      "🗑️ Clear All Data?\n\nThis will delete ALL your medications and history.\n\nYou'll start fresh with a clean slate.\n\nThis cannot be undone!"
    );

    if (!confirmed) return;

    // Double confirmation for safety
    const reallyConfirmed = window.confirm(
      "⚠️ Are you absolutely sure?\n\nAll medications and tracking history will be permanently deleted."
    );

    if (reallyConfirmed) {
      clearAllData();
      window.location.reload();
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
        // Validate all required fields
        if (
          !importedData.medications ||
          !Array.isArray(importedData.medications) ||
          !importedData.dayLogs ||
          !Array.isArray(importedData.dayLogs) ||
          !importedData.settings ||
          typeof importedData.settings !== 'object'
        ) {
          throw new Error("Invalid backup file - missing required fields");
        }
        saveAppData(importedData);
        window.location.reload();
      } catch (error) {
        alert("❌ Invalid backup file. Make sure it's a valid PillBow backup.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const isInDemoMode = currentUserId === DEMO_USER_ID;

  const handleEnterDemoMode = () => {
    // Save current user's data first
    const currentData = localStorage.getItem('pillbow_app_data');
    if (currentData) {
      localStorage.setItem(`pillbow_data_${currentUserId}`, currentData);
    }

    // Check if demo user data exists, if not populate with vitamins
    const demoData = localStorage.getItem(`pillbow_data_${DEMO_USER_ID}`);
    if (!demoData) {
      const newDemoData: AppData = {
        medications: MOCK_VITAMINS,
        dayLogs: [],
        settings: { reminderEnabled: true, soundEnabled: true },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`pillbow_data_${DEMO_USER_ID}`, JSON.stringify(newDemoData));
    }

    // Load demo data into active slot
    const demoDataToLoad = localStorage.getItem(`pillbow_data_${DEMO_USER_ID}`);
    if (demoDataToLoad) {
      localStorage.setItem('pillbow_app_data', demoDataToLoad);
    }

    // Switch to demo user
    localStorage.setItem('pillbow_current_user_id', DEMO_USER_ID);
    window.location.reload();
  };

  const handleExitDemoMode = () => {
    // Save demo data
    const demoData = localStorage.getItem('pillbow_app_data');
    if (demoData) {
      localStorage.setItem(`pillbow_data_${DEMO_USER_ID}`, demoData);
    }

    // Load real user's data (default user)
    const realUserId = 'user_default';
    const realData = localStorage.getItem(`pillbow_data_${realUserId}`);
    if (realData) {
      localStorage.setItem('pillbow_app_data', realData);
    } else {
      // No real data exists, start empty
      const emptyData: AppData = {
        medications: [],
        dayLogs: [],
        settings: { reminderEnabled: true, soundEnabled: true },
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('pillbow_app_data', JSON.stringify(emptyData));
    }

    // Switch back to default user
    localStorage.setItem('pillbow_current_user_id', realUserId);
    window.location.reload();
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
          <div className="settings-v2__cards settings-v2__cards--4col">
            <button
              className="data-card data-card--sm data-card--export"
              onClick={handleExport}
            >
              <div className="data-card__icon-wrap data-card__icon-wrap--blue">
                <span>📤</span>
              </div>
              <div className="data-card__content">
                <span className="data-card__title">Export</span>
              </div>
            </button>

            <button
              className="data-card data-card--sm data-card--import"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="data-card__icon-wrap data-card__icon-wrap--green">
                <span>📥</span>
              </div>
              <div className="data-card__content">
                <span className="data-card__title">Import</span>
              </div>
            </button>

            <button
              className="data-card data-card--sm data-card--share"
              onClick={handleShare}
            >
              <div className="data-card__icon-wrap data-card__icon-wrap--pink">
                <span>📲</span>
              </div>
              <div className="data-card__content">
                <span className="data-card__title">Share</span>
              </div>
            </button>

            <button
              className="data-card data-card--sm data-card--add"
              onClick={onAddMedication}
            >
              <div className="data-card__icon-wrap data-card__icon-wrap--purple">
                <span>➕</span>
              </div>
              <div className="data-card__content">
                <span className="data-card__title">Add</span>
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

        {/* Demo Mode Section */}
        <div className="settings-v2__section">
          <h3 className="settings-v2__section-title">Try Sample Data</h3>
          {isInDemoMode ? (
            <button
              className="demo-card demo-card--exit"
              onClick={handleExitDemoMode}
            >
              <div className="demo-card__icon">🔙</div>
              <div className="demo-card__content">
                <span className="demo-card__title">Exit Sample Mode</span>
                <span className="demo-card__desc">Return to your real medications</span>
              </div>
            </button>
          ) : (
            <button
              className="demo-card demo-card--enter"
              onClick={handleEnterDemoMode}
            >
              <div className="demo-card__icon">🧪</div>
              <div className="demo-card__content">
                <span className="demo-card__title">Try with Sample Vitamins</span>
                <span className="demo-card__desc">See how the app works (your data stays safe)</span>
              </div>
            </button>
          )}
        </div>

        {/* Reset Section */}
        <div className="settings-v2__section">
          <h3 className="settings-v2__section-title">Start Fresh</h3>
          <button
            className="reset-card"
            onClick={handleClearData}
          >
            <div className="reset-card__icon">🗑️</div>
            <div className="reset-card__content">
              <span className="reset-card__title">Clear All Data</span>
              <span className="reset-card__desc">Remove all medications & start over</span>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="settings-v2__footer">
          <div className="app-info">
            <span className="app-info__name">PillBow</span>
            <span className="app-info__version">pilbow-ver:0.0.1</span>
          </div>
          <p className="app-info__tagline">Your medication companion</p>
        </div>
      </div>
    </div>
  );
};
