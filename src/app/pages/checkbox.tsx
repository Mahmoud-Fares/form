import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { CheckboxInput } from '@/shared/components/inputs/checkbox-input';
import CheckboxInputCode from '@/shared/components/inputs/checkbox-input.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';

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

const checkboxInputSchema = z.object({
   checkbox: z.boolean(),
   tasks: z
      .array(z.string())
      .min(1, 'Please select at least one notification type.')
      .refine(
         (value) => value.every((task) => tasks.some((t) => t.id === task)),
         {
            message: 'Invalid notification type selected.',
         }
      ),
});

export type CheckboxFormValues = z.infer<typeof checkboxInputSchema>;

export default function CheckboxPage() {
   const form = useForm<CheckboxFormValues>({
      resolver: zodResolver(checkboxInputSchema),
      defaultValues: {
         checkbox: false,
         tasks: [],
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form} schema={checkboxInputSchema}>
            <CheckboxInput />
         </FormWrapper>

         <h3 className='leading-none font-semibold'>Single Variant 1</h3>
         <CodeBlock
            code={extractSnippet(
               CheckboxInputCode,
               '{/* // demo-1 start */}',
               '{/* // demo-1 end */}'
            )}
            language='tsx'
         />

         <h3 className='leading-none font-semibold'>Single Variant 2</h3>
         <CodeBlock
            code={extractSnippet(
               CheckboxInputCode,
               '{/* // demo-2 start */}',
               '{/* // demo-2 end */}'
            )}
            language='tsx'
         />

         <h3 className='leading-none font-semibold'>Single Variant 3</h3>
         <CodeBlock
            code={extractSnippet(
               CheckboxInputCode,
               '{/* // demo-3 start */}',
               '{/* // demo-3 end */}'
            )}
            language='tsx'
         />

         <h3 className='leading-none font-semibold'>Multi/Group</h3>
         <CodeBlock
            code={extractSnippet(
               CheckboxInputCode,
               '{/* // demo-4 start */}',
               '{/* // demo-4 end */}'
            )}
            language='tsx'
         />
      </PageWrapper>
   );
}
