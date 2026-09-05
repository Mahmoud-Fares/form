import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CodeBlock } from '@/shared/components/code-block';
import { FormWrapper } from '@/shared/components/form-wrapper';
import { Header } from '@/shared/components/header';
import { DevicesComboboxField } from '@/shared/components/inputs/devices-combobox-field';
import DevicesComboboxFieldCode from '@/shared/components/inputs/devices-combobox-field.tsx?raw';
import DevicesComboboxCode from '@/shared/components/inputs/devices-combobox.tsx?raw';
import { PageWrapper } from '@/shared/components/page-wrapper';
import { extractSnippet } from '@/shared/lib/utils/extract-snippet';

const deviceSchema = z.object({
   device_id: z.string().min(1, 'Device is required'),
});

export type DeviceFormValues = z.infer<typeof deviceSchema>;

export default function SpecialComboboxPage() {
   const form = useForm<DeviceFormValues>({
      resolver: zodResolver(deviceSchema),
      defaultValues: {
         device_id: '',
      },
   });

   return (
      <PageWrapper>
         <FormWrapper form={form}>
            <DevicesComboboxField />
         </FormWrapper>

         <Header>Usage example</Header>
         <CodeBlock
            code={extractSnippet(DevicesComboboxFieldCode)}
            language='tsx'
         />

         <Header>Devices Combobox</Header>
         <CodeBlock code={extractSnippet(DevicesComboboxCode)} language='tsx' />
      </PageWrapper>
   );
}
