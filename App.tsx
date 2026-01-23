import React, { useState, useEffect, useCallback, useMemo } from "react";
import { addDays, subDays, startOfDay, format } from "date-fns";
import { ViewState, Medication, DoseStatus, DayLog } from "./types";
import {
  MOCK_MEDICATIONS,
  INITIAL_SCROLL_DELAY,
  NOTIFICATION_SOUND_URL,
  DAYS_BACK,
  DAYS_FORWARD,
  TOTAL_DAYS,
} from "./constants";
import { AppHeader } from "./components/AppHeader/AppHeader";
import { TimelineContainer } from "./components/TimelineContainer/TimelineContainer";
import { FloatingActionButtons } from "./components/FloatingActionButtons/FloatingActionButtons";
import { DetailSheet } from "./components/DetailSheet/DetailSheet";
import { ManageView } from "./components/ManageView/ManageView";
import { AddMedication } from "./components/AddMedication/AddMedication";
import { SettingsView } from "./components/SettingsView/SettingsView";
import { useModalStore } from "./store/useModalStore";
import { useUserStore } from "./store/useUserStore";
import { useDayCardStore } from "./store/useDayCardStore";
import {
  loadAppData,
  saveAppData,
  addMedication,
  updateDoseStatus,
  getDayLog,
  isDateEditable,
  getMedicationsForDate,
} from "./services/dataService";
import { playNotificationSound } from "./utils/audioAndFileUtils";
import "./App.css";

// Calendar range: 5 years back, 1 year forward
// DAYS_BACK, DAYS_FORWARD, and TOTAL_DAYS are now imported from constants

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>("timeline");
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    startOfDay(new Date()),
  ); // Start with today open
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updateKey, setUpdateKey] = useState(0); // Force re-render on dose status change
  const { selectedMed, isOpen, openModal, closeModal } = useModalStore();

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

    // Then load app data as usual (dataService reads from localStorage, which is managed by user store now)
    const data = loadAppData();
    if (data.medications.length > 0) {
      setMedications(data.medications);
    } else {
      // Initialize with mock data if empty
      setMedications(MOCK_MEDICATIONS);
      saveAppData({
        ...data,
        medications: MOCK_MEDICATIONS,
      });
    }
  }, []);

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

  const scrollToToday = () => {
    const today = startOfDay(new Date());
    // Open today's box
    setSelectedDate(today);
    // Scroll to today
    const element = document.getElementById(`day-${today.getTime()}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleDayClick = (date: Date) => {
    // Close all expanded slots and manage list when selecting a new day
    useDayCardStore.getState().closeAll();

    setSelectedDate(date);
    // Scroll to the clicked day
    const element = document.getElementById(`day-${date.getTime()}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCloseBox = () => {
    // Close all expanded slots when closing day box
    useDayCardStore.getState().closeAll();
    setSelectedDate(null);
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
      <AppHeader onMenuClick={() => setView("settings")} />

      {view === "timeline" && (
        <>
          <TimelineContainer
            days={days}
            selectedDate={selectedDate}
            medications={medications}
            dayLogs={dayLogsMap}
            editableDates={editableDatesSet}
            onStatusChange={handleStatusChange}
            onPillClick={(medication) => openModal(medication)}
            onDayClick={handleDayClick}
            onCloseBox={handleCloseBox}
          />

          <FloatingActionButtons
            onAddClick={() => setShowAddModal(true)}
            onTodayClick={scrollToToday}
          />
        </>
      )}

      {view === "manage" && (
        <ManageView
          medications={medications}
          onMedicationClick={(medication) => openModal(medication)}
          onBack={() => setView("timeline")}
        />
      )}

      {view === "settings" && (
        <SettingsView
          onBack={() => setView("timeline")}
          onManageMeds={() => setView("manage")}
          medicationCount={medications.length}
        />
      )}

      {selectedMed && isOpen && (
        <DetailSheet
          medication={selectedMed}
          onClose={closeModal}
          onMedicationUpdate={handleMedicationUpdate}
        />
      )}

      {showAddModal && (
        <AddMedication
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMedication}
        />
      )}
    </div>
  );
};

export default App;
