import React, { useState, useEffect, useCallback } from "react";
import { addDays, subDays, startOfDay, format } from "date-fns";
import { ViewState, Medication, DoseStatus } from "./types";
import { MOCK_MEDICATIONS } from "./constants";
import { AppHeader } from "./components/AppHeader/AppHeader";
import { TimelineContainer } from "./components/TimelineContainer/TimelineContainer";
import { FloatingActionButtons } from "./components/FloatingActionButtons/FloatingActionButtons";
import { DetailSheet } from "./components/DetailSheet/DetailSheet";
import { useModalStore } from "./store/useModalStore";
import { extractMedicationFromImage } from "./services/geminiService";
import {
  loadAppData,
  saveAppData,
  updateDoseStatus,
  getDayLog,
  isDateEditable,
  getMedicationsForDate,
} from "./services/dataService";
import "./App.css";

// Calendar range: 5 years back, 1 year forward
const DAYS_BACK = 365 * 5; // 5 years
const DAYS_FORWARD = 365; // 1 year
const TOTAL_DAYS = DAYS_BACK + DAYS_FORWARD + 1;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>("timeline");
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfDay(new Date())); // Start with today open
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isScanning, setIsScanning] = useState(false);
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

    // Just scroll to today on initial load (box is already open via initial state)
    setTimeout(() => {
      const today = startOfDay(new Date());
      const element = document.getElementById(`day-${today.getTime()}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  }, [view]);

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

    // Play sound if enabled
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    );
    audio.play().catch(() => {});
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
    setSelectedDate(date);
    // Scroll to the clicked day
    const element = document.getElementById(`day-${date.getTime()}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleCloseBox = () => {
    setSelectedDate(null);
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(",")[1];
        const extracted = await extractMedicationFromImage(base64);
        if (extracted) setView("review");
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="app-container">
      <AppHeader onMenuClick={() => setView("manage")} />

      {view === "timeline" && (
        <>
          <TimelineContainer
            days={days}
            selectedDate={selectedDate}
            medications={medications}
            dayLogs={
              new Map(
                days
                  .map((day) => format(day, "yyyy-MM-dd"))
                  .map((dateStr) => [dateStr, getDayLog(dateStr)])
                  .filter(([, log]) => log !== undefined) as [string, any][],
              )
            }
            editableDates={
              new Set(
                days
                  .map((day) => format(day, "yyyy-MM-dd"))
                  .filter((dateStr) => isDateEditable(dateStr)),
              )
            }
            onStatusChange={handleStatusChange}
            onPillClick={(m) => openModal(m)}
            onDayClick={handleDayClick}
            onCloseBox={handleCloseBox}
          />

          <FloatingActionButtons
            isScanning={isScanning}
            onScan={handleScan}
            onTodayClick={scrollToToday}
          />
        </>
      )}

      {selectedMed && isOpen && (
        <DetailSheet medication={selectedMed} onClose={closeModal} />
      )}
    </div>
  );
};

export default App;
