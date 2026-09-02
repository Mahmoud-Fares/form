import { Controller, useFormContext } from 'react-hook-form';

import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from '@/shared/components/ui/field';

// eslint-disable-next-line project-structure/independent-modules
import type { TimeFormValues } from '@/app/pages/time';

import { TimeCombobox } from './time-combobox';
import { TimeInput } from './time-input';

export function TimeForm() {
   const { control } = useFormContext<TimeFormValues>();

   return (
      // demo-start
      <FieldGroup>
         <Controller
            name='time'
            control={control}
            render={({ field, fieldState }) => (
               <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Time:</FieldLabel>

                  <TimeInput
                     id={field.name}
                     aria-invalid={fieldState.invalid}
                     {...field}
                  />

                  {fieldState.invalid && (
                     <FieldError errors={[fieldState.error]} />
                  )}
               </Field>
            )}
         />

         <Controller
            name='time2'
            control={control}
            render={({ field, fieldState }) => (
               <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Time:</FieldLabel>

                  <TimeCombobox
                     id={field.name}
                     aria-invalid={fieldState.invalid}
                     {...field}
                  />

                  {fieldState.invalid && (
                     <FieldError errors={[fieldState.error]} />
                  )}
               </Field>
            )}
         />
      </FieldGroup>
      // demo-end
   );
}
