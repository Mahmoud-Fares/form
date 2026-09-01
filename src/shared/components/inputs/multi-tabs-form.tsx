import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from '@/shared/components/ui/tabs';
import type { MultiTabsFormValues } from '@/shared/schema/multi-tabs';

export function MultiTabsForm() {
   const { control } = useFormContext<MultiTabsFormValues>();

   return (
      <Tabs defaultValue='tab-1'>
         <TabsList>
            <TabsTrigger value='tab-1'>Tab-1</TabsTrigger>
            <TabsTrigger value='tab-2'>Tab-2</TabsTrigger>
            <TabsTrigger value='tab-3'>Tab-3</TabsTrigger>
         </TabsList>

         <TabsContent value='tab-1' className='min-h-25 rounded-md border p-3'>
            <Controller
               name='input1'
               control={control}
               render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                     <FieldLabel htmlFor={field.name}>Input 1</FieldLabel>

                     <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder='Enter your input value'
                     />

                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
         </TabsContent>

         <TabsContent value='tab-2' className='min-h-25 rounded-md border p-3'>
            <Controller
               name='input2'
               control={control}
               render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                     <FieldLabel htmlFor={field.name}>Input 2</FieldLabel>

                     <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder='Enter your input value'
                     />

                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
         </TabsContent>

         <TabsContent value='tab-3' className='min-h-25 rounded-md border p-3'>
            <Controller
               name='input3'
               control={control}
               render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                     <FieldLabel htmlFor={field.name}>Input 3</FieldLabel>

                     <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder='Enter your input value'
                     />

                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
         </TabsContent>
      </Tabs>
   );
}
