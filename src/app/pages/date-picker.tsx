import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { Header } from '@/shared/components/header';
import DateInputCode from '@/shared/components/inputs/date-input.tsx?raw';
import { DatePickerInput } from '@/shared/components/inputs/date-picker-input';
import DatePickerInputCode from '@/shared/components/inputs/date-picker-input.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';

const datePickerSchema = z.object({
   date: z.date({ error: 'Date is required' }),
});

export type DatePickerFormValues = z.infer<typeof datePickerSchema>;

export default function DatePickerPage() {
   const form = useForm<DatePickerFormValues>({
      resolver: zodResolver(datePickerSchema),
      defaultValues: {
         date: undefined,
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form} schema={datePickerSchema}>
            <DatePickerInput />
         </FormWrapper>

         <Header>Date Picker Input (Usage example)</Header>
         <CodeBlock code={extractSnippet(DatePickerInputCode)} language='tsx' />

         <Header>Date Input</Header>
         <CodeBlock code={extractSnippet(DateInputCode)} language='tsx' />
      </PageWrapper>
   );
}
