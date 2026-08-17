import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { FormWrapper } from '@/shared/components/form-wrapper';
import { TextInput } from '@/shared/components/inputs/text-input';
import { PageWrapper } from '@/shared/components/page-wrapper';

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

export default function TextPage() {
   const form = useForm<z.infer<typeof textInputSchema>>({
      resolver: zodResolver(textInputSchema),
      defaultValues: {
         username: '',
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form} schema={textInputSchema}>
            <TextInput />
         </FormWrapper>
      </PageWrapper>
   );
}
