
import React, { useState, useMemo } from 'react';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { Medication, DoseStatus, DayLog } from '../types';
import { getIconForTime, getLabelForTime } from '../constants';
import { useTimeSlotStore } from '../store/useTimeSlotStore';
import { MedIcon } from './MedIcons';
import './PillboxCard.css';

interface PillboxCardProps {
  date: Date;
  active: boolean;
  medications: Medication[];
  dayLog?: DayLog;
  isEditable: boolean;
  onStatusChange: (medId: string, time: string, status: DoseStatus) => void;
  onPillClick: (med: Medication) => void;
  onClick: () => void;
}

// Helper to check if a time slot is the current one (within 2 hours)
const isCurrentTimeSlot = (slotTime: string, isToday: boolean): boolean => {
  if (!isToday) return false;
  const now = new Date();
  const [hours, minutes] = slotTime.split(':').map(Number);
  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);

  const diffMs = now.getTime() - slotDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Current slot is one that started within last 2 hours or starts within next hour
  return diffHours >= -1 && diffHours <= 2;
};

// Get dose status from day log
const getDoseStatusFromLog = (
  dayLog: DayLog | undefined,
  medicationId: string,
  time: string
): DoseStatus => {
  if (!dayLog) return DoseStatus.PENDING;
  const dose = dayLog.doses.find(d => d.medicationId === medicationId && d.time === time);
  return dose?.status ?? DoseStatus.PENDING;
};

export const PillboxCard: React.FC<PillboxCardProps> = ({
  date,
  active,
  medications,
  dayLog,
  isEditable,
  onStatusChange,
  onPillClick,
  onClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { expandedDate, expandedSlot, toggleSlot } = useTimeSlotStore();
  const isTodayDate = isToday(date);
  const dayName = isTodayDate ? 'Today' : format(date, 'EEEE');
  const monthYear = format(date, 'MMMM yyyy');
  const dayNum = format(date, 'd');
  const dayShort = format(date, 'EEE').toUpperCase();
  const dateStr = format(date, 'yyyy-MM-dd');

  // Get unique time slots from all medications for this day
  const timeSlots = useMemo(() => {
    const times = new Set<string>();
    medications.forEach(med => {
      const medTimes = med.timesOfDay || [];
      medTimes.forEach(time => times.add(time));
    });
    return Array.from(times).sort();
  }, [medications]);

  // Calculate total doses and taken count
  const { totalDoses, takenCount } = useMemo(() => {
    let total = 0;
    let taken = 0;

    medications.forEach(med => {
      const medTimes = med.timesOfDay || [];
      medTimes.forEach(time => {
        total++;
        const status = getDoseStatusFromLog(dayLog, med.id, time);
        if (status === DoseStatus.TAKEN) taken++;
      });
    });

    return { totalDoses: total, takenCount: taken };
  }, [medications, dayLog]);

  // Get medications for a specific time slot
  const getMedicationsForTime = (time: string) => {
    return medications.filter(med => (med.timesOfDay || []).includes(time));
  };

  // Check if slot is completed
  const isSlotCompleted = (time: string) => {
    const slotMeds = getMedicationsForTime(time);
    return slotMeds.every(med =>
      getDoseStatusFromLog(dayLog, med.id, time) === DoseStatus.TAKEN
    );
  };

  // Handle clicking on a dose to toggle status
  const handleDoseClick = (med: Medication, time: string) => {
    if (!isEditable) return;

    const currentStatus = getDoseStatusFromLog(dayLog, med.id, time);
    const newStatus = currentStatus === DoseStatus.TAKEN ? DoseStatus.PENDING : DoseStatus.TAKEN;
    onStatusChange(med.id, time, newStatus);
  };

  // Handle clicking on slot checkmark - toggles ALL pills in that slot
  const handleSlotClick = (time: string) => {
    if (!isEditable) return;

    const slotMeds = getMedicationsForTime(time);
    const allTaken = isSlotCompleted(time);
    const newStatus = allTaken ? DoseStatus.PENDING : DoseStatus.TAKEN;

    // Toggle all pills in this slot
    slotMeds.forEach(med => {
      onStatusChange(med.id, time, newStatus);
    });
  };

  // Get status indicator style
  const getStatusStyle = (isPastDay: boolean, isFutureDay: boolean) => {
    if (isPastDay) return 'status-past';
    if (isFutureDay) return 'status-future';
    return 'status-today';
  };

  const isPastDay = isPast(date) && !isToday(date);
  const isFutureDay = isFuture(date) && !isToday(date);

  if (!active) {
    return (
      <button
        onClick={onClick}
        className="pillbox-card-inactive"
      >
        <div className="pillbox-card-inactive-content">
          <div className="pillbox-card-inactive-left">
            <div className="pillbox-card-date-container">
              <span className="pillbox-card-day-short">{dayShort}</span>
              <span className="pillbox-card-day-num">{dayNum}</span>
            </div>
            <div className="pillbox-card-pills-preview">
              {medications.slice(0, 5).map((m, idx) => {
                const medTimes = m.timesOfDay || [];
                const firstTime = medTimes[0] || '06:00';
                const status = getDoseStatusFromLog(dayLog, m.id, firstTime);
                const isTaken = status === DoseStatus.TAKEN;

                return (
                  <div key={`${m.id}-${idx}`} className="pillbox-card-pill-preview">
                    <div className={`pillbox-card-pill-preview-circle ${m.color}`}>
                      <span className="pillbox-card-pill-preview-shape"><MedIcon shapeId={m.shape || 'capsule'} size={14} color="white" /></span>
                    </div>
                    {isTaken && (
                      <div className="pillbox-card-pill-preview-check">
                        <svg className="pillbox-card-pill-preview-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pillbox-card-inactive-right">
            <span className="pillbox-card-pill-count">{medications.length} PILLS</span>
            <svg className="pillbox-card-chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={`pillbox-card-active ${!isEditable ? 'pillbox-card-readonly' : ''}`}>
      <div className="pillbox-card-active-inner">

        <div className="pillbox-card-header">
          <div className="pillbox-card-header-row">
            <div className="pillbox-card-header-left">
              <div className="pillbox-card-header-date-box">
                <span className="pillbox-card-header-day-short">{dayShort}</span>
                <span className="pillbox-card-header-day-num">{dayNum}</span>
              </div>
              <div>
                <h2 className="pillbox-card-header-title">{dayName}</h2>
                <p className="pillbox-card-header-subtitle">{monthYear}</p>
              </div>
            </div>
            <div className="pillbox-card-header-right">
              <div className={`pillbox-card-header-badge ${getStatusStyle(isPastDay, isFutureDay)}`}>
                {takenCount}/{totalDoses} {isPastDay ? 'DONE' : isFutureDay ? 'SCHEDULED' : 'DONE'}
              </div>
              {!isEditable && (
                <div className="pillbox-card-lock-icon" title={isPastDay ? "Past days cannot be edited" : "Future days cannot be edited"}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
              <button onClick={onClick} className="pillbox-card-header-close-btn">
                <svg className="pillbox-card-header-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" /></svg>
              </button>
            </div>
          </div>
          <div className="pillbox-card-header-divider" />
        </div>

        {/* Time Slots View - Compact with expandable details */}
        {timeSlots.length > 0 && (
          <div className="pillbox-card-slots-compact">
            {timeSlots.map(time => {
              const slotMeds = getMedicationsForTime(time);
              const slotCompleted = isSlotCompleted(time);
              const icon = getIconForTime(time);
              const label = getLabelForTime(time);
              const isCurrent = isCurrentTimeSlot(time, isTodayDate);
              const isSlotExpanded = expandedDate === dateStr && expandedSlot === time;
              const takenInSlot = slotMeds.filter(m => getDoseStatusFromLog(dayLog, m.id, time) === DoseStatus.TAKEN).length;

              return (
                <div key={time} className="pillbox-card-slot-wrapper">
                  {/* Compact slot header - always visible */}
                  <button
                    type="button"
                    className={`pillbox-card-slot-compact ${slotCompleted ? 'slot-compact--completed' : ''} ${isCurrent ? 'slot-compact--current' : ''} ${isSlotExpanded ? 'slot-compact--expanded' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Slot button clicked!', dateStr, time);
                      toggleSlot(dateStr, time);
                    }}
                  >
                    <div className="slot-compact__left">
                      <span className="slot-compact__icon">{icon}</span>
                      <div className="slot-compact__info">
                        <span className="slot-compact__label">{label}</span>
                        <span className="slot-compact__time">{time}</span>
                      </div>
                    </div>

                    <div className="slot-compact__center">
                      {/* Show first 2 pills as colored dots */}
                      <div className="slot-compact__pills">
                        {slotMeds.slice(0, 2).map((m) => (
                          <div key={m.id} className={`slot-compact__pill ${m.color}`}>
                            <span className="slot-compact__pill-shape"><MedIcon shapeId={m.shape || 'capsule'} size={12} color="white" /></span>
                          </div>
                        ))}
                        {slotMeds.length > 2 && (
                          <span className="slot-compact__more">+{slotMeds.length - 2}</span>
                        )}
                      </div>
                    </div>

                    <div className="slot-compact__right">
                      <span className="slot-compact__count">{takenInSlot}/{slotMeds.length}</span>
                      {/* Checkmark button */}
                      <div
                        className={`slot-compact__check ${slotCompleted ? 'slot-compact__check--done' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditable) handleSlotClick(time);
                        }}
                      >
                        {slotCompleted ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <div className="slot-compact__check-empty" />
                        )}
                      </div>
                      <svg className={`slot-compact__chevron ${isSlotExpanded ? 'slot-compact__chevron--up' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isSlotExpanded && (
                    <div className={`slot-expanded ${isCurrent ? 'slot-expanded--current' : ''}`}>
                      {/* Prominent Time Slot Header - Shows clearly what time period user is viewing */}
                      <div className={`slot-expanded__header ${isCurrent ? 'slot-expanded__header--current' : ''}`}>
                        <div className="slot-expanded__header-icon">{icon}</div>
                        <div className="slot-expanded__header-info">
                          <span className="slot-expanded__header-label">{label} Medicines</span>
                          <span className="slot-expanded__header-time">
                            {isCurrent ? '⏰ Take Now!' : `Scheduled for ${time}`}
                          </span>
                        </div>
                        <div className="slot-expanded__header-count">
                          {takenInSlot}/{slotMeds.length} taken
                        </div>
                      </div>

                      {slotMeds.map((m) => {
                        const medStatus = getDoseStatusFromLog(dayLog, m.id, time);
                        const isTaken = medStatus === DoseStatus.TAKEN;

                        return (
                          <div
                            key={m.id}
                            className={`slot-expanded__med-card ${isTaken ? 'slot-expanded__med-card--taken' : ''}`}
                          >
                            {/* Large pill visual */}
                            <div className="slot-expanded__med-visual">
                              {m.pillImageUrl ? (
                                <img
                                  src={m.pillImageUrl}
                                  alt={m.name}
                                  className="slot-expanded__med-image"
                                />
                              ) : (
                                <div className={`slot-expanded__med-icon-large ${m.color}`}>
                                  <span className="slot-expanded__med-shape-large"><MedIcon shapeId={m.shape || 'capsule'} size={24} color="white" /></span>
                                </div>
                              )}
                            </div>

                            {/* Medicine details */}
                            <div className="slot-expanded__med-details">
                              <div className="slot-expanded__med-header">
                                <span className="slot-expanded__med-name-large">{m.name}</span>
                                <span className="slot-expanded__med-strength-badge">{m.strength}</span>
                              </div>

                              {/* Dosage - prominent */}
                              <div className="slot-expanded__med-dosage-row">
                                <span className="slot-expanded__med-dosage-label">Take:</span>
                                <span className="slot-expanded__med-dosage-value">{m.dosage}</span>
                              </div>

                              {/* Instructions - prominent if exists */}
                              {m.instructions && (
                                <div className="slot-expanded__med-instructions">
                                  <span className="slot-expanded__med-instructions-icon">📋</span>
                                  <span className="slot-expanded__med-instructions-text">{m.instructions}</span>
                                </div>
                              )}
                            </div>

                            {/* Large checkbox on the right */}
                            <button
                              className={`slot-expanded__med-checkbox ${isTaken ? 'slot-expanded__med-checkbox--done' : ''}`}
                              onClick={() => {
                                if (isEditable) handleDoseClick(m, time);
                              }}
                              disabled={!isEditable}
                            >
                              {isTaken ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <span className="slot-expanded__med-checkbox-empty">TAP</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {timeSlots.length === 0 && (
          <div className="pillbox-card-empty">
            <span>No medications scheduled for this day</span>
          </div>
        )}

        {/* Expandable Footer Section */}
        {medications.length > 0 && (
          <div className="pillbox-card-footer">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="pillbox-card-footer-toggle"
            >
              <span className="pillbox-card-footer-toggle-text">
                {isExpanded ? 'Hide Details' : 'Manage List'}
              </span>
              <svg
                className={`pillbox-card-footer-toggle-icon ${isExpanded ? 'pillbox-card-footer-toggle-icon-expanded' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isExpanded && (
              <div className="pillbox-card-footer-content">
                {medications.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onPillClick(m)}
                    className="pillbox-card-med-item"
                  >
                    <div className={`pillbox-card-med-icon ${m.color}`}>
                      <span className="pillbox-card-med-icon-shape"><MedIcon shapeId={m.shape || 'capsule'} size={18} color="white" /></span>
                    </div>
                    <div className="pillbox-card-med-info">
                      <p className="pillbox-card-med-name">{m.name}</p>
                      {m.company && (
                        <span className="pillbox-card-med-company">{m.company}</span>
                      )}
                      <div className="pillbox-card-med-date-range">
                        <span className="pillbox-card-med-date">
                          {m.startDate && `From ${format(new Date(m.startDate), 'dd-MM-yy')}`}
                          {m.endDate && ` to ${format(new Date(m.endDate), 'dd-MM-yy')}`}
                          {!m.startDate && !m.endDate && 'Ongoing'}
                        </span>
                      </div>
                    </div>
                    <div className="pillbox-card-med-dosage">
                      <p className="pillbox-card-med-dosage-amount">{m.dosage}</p>
                      <p className="pillbox-card-med-dosage-strength">{m.strength}</p>
                      <p className="pillbox-card-med-dosage-times">{m.dosesPerDay}x/day</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
