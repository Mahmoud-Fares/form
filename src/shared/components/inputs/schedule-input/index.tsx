import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Checkbox } from '@/shared/components/ui/checkbox';
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '@/shared/components/ui/field';
import { cn } from '@/shared/lib/utils';
import {
   type SchedulePreset,
   applySchedulePreset,
   getTimeSlots,
} from '@/shared/lib/utils/schedule-utils';
import type { ScheduleFormValues } from '@/shared/schema/schedule';

import { WeekTimeGrid } from './week-time-grid';

export function ScheduleInput() {
   const { control } = useFormContext<ScheduleFormValues>();
   const isScheduleActive = useWatch({ control, name: 'is_schedule_active' });

   const allSlotIds = getTimeSlots().map((slot) => slot.id);

   return (
      // demo-start
      <FieldGroup>
         <Controller
            name='is_schedule_active'
            control={control}
            render={({ field }) => (
               <Field>
                  <div className='flex items-center gap-2'>
                     <Checkbox
                        id='is_schedule_active'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                           field.onChange(checked === true)
                        }
                     />
                     <FieldLabel
                        htmlFor='is_schedule_active'
                        className='cursor-pointer font-normal'
                     >
                        Schedule
                     </FieldLabel>
                  </div>
               </Field>
            )}
         />

         <Controller
            name='schedules'
            control={control}
            render={({ field, fieldState }) => (
               <Field data-invalid={fieldState.invalid}>
                  <WeekTimeGrid
                     schedules={field.value}
                     enabled={isScheduleActive}
                     invalid={fieldState.invalid}
                     onSchedulesChange={field.onChange}
                     onPreset={(preset: SchedulePreset) => {
                        field.onChange(
                           applySchedulePreset(field.value, preset, allSlotIds)
                        );
                     }}
                  />

                  {fieldState.invalid && (
                     <FieldError
                        className={cn('mt-2')}
                        errors={[fieldState.error]}
                     />
                  )}
               </Field>
            )}
         />
      </FieldGroup>
      // demo-end
   );
}
