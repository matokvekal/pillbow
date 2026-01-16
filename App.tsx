
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { addDays, subDays, startOfDay, isSameDay, format } from 'date-fns';
import { ViewState, Medication, DoseStatus } from './types';
import { MOCK_MEDICATIONS } from './constants';
import { PillboxCard } from './components/PillboxCard';
import { extractMedicationFromImage } from './services/geminiService';
import {
  loadAppData,
  saveAppData,
  updateDoseStatus,
  getDayLog,
  isDateEditable,
  getMedicationsForDate,
} from './services/dataService';
import './App.css';

// Calendar range: 5 years back, 1 year forward
const DAYS_BACK = 365 * 5;   // 5 years
const DAYS_FORWARD = 365;    // 1 year
const TOTAL_DAYS = DAYS_BACK + DAYS_FORWARD + 1;

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('timeline');
  const [activeDate, setActiveDate] = useState<Date>(startOfDay(new Date()));
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [updateKey, setUpdateKey] = useState(0); // Force re-render on dose status change

  const scrollRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Generate days array: 5 years back to 1 year forward
  const days = useCallback(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: TOTAL_DAYS }, (_, i) =>
      addDays(subDays(today, DAYS_BACK), i)
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
    if (view !== 'timeline') return;

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dateAttr = entry.target.getAttribute('data-date');
          if (dateAttr) {
            const newDate = new Date(parseInt(dateAttr));
            setActiveDate(newDate);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-50% 0% -49% 0%',
      threshold: 0
    });

    const dayElements = document.querySelectorAll('.day-container');
    dayElements.forEach(el => observer.current?.observe(el));

    setTimeout(scrollToToday, 200);

    return () => observer.current?.disconnect();
  }, [view]);

  const handleStatusChange = (dateStr: string, medId: string, time: string, status: DoseStatus) => {
    // Only allow changes for today
    if (!isDateEditable(dateStr)) {
      return;
    }

    updateDoseStatus(dateStr, medId, time, status);

    // Force re-render to show updated status
    setUpdateKey(prev => prev + 1);

    // Play sound if enabled
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.play().catch(() => { });
  };

  const scrollToToday = () => {
    const today = startOfDay(new Date());
    const element = document.getElementById(`day-${today.getTime()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const extracted = await extractMedicationFromImage(base64);
        if (extracted) setView('review');
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-logo-container">
          <div className="app-header-logo">
            <span className="app-header-logo-text">P</span>
          </div>
          <h1 className="app-header-title">pillbow</h1>
        </div>
        <button onClick={() => setView('manage')} className="app-header-menu-btn">
          <svg className="app-header-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7" strokeWidth="2.5" /></svg>
        </button>
      </header>

      {/* Main Timeline */}
      {view === 'timeline' && (
        <main
          className="timeline-container hide-scrollbar"
          ref={scrollRef}
        >
          <div className="timeline-days">
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const isEditable = isDateEditable(dateStr);
              const dayMedications = getMedicationsForDate(dateStr, medications);
              const dayLog = getDayLog(dateStr);

              return (
                <div
                  id={`day-${day.getTime()}`}
                  key={day.getTime()}
                  data-date={day.getTime()}
                  className="day-container snap-center transition-all duration-700"
                  style={{
                    opacity: isSameDay(day, activeDate) ? 1 : 0.4,
                    scale: isSameDay(day, activeDate) ? '1' : '0.94',
                    filter: isSameDay(day, activeDate) ? 'none' : 'blur(0.5px)'
                  }}
                >
                  <PillboxCard
                    date={day}
                    active={isSameDay(day, activeDate)}
                    medications={dayMedications}
                    dayLog={dayLog}
                    isEditable={isEditable}
                    onStatusChange={(medId, time, status) => handleStatusChange(dateStr, medId, time, status)}
                    onPillClick={(m) => setSelectedMed(m)}
                    onClick={() => {
                      const el = document.getElementById(`day-${day.getTime()}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* FABs */}
      {view === 'timeline' && (
        <div className="fab-container">
          <button
            onClick={scrollToToday}
            className="fab-today-btn"
          >
            <div className="fab-today-content">
              <span className="fab-today-text">TODAY</span>
              <div className="fab-today-dot" />
            </div>
          </button>

          <div className="fab-add-container">
            <input type="file" accept="image/*" capture="environment" onChange={handleScan} className="fab-add-input" />
            <button className="fab-add-btn">
              <svg className="fab-add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Detail Sheet */}
      {selectedMed && (
        <div className="detail-sheet-overlay">
          <div className="detail-sheet-backdrop" onClick={() => setSelectedMed(null)} />
          <div className="detail-sheet-content">
            <div className="detail-sheet-handle" />
            <div className="detail-sheet-header">
              <div className={`detail-sheet-icon ${selectedMed.color}`}>
                <span className="detail-sheet-icon-emoji">💊</span>
              </div>
              <div className="detail-sheet-info">
                <h3 className="detail-sheet-title">{selectedMed.name}</h3>
                {selectedMed.company && (
                  <span className="detail-sheet-company">{selectedMed.company}</span>
                )}
                <span className="detail-sheet-badge">{selectedMed.dosage} - {selectedMed.strength}</span>
              </div>
            </div>
            <div className="detail-sheet-details">
              <p className="detail-sheet-instructions">{selectedMed.instructions}</p>
              <p className="detail-sheet-schedule">
                {selectedMed.dosesPerDay || 1}x daily at {(selectedMed.timesOfDay || []).join(', ') || 'Not scheduled'}
              </p>
            </div>
            <button onClick={() => setSelectedMed(null)} className="detail-sheet-action-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
