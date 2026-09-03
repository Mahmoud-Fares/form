import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { SelectInput } from '@/shared/components/inputs/select-input';
import SelectInputCode from '@/shared/components/inputs/select-input.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';

const selectInputSchema = z.object({
   select: z.string().min(1, 'This field is required.'),
});

export type SelectFormValues = z.infer<typeof selectInputSchema>;

export default function SelectPage() {
   const form = useForm<SelectFormValues>({
      resolver: zodResolver(selectInputSchema),
      defaultValues: {
         select: '',
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form} schema={selectInputSchema}>
            <SelectInput />
         </FormWrapper>

         <CodeBlock code={extractSnippet(SelectInputCode)} language='tsx' />
      </PageWrapper>
   );
}
