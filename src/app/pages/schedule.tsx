import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { ScheduleInput } from '@/shared/components/inputs/schedule-input';
import ScheduleInputCode from '@/shared/components/inputs/schedule-input/index.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';
import {
   type ScheduleFormValues,
   scheduleInputSchema,
} from '@/shared/schema/schedule';

export default function SchedulePage() {
   const form = useForm<ScheduleFormValues>({
      resolver: zodResolver(scheduleInputSchema),
      defaultValues: {
         is_schedule_active: false,
         schedules: {},
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form} schema={scheduleInputSchema}>
            <ScheduleInput />
         </FormWrapper>

         <CodeBlock code={extractSnippet(ScheduleInputCode)} language='tsx' />
      </PageWrapper>
   );
}
