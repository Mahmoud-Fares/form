import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { TextInput } from '@/shared/components/inputs/text-input';
import TextInputCode from '@/shared/components/inputs/text-input.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';

const textInputSchema = z.object({
   username: z
      .string()
      .min(3, 'Username must be at least 3 characters.')
      .max(10, 'Username must be at most 10 characters.')
      .regex(
         /^[a-zA-Z0-9_]+$/,
         'Username can only contain letters, numbers, and underscores.'
      ),
});

export type TextFormValues = z.infer<typeof textInputSchema>;

export default function TextPage() {
   const form = useForm<TextFormValues>({
      resolver: zodResolver(textInputSchema),
      defaultValues: {
         username: '',
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form}>
            <TextInput />
         </FormWrapper>

         <CodeBlock code={extractSnippet(TextInputCode)} language='tsx' />
      </PageWrapper>
   );
}
