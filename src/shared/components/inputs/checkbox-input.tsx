import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/shared/components/ui/checkbox';
import {
   Field,
   FieldContent,
   FieldDescription,
   FieldError,
   FieldGroup,
   FieldLabel,
   FieldLegend,
   FieldSeparator,
   FieldSet,
   FieldTitle,
} from '@/shared/components/ui/field';

// eslint-disable-next-line project-structure/independent-modules
import type { CheckboxFormValues } from '@/app/pages/checkbox';

const tasks = [
   {
      id: 'push',
      label: 'Push notifications',
   },
   {
      id: 'email',
      label: 'Email notifications',
   },
] as const;

export function CheckboxInput() {
   const { control } = useFormContext<CheckboxFormValues>();

   return (
      <FieldGroup>
         {/* // demo-1 start */}
         <Controller
            name='checkbox'
            control={control}
            render={({ field, fieldState }) => (
               <Field
                  orientation='horizontal'
                  data-invalid={fieldState.invalid}
               >
                  <Checkbox
                     id={field.name}
                     checked={field.value}
                     onCheckedChange={field.onChange}
                     aria-invalid={fieldState.invalid}
                  />

                  <FieldLabel htmlFor={field.name}>
                     Accept terms and conditions
                  </FieldLabel>
               </Field>
            )}
         />
         {/* // demo-1 end */}

         {/* // demo-2 start */}
         <Controller
            name='checkbox'
            control={control}
            render={({ field, fieldState }) => (
               <Field
                  orientation='horizontal'
                  data-invalid={fieldState.invalid}
               >
                  <Checkbox
                     id={field.name}
                     checked={field.value}
                     onCheckedChange={field.onChange}
                     aria-invalid={fieldState.invalid}
                  />

                  <FieldContent>
                     <FieldLabel htmlFor={field.name}>
                        Accept terms and conditions
                     </FieldLabel>
                     <FieldDescription>
                        By clicking this checkbox, you agree to the terms.
                     </FieldDescription>
                  </FieldContent>
               </Field>
            )}
         />
         {/* // demo-2 end */}

         {/* // demo-3 start */}
         <Controller
            name='checkbox'
            control={control}
            render={({ field, fieldState }) => (
               <FieldLabel>
                  <Field
                     orientation='horizontal'
                     data-invalid={fieldState.invalid}
                  >
                     <Checkbox
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                     />

                     <FieldContent>
                        <FieldTitle>Accept terms and conditions</FieldTitle>
                        <FieldDescription>
                           By clicking this checkbox, you agree to the terms.
                        </FieldDescription>
                     </FieldContent>
                  </Field>
               </FieldLabel>
            )}
         />
         {/* // demo-3 end */}

         <FieldSeparator />

         {/* // demo-4 start */}
         <Controller
            name='tasks'
            control={control}
            render={({ field, fieldState }) => (
               <FieldSet>
                  <FieldLegend variant='label'>Tasks</FieldLegend>
                  <FieldDescription>
                     Get notified when tasks you&apos;ve created have updates.
                  </FieldDescription>

                  <FieldGroup data-slot='checkbox-group'>
                     {tasks.map((task) => (
                        <Field
                           key={task.id}
                           orientation='horizontal'
                           data-invalid={fieldState.invalid}
                        >
                           <Checkbox
                              id={`checkbox-${task.id}`}
                              aria-invalid={fieldState.invalid}
                              checked={field.value.includes(task.id)}
                              onCheckedChange={(checked) => {
                                 const newValue = checked
                                    ? [...field.value, task.id]
                                    : field.value.filter(
                                         (value) => value !== task.id
                                      );
                                 field.onChange(newValue);
                              }}
                           />

                           <FieldLabel
                              htmlFor={`checkbox-${task.id}`}
                              className='font-normal'
                           >
                              {task.label}
                           </FieldLabel>
                        </Field>
                     ))}
                  </FieldGroup>

                  {fieldState.invalid && (
                     <FieldError errors={[fieldState.error]} />
                  )}
               </FieldSet>
            )}
         />
         {/* // demo-4 end */}
      </FieldGroup>
   );
}
