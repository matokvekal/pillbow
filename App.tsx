import React, { useState, useEffect, useCallback, useMemo } from "react";
import { addDays, subDays, startOfDay, format } from "date-fns";
import { ViewState, Medication, DoseStatus, DayLog } from "./types";
import {
  INITIAL_SCROLL_DELAY,
  NOTIFICATION_SOUND_URL,
  DAYS_BACK,
  DAYS_FORWARD,
  TOTAL_DAYS,
  MOCK_VITAMINS,
} from "./constants";
import { AppHeader } from "./components/AppHeader/AppHeader";
import { TimelineContainer } from "./components/TimelineContainer/TimelineContainer";
import { ModalContainer } from "./components/ModalContainer/ModalContainer";
import { AddMedication } from "./components/AddMedication/AddMedication";
import { SettingsView } from "./components/SettingsView/SettingsView";
import { TermsModal } from "./components/TermsModal/TermsModal";
import { useModalStore } from "./store/useModalStore";
import { useUserStore } from "./store/useUserStore";
import { useDayCardStore } from "./store/useDayCardStore";
import {
  loadAppData,
  saveAppData,
  addMedication,
  updateMedication,
  updateDoseStatus,
  getDayLog,
  isDateEditable,
  getMedicationsForDate,
} from "./services/dataService";
import { playNotificationSound } from "./utils/audioAndFileUtils";
import "./styles/med-colors.css";
import "./App.css";

// Calendar range: 5 years back, 1 year forward
// DAYS_BACK, DAYS_FORWARD, and TOTAL_DAYS are now imported from constants

const ONBOARDING_DISMISSED_KEY = "pillbow_onboarding_dismissed";

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>("timeline");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [updateKey, setUpdateKey] = useState(0); // Force re-render on dose status change
  const { pushModal } = useModalStore();

  // Generate days array: 5 years back to 1 year forward
  const days = useCallback(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: TOTAL_DAYS }, (_, i) =>
      addDays(subDays(today, DAYS_BACK), i),
    );
  }, [])();

  // Load data on mount
  useEffect(() => {
    // Initialize user store (loads users and sets up current user)
    useUserStore.getState().init();

    // Load app data - starts empty for new users (no auto-mock data)
    const data = loadAppData();
    setMedications(data.medications);

    // Show onboarding if empty and not dismissed before
    const wasDismissed = localStorage.getItem(ONBOARDING_DISMISSED_KEY) === "true";
    if (data.medications.length === 0 && !wasDismissed) {
      setShowOnboarding(true);
    }
  }, []);

  const handleLoadSampleVitamins = () => {
    // Add sample vitamins to current user's data
    const data = loadAppData();
    const updatedData = {
      ...data,
      medications: MOCK_VITAMINS,
      lastUpdated: new Date().toISOString(),
    };
    saveAppData(updatedData);
    setMedications(MOCK_VITAMINS);
    setShowOnboarding(false);
    setUpdateKey((prev) => prev + 1);
  };

  const handleDismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
    setShowOnboarding(false);
  };

  useEffect(() => {
    if (view !== "timeline") return;

    scrollToTodayOnMount();
  }, [view]);

  /**
   * Scrolls to today's date on component mount or view change
   * Uses a delay to ensure DOM is ready before scrolling
   */
  const scrollToTodayOnMount = useCallback(() => {
    setTimeout(() => {
      const today = startOfDay(new Date());
      const element = document.getElementById(`day-${today.getTime()}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, INITIAL_SCROLL_DELAY);
  }, []);

  const handleStatusChange = (
    dateStr: string,
    medId: string,
    time: string,
    status: DoseStatus,
  ) => {
    // Only allow changes for today
    if (!isDateEditable(dateStr)) {
      return;
    }

    updateDoseStatus(dateStr, medId, time, status);

    // Force re-render to show updated status
    setUpdateKey((prev) => prev + 1);

    // Play notification sound
    playNotificationSound(NOTIFICATION_SOUND_URL);
  };

  const getMedicationsForDay = (day: Date) => {
    return medications.filter((med) => {
      if (!med.startDate || !med.endDate) {
        // Still check day-of-week even without date range
      } else {
        const medDate = day.getTime();
        const startDate = new Date(med.startDate).getTime();
        const endDate = new Date(med.endDate).getTime();
        if (medDate < startDate || medDate > endDate) return false;
      }
      // Day-of-week filter
      if (med.daysOfWeek && med.daysOfWeek.length > 0) {
        if (!med.daysOfWeek.includes(day.getDay())) return false;
      }
      return true;
    });
  };

  const scrollToToday = () => {
    const today = startOfDay(new Date());
    // Open today's box using modal stack
    pushModal({
      type: 'day',
      data: {
        date: today,
        medications: getMedicationsForDay(today),
      }
    });
    // Scroll to today
    const element = document.getElementById(`day-${today.getTime()}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleDayClick = (date: Date) => {
    // Close all expanded slots and manage list when selecting a new day
    useDayCardStore.getState().closeAll();

    // Open day using modal stack
    pushModal({
      type: 'day',
      data: {
        date,
        medications: getMedicationsForDay(date),
      }
    });

    // Scroll to the clicked day
    const element = document.getElementById(`day-${date.getTime()}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleAddMedication = (medData: Partial<Medication>) => {
    // Generate full medication with defaults
    const newMed: Medication = {
      id: medData.id || `med-${Date.now()}`,
      name: medData.name || "Unknown",
      strength: medData.strength || "100mg",
      dosage: medData.dosage || "1 tablet",
      dosesPerDay: medData.dosesPerDay || 1,
      timesOfDay: medData.timesOfDay || ["06:00"],
      instructions: medData.instructions || "",
      color: medData.color || "bg-blue-300",
      company: medData.company,
      pillImageUrl: medData.pillImageUrl,
      startDate: medData.startDate || new Date().toISOString().split("T")[0],
      endDate: medData.endDate,
      daysOfWeek: medData.daysOfWeek,
      notes: medData.notes,
    };

    // Save to localStorage
    addMedication(newMed);

    // Update local state
    setMedications((prev) => [...prev, newMed]);

    // Force re-render
    setUpdateKey((prev) => prev + 1);

    // Close the modal
    setShowAddModal(false);
  };

  const handleMedicationUpdate = (updatedMed: Medication) => {
    // Update the medication in local state
    setMedications((prev) =>
      prev.map((med) => (med.id === updatedMed.id ? updatedMed : med))
    );

    // Force re-render
    setUpdateKey((prev) => prev + 1);
  };

  const handleDismissRefill = (medIds: string[]) => {
    medIds.forEach((id) => {
      updateMedication(id, { refillDismissed: true });
    });

    // Update local state
    setMedications((prev) =>
      prev.map((med) =>
        medIds.includes(med.id) ? { ...med, refillDismissed: true } : med
      )
    );

    setUpdateKey((prev) => prev + 1);
  };

  /**
   * Memoized map of day logs indexed by date string
   * Prevents unnecessary recalculation on each render
   */
  const dayLogsMap = useMemo(() => {
    const logsEntries = days
      .map((day) => format(day, "yyyy-MM-dd"))
      .map((dateStr) => [dateStr, getDayLog(dateStr)])
      .filter(([, log]) => log !== undefined) as [string, DayLog][];
    return new Map(logsEntries);
  }, [days, updateKey]);

  /**
   * Memoized set of editable dates
   * Prevents unnecessary recalculation on each render
   */
  const editableDatesSet = useMemo(() => {
    const editableDateStrings = days
      .map((day) => format(day, "yyyy-MM-dd"))
      .filter((dateStr) => isDateEditable(dateStr));
    return new Set(editableDateStrings);
  }, [days]);

  return (
    <div className="app-container">
      <AppHeader onMenuClick={() => setView("settings")} onTodayClick={scrollToToday} />

      {view === "timeline" && (
        <>
          <TimelineContainer
            days={days}
            selectedDate={null}
            medications={medications}
            dayLogs={dayLogsMap}
            editableDates={editableDatesSet}
            onStatusChange={handleStatusChange}
            onPillClick={() => { }}
            onDayClick={handleDayClick}
            onCloseBox={() => { }}
            onDismissRefill={handleDismissRefill}
          />

          <button
            className="fab-add"
            onClick={() => setShowAddModal(true)}
            aria-label="Add medication"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {view === "settings" && (
        <SettingsView
          onBack={() => setView("timeline")}
          onManageMeds={() => setView("manage")}
          onAddMedication={() => {
            setView("timeline");
            setShowAddModal(true);
          }}
          medicationCount={medications.length}
        />
      )}

      {/* New Modal Stack Container */}
      <ModalContainer
        medications={medications}
        dayLogs={dayLogsMap}
        editableDates={editableDatesSet}
        onStatusChange={handleStatusChange}
        onMedicationUpdate={handleMedicationUpdate}
      />

      {showAddModal && (
        <AddMedication
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMedication}
        />
      )}

      {/* Onboarding Modal - shows when empty and not dismissed */}
      {showOnboarding && (
        <div className="onboarding-overlay">
          <div className="onboarding-modal">
            <button
              className="onboarding-close"
              onClick={handleDismissOnboarding}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="onboarding-icon">💊</div>
            <h2 className="onboarding-title">Welcome to PillBow</h2>
            <p className="onboarding-text">No medications yet</p>

            {/* Terms & Conditions Agreement */}
            <div className="onboarding-terms">
              <label className="onboarding-terms__label">
                <input
                  type="checkbox"
                  className="onboarding-terms__checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span className="onboarding-terms__text">
                  I have read and agree to the{" "}
                  <button
                    className="onboarding-terms__link"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>
            </div>

            <div className="onboarding-actions">
              <button
                className="onboarding-btn onboarding-btn--primary"
                onClick={handleLoadSampleVitamins}
                disabled={!termsAccepted}
              >
                Try with Sample Vitamins
              </button>
              <button
                className="onboarding-btn onboarding-btn--secondary"
                onClick={() => {
                  handleDismissOnboarding();
                  setShowAddModal(true);
                }}
                disabled={!termsAccepted}
              >
                Add My Medication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <TermsModal
          onClose={() => setShowTermsModal(false)}
          onAgree={() => {
            setTermsAccepted(true);
            setShowTermsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
