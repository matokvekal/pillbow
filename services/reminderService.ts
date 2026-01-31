import { Medication, DoseStatus } from '../types';
import { getMedicationsForDate, getDayLog } from './dataService';
import { format } from 'date-fns';

export interface PendingReminder {
  medicationId: string;
  medicationName: string;
  time: string;
  doseKey: string;
  minutesUntilDose: number;
}

/**
 * Check which doses need a reminder right now.
 *
 * A dose needs a reminder when:
 * 1. It's for today and the medication is active
 * 2. Current time is within [doseTime - leadMinutes, doseTime)
 * 3. The dose status is still Pending (not Taken or Skipped)
 * 4. It hasn't already been notified (not in notifiedDoses set)
 */
export function getDueReminders(
  medications: Medication[],
  leadTimeMinutes: number,
  notifiedDoses: Set<string>
): PendingReminder[] {
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const activeMeds = getMedicationsForDate(todayStr, medications);
  const dayLog = getDayLog(todayStr);
  const reminders: PendingReminder[] = [];

  for (const med of activeMeds) {
    if (!med.timesOfDay) continue;

    for (const time of med.timesOfDay) {
      const [hours, mins] = time.split(':').map(Number);
      const doseMinutes = hours * 60 + mins;
      const windowStart = doseMinutes - leadTimeMinutes;

      // Is current time within the reminder window?
      if (nowMinutes >= windowStart && nowMinutes < doseMinutes) {
        const doseKey = `${todayStr}|${med.id}|${time}`;

        // Already notified this session?
        if (notifiedDoses.has(doseKey)) continue;

        // Already taken or skipped?
        if (dayLog) {
          const doseRecord = dayLog.doses.find(
            (d) => d.medicationId === med.id && d.time === time
          );
          if (doseRecord && doseRecord.status !== DoseStatus.PENDING) continue;
        }

        reminders.push({
          medicationId: med.id,
          medicationName: med.name,
          time,
          doseKey,
          minutesUntilDose: doseMinutes - nowMinutes,
        });
      }
    }
  }

  return reminders;
}
