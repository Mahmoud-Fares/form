import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';

// eslint-disable-next-line project-structure/independent-modules
import type { DateRangeFormValues } from '@/app/pages/date-range';

import { DateRangeInput } from './date-range-input';

export function DateRangeForm() {
   const { control } = useFormContext<DateRangeFormValues>();

   return (
      // demo-start
      <Controller
         name='range'
         control={control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel htmlFor={field.name}>Date Picker Range:</FieldLabel>

               <DateRangeInput
                  id={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Select a date range'
                  aria-invalid={fieldState.invalid}
               />

               {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
               )}
            </Field>
         )}
      />
      // demo-end
   );
}
