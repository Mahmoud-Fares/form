import { Controller, useFormContext } from 'react-hook-form';

import {
   Field,
   FieldDescription,
   FieldError,
   FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

export function TextInput() {
   const form = useFormContext();

   return (
      // demo-start
      <Controller
         name='username'
         control={form.control}
         render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
               <FieldLabel htmlFor={field.name}>Username</FieldLabel>

               <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter your username'
                  autoComplete='username'
               />

               <FieldDescription>
                  This is your public display name. Must be between 3 and 10
                  characters. Must only contain letters, numbers, and
                  underscores.
               </FieldDescription>

               {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
               )}
            </Field>
         )}
      />
      // demo-end
   );
}
