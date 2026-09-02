import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';

// eslint-disable-next-line project-structure/independent-modules
import type { TimeFormValues } from '@/app/pages/time';

import { TimeInput } from './time-input';

export function TimeForm() {
   const { control } = useFormContext<TimeFormValues>();

   return (
      // demo-start
      <Controller
         name='time'
         control={control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel htmlFor='time'>Time:</FieldLabel>

               <TimeInput
                  id='time'
                  aria-invalid={fieldState.invalid}
                  {...field}
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
