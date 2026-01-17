
import React, { useState, useMemo } from 'react';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { Medication, DoseStatus, DayLog, getShapeIcon } from '../types';
import { getIconForTime, getLabelForTime } from '../constants';
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

const PillGraphic: React.FC<{ color: string; size?: 'sm' | 'md'; count?: string; strength?: string; shape?: string }> = ({ color, size = 'md', count, strength, shape }) => {
  const pillSizeClass = size === 'sm' ? 'pill-graphic-pill-sm' : 'pill-graphic-pill-md';
  const shapeIcon = getShapeIcon(shape);
  return (
    <div className="pill-graphic-container">
      <div className="pill-graphic-label-container">
        {strength && <span className="pill-graphic-strength">{strength}</span>}
        {count && <span className="pill-graphic-count">{count}</span>}
      </div>
      <div className={`pill-graphic-pill ${pillSizeClass} ${color}`}>
        <span className="pill-graphic-shape">{shapeIcon}</span>
      </div>
    </div>
  );
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
  const dayName = isToday(date) ? 'Today' : format(date, 'EEEE');
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

  // Determine display mode: 'slots' (1-5 time slots) or 'list' (more than 5)
  const displayMode = timeSlots.length <= 5 ? 'slots' : 'list';

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
        <div className="pillbox-card-inactive-bg" />

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
                    <span className="pillbox-card-pill-preview-shape">{getShapeIcon(m.shape)}</span>
                  </div>
                  {isTaken && (
                    <div className="pillbox-card-pill-preview-check">
                      <svg className="pillbox-card-pill-preview-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="pillbox-card-inactive-right">
           <span className="pillbox-card-pill-count">{medications.length} PILLS</span>
           <svg className="pillbox-card-chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </button>
    );
  }

  return (
    <div className={`pillbox-card-active ${!isEditable ? 'pillbox-card-readonly' : ''}`}>
      <div className="pillbox-card-active-inner">

        <div className="pillbox-card-header">
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
               <svg className="pillbox-card-header-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round"/></svg>
             </button>
          </div>
          <div className="pillbox-card-header-divider" />
        </div>

        {/* Time Slots View (1-5 slots) */}
        {displayMode === 'slots' && timeSlots.length > 0 && (
          <div className={`pillbox-card-slots pillbox-card-slots-${timeSlots.length}`}>
            {timeSlots.map(time => {
              const slotMeds = getMedicationsForTime(time);
              const slotCompleted = isSlotCompleted(time);
              const icon = getIconForTime(time);
              const label = getLabelForTime(time);

              return (
                <div
                  key={time}
                  className={`pillbox-card-slot ${slotCompleted ? 'slot-completed' : ''}`}
                >
                   {/* Slot Checkmark - Click to mark all pills as taken */}
                   <button
                     className={`pillbox-card-slot-check-btn ${slotCompleted ? 'slot-check-completed' : ''} ${isEditable ? 'slot-check-editable' : ''}`}
                     onClick={() => handleSlotClick(time)}
                     disabled={!isEditable}
                   >
                     {slotCompleted ? (
                       <svg className="pillbox-card-slot-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path d="M5 13l4 4L19 7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                     ) : (
                       <div className="slot-check-empty" />
                     )}
                   </button>

                   <div className="pillbox-card-slot-icon">{icon}</div>
                   <span className="pillbox-card-slot-time">{time}</span>

                   <div className="pillbox-card-slot-pills">
                      {slotMeds.map((m) => (
                        <div key={`${time}-${m.id}`} className="pillbox-card-slot-pill-item">
                          <PillGraphic
                            color={m.color}
                            size="sm"
                            count={m.dosage}
                            strength={m.strength}
                            shape={m.shape}
                          />
                        </div>
                      ))}
                   </div>

                   <div className="pillbox-card-slot-label">
                      <p className="pillbox-card-slot-label-text">{label}</p>
                   </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View (more than 5 slots or no medications) */}
        {(displayMode === 'list' || timeSlots.length === 0) && (
          <div className="pillbox-card-list">
            {timeSlots.length === 0 ? (
              <div className="pillbox-card-empty">
                <span>No medications scheduled for this day</span>
              </div>
            ) : (
              timeSlots.map(time => {
                const slotMeds = getMedicationsForTime(time);
                const slotCompleted = isSlotCompleted(time);
                const icon = getIconForTime(time);
                const label = getLabelForTime(time);

                return (
                  <div key={time} className={`pillbox-card-list-group ${slotCompleted ? 'list-group-completed' : ''}`}>
                    <div className="pillbox-card-list-header">
                      <span className="pillbox-card-list-icon">{icon}</span>
                      <span className="pillbox-card-list-time">{time}</span>
                      <span className="pillbox-card-list-label">{label}</span>
                      {/* Slot Checkmark Button */}
                      <button
                        className={`pillbox-card-list-check-btn ${slotCompleted ? 'list-check-completed' : ''} ${isEditable ? 'list-check-editable' : ''}`}
                        onClick={() => handleSlotClick(time)}
                        disabled={!isEditable}
                      >
                        {slotCompleted ? (
                          <svg className="pillbox-card-list-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <div className="list-check-empty" />
                        )}
                      </button>
                    </div>
                    <div className="pillbox-card-list-items">
                      {slotMeds.map(m => (
                        <div
                          key={`${time}-${m.id}`}
                          className="pillbox-card-list-item"
                        >
                          <div className={`pillbox-card-list-item-icon ${m.color}`}>
                            <span className="pillbox-card-list-item-shape">{getShapeIcon(m.shape)}</span>
                          </div>
                          <div className="pillbox-card-list-item-info">
                            <span className="pillbox-card-list-item-name">{m.name}</span>
                            <span className="pillbox-card-list-item-details">{m.dosage} - {m.strength}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
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
                <path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
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
                      <span className="pillbox-card-med-icon-shape">{getShapeIcon(m.shape)}</span>
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
