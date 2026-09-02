import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { Header } from '@/shared/components/header';
import { TimeForm } from '@/shared/components/inputs/time-form';
import TimeFormCode from '@/shared/components/inputs/time-form.tsx?raw';
import TimeInputCode from '@/shared/components/inputs/time-input.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';

/**
 * z.iso.time()               // precision: null (default) -> seconds required, fractional part optional, any length
 * z.iso.time({ precision: 0 }) // precision: 0 (no fractional part) -> seconds required, no fractional part allowed
 * z.iso.time({ precision: 3 }) // precision: 3 (3 fractional digits) -> seconds required, exactly 3 fractional digits (milliseconds)
 *
 * null --> Accepts [14:30:00, 14:30:00.5, 14:30:00.123456], Rejects [14:30]
 * 0 --> Accepts [14:30:00], Rejects [14:30:00.1, 14:30]
 * 3 --> Accepts [14:30:00.123], Rejects [14:30:00, 14:30:00.1, 14:30:00.1234]
 *
 * step omitted / step="60" → "HH:mm" format
 * z.iso.time() CANNOT be used here at all — it always requires seconds.
 * You'd need z.string().regex(/^\d{2}:\d{2}$/) instead.
 */

const timeSchema = z.object({
   time: z
      .string()
      .min(1, 'Time is required')
      // precision must match TimeInput's step='1' → "HH:mm:ss"
      // use the step you want, then ask claude for the precision you need
      .pipe(z.iso.time({ precision: 0, error: 'Invalid time' })),
});

export type TimeFormValues = z.infer<typeof timeSchema>;

export default function TimePage() {
   const form = useForm<TimeFormValues>({
      resolver: zodResolver(timeSchema),
      defaultValues: {
         time: '12:00:00',
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form} schema={timeSchema}>
            <TimeForm />
         </FormWrapper>

         <Header>Usage example</Header>
         <CodeBlock code={extractSnippet(TimeFormCode)} language='tsx' />

         <Header>Time Input</Header>
         <CodeBlock code={extractSnippet(TimeInputCode)} language='tsx' />
      </PageWrapper>
   );
}
