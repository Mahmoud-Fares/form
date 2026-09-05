import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';

// eslint-disable-next-line project-structure/independent-modules
import type { DeviceFormValues } from '@/app/pages/special-combobox';

import { DevicesCombobox } from './devices-combobox';

export function DevicesComboboxField() {
   const { control } = useFormContext<DeviceFormValues>();

   return (
      <Controller
         name='device_id'
         control={control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel htmlFor={field.name}>Device:</FieldLabel>

               <DevicesCombobox
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  {...field}
               />

               {fieldState.invalid && (
                  <FieldError
                     errors={[fieldState.error]}
                     className='col-span-2'
                  />
               )}
            </Field>
         )}
      />
   );
}
