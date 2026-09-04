import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { Header } from '@/shared/components/header';
import { DateRangeForm } from '@/shared/components/inputs/date-range-form';
import DateRangeFormCode from '@/shared/components/inputs/date-range-form.tsx?raw';
import DateRangeInputCode from '@/shared/components/inputs/date-range-input.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';

// matches the DateRange type from @base-ui/date-picker
const dateRangeSchema = z.object({
   range: z
      .object({
         from: z.union([z.date(), z.undefined()]), // required key, matches `from: Date | undefined`
         to: z.date().optional(), // optional key, matches `to?: Date | undefined`
      })
      .optional()
      .refine((range) => !!range?.from, {
         message: 'Range is required',
      }),
});

export type DateRangeFormValues = z.infer<typeof dateRangeSchema>;

export default function DateRangePage() {
   const form = useForm<DateRangeFormValues>({
      resolver: zodResolver(dateRangeSchema),
      defaultValues: {
         range: undefined,
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form}>
            <DateRangeForm />
         </FormWrapper>

         <Header>Usage example</Header>
         <CodeBlock code={extractSnippet(DateRangeFormCode)} language='tsx' />

         <Header>Date Range Input</Header>
         <CodeBlock code={extractSnippet(DateRangeInputCode)} language='tsx' />
      </PageWrapper>
   );
}
