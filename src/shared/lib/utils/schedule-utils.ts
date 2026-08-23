import type { WeekSchedules } from '@/shared/schema/schedule';

// types
export const WEEKDAYS = [
   'monday',
   'tuesday',
   'wednesday',
   'thursday',
   'friday',
   'saturday',
   'sunday',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
   monday: 'Monday',
   tuesday: 'Tuesday',
   wednesday: 'Wednesday',
   thursday: 'Thursday',
   friday: 'Friday',
   saturday: 'Saturday',
   sunday: 'Sunday',
};

export type SchedulePreset = Weekday | 'workdays' | 'weekend' | 'always';

export const WORKDAYS: Weekday[] = [
   'monday',
   'tuesday',
   'wednesday',
   'thursday',
   'friday',
];

export const WEEKEND_DAYS: Weekday[] = ['saturday', 'sunday'];

// utils
export type TimeSlot = {
   id: string;
   label: string;
};

export function getTimeHeaderChunks(slots: TimeSlot[]) {
   const chunks: TimeSlot[][] = [];

   for (let i = 0; i < slots.length; i += 12) {
      chunks.push(slots.slice(i, i + 12));
   }

   return chunks;
}

export function getTimeSlots(use12Hour = false): TimeSlot[] {
   const slots: TimeSlot[] = [];

   for (let i = 0; i < 96; i++) {
      const totalMinutes = i * 15;
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      const id = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      if (use12Hour) {
         const period = hour >= 12 ? 'PM' : 'AM';
         const hour12 = hour % 12 || 12;
         slots.push({
            id,
            label: `${hour12}:${String(minute).padStart(2, '0')} ${period}`,
         });
      } else {
         slots.push({ id, label: id });
      }
   }

   return slots;
}

export function isSlotSelected(
   schedules: WeekSchedules,
   day: Weekday,
   time: string
): boolean {
   return schedules[day]?.includes(time) ?? false;
}

/** monday is the default first day of the week */
export function getOrderedWeekdays(weekStartDay: number): Weekday[] {
   const invert = (8 - weekStartDay) % 7;
   const days = [...WEEKDAYS];

   for (let i = 0; i < invert; i++) {
      days.unshift(days.pop()!);
   }

   return days;
}

function fillDays(days: Weekday[], allSlots: string[]): WeekSchedules {
   return Object.fromEntries(days.map((day) => [day, [...allSlots]]));
}

export function applySchedulePreset(
   current: WeekSchedules,
   preset: SchedulePreset,
   allSlots: string[]
): WeekSchedules {
   if (preset === 'workdays') return fillDays(WORKDAYS, allSlots);
   if (preset === 'weekend') return fillDays(WEEKEND_DAYS, allSlots);
   if (preset === 'always') return fillDays([...WEEKDAYS], allSlots);

   return {
      ...current,
      [preset]: [...allSlots],
   };
}
