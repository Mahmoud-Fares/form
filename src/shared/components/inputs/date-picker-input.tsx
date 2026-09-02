import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';

// eslint-disable-next-line project-structure/independent-modules
import type { DatePickerFormValues } from '@/app/pages/date-picker';

import { DateInput } from './date-input';

export function DatePickerInput() {
   const { control } = useFormContext<DatePickerFormValues>();

   return (
      // demo-start
      <Controller
         name='date'
         control={control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel htmlFor='date'>Date:</FieldLabel>

               <DateInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder='Select a date'
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
