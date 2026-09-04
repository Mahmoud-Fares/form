import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { MultiTabsForm } from '@/shared/components/inputs/multi-tabs-form';
import MultiTabsFormCode from '@/shared/components/inputs/multi-tabs-form.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';
import {
   type MultiTabsFormValues,
   multiTabsFormSchema,
} from '@/shared/schema/multi-tabs';

export default function MultiTabs() {
   const form = useForm<MultiTabsFormValues>({
      resolver: zodResolver(multiTabsFormSchema),
      defaultValues: {
         input1: '',
         input2: '',
         input3: '',
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form}>
            <MultiTabsForm />
         </FormWrapper>

         <CodeBlock code={extractSnippet(MultiTabsFormCode)} language='tsx' />
      </PageWrapper>
   );
}
