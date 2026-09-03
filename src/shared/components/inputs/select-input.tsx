import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/shared/components/ui/select';

// eslint-disable-next-line project-structure/independent-modules
import type { SelectFormValues } from '@/app/pages/select';

const steps = [
   '> 5s',
   '> 10s',
   '> 15s',
   '> 30s',
   '> 1min',
   '> 2min',
   '> 3min',
   '> 4min',
   '> 5min',
   '> 10min',
   '> 15min',
   '> 20min',
   '> 30min',
   '> 1h',
   '> 2h',
   '> 3h',
];

export function SelectInput() {
   const { control } = useFormContext<SelectFormValues>();

   return (
      // demo-start
      <Controller
         name='select'
         control={control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel htmlFor={field.name}>Select a Step:</FieldLabel>

               <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                     id={field.name}
                     aria-invalid={fieldState.invalid}
                  >
                     <SelectValue placeholder='Step' />
                  </SelectTrigger>

                  <SelectContent
                     alignItemWithTrigger={false}
                     className='max-h-64'
                  >
                     <SelectGroup>
                        {steps.map((step) => (
                           <SelectItem key={step} value={step}>
                              {step}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>

               {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
               )}
            </Field>
         )}
      />
      // demo-end
   );
}
