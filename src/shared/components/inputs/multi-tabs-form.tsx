import { DotIcon } from 'lucide-react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from '@/shared/components/ui/tabs';
import { type MultiTabsFormValues } from '@/shared/schema/multi-tabs';

const TABS = [
   {
      label: 'Tab-1',
      value: 'tab-1',
      inputs: [
         {
            name: 'input1',
            label: 'Input 1',
         },
      ],
   },
   {
      label: 'Tab-2',
      value: 'tab-2',
      inputs: [
         {
            name: 'input2',
            label: 'Input 2',
         },
      ],
   },
   {
      label: 'Tab-3',
      value: 'tab-3',
      inputs: [
         {
            name: 'input3',
            label: 'Input 3',
         },
      ],
   },
] as const;

const fieldToTab = Object.fromEntries(
   TABS.flatMap((tab) => tab.inputs.map((input) => [input.name, tab.value]))
) as Record<keyof MultiTabsFormValues, (typeof TABS)[number]['value']>;

export function MultiTabsForm() {
   const { control } = useFormContext<MultiTabsFormValues>();
   const { errors } = useFormState({ control });

   const tabsWithErrors = new Set(
      Object.keys(errors).map(
         (field) => fieldToTab[field as keyof MultiTabsFormValues]
      )
   );

   const doesTabHaveErrors = (tab: (typeof TABS)[number]['value']) =>
      tabsWithErrors.has(tab);

   return (
      <Tabs defaultValue={TABS[0].value}>
         <TabsList>
            {TABS.map((tab) => (
               <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}

                  {doesTabHaveErrors(tab.value) && (
                     <DotIcon className='size-2.5 rounded-full bg-red-600 text-transparent' />
                  )}
               </TabsTrigger>
            ))}
         </TabsList>

         {TABS.map((tab) => (
            <TabsContent
               key={tab.value}
               value={tab.value}
               className='min-h-25 rounded-md border p-3'
            >
               {tab.inputs.map((input) => (
                  <Controller
                     key={input.name}
                     name={input.name}
                     control={control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel htmlFor={field.name}>
                              {input.label}
                           </FieldLabel>

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
               ))}
            </TabsContent>
         ))}
      </Tabs>
   );
}
