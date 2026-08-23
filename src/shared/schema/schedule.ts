import * as z from 'zod';

// HH:MM pattern
export const TIME_SLOT_PATTERN = /^([01]\d|2[0-3]):(00|15|30|45)$/;
const timeSlotSchema = z.string().regex(TIME_SLOT_PATTERN);

const schedulesSchema = z.object({
   monday: z.array(timeSlotSchema).optional(),
   tuesday: z.array(timeSlotSchema).optional(),
   wednesday: z.array(timeSlotSchema).optional(),
   thursday: z.array(timeSlotSchema).optional(),
   friday: z.array(timeSlotSchema).optional(),
   saturday: z.array(timeSlotSchema).optional(),
   sunday: z.array(timeSlotSchema).optional(),
});

export type WeekSchedules = z.infer<typeof schedulesSchema>;

export function countScheduleSlots(schedules: WeekSchedules): number {
   return Object.values(schedules).reduce(
      (sum, slots) => sum + slots.length,
      0
   );
}

export const scheduleInputSchema = z
   .object({
      is_schedule_active: z.boolean(),
      schedules: schedulesSchema,
   })
   .superRefine((data, ctx) => {
      if (data.is_schedule_active && countScheduleSlots(data.schedules) === 0) {
         ctx.addIssue({
            code: 'custom',
            message: 'Select at least one time slot',
            path: ['schedules'],
         });
      }
   });

export type ScheduleFormValues = z.infer<typeof scheduleInputSchema>;
