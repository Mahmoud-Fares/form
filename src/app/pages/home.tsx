import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';

import { TextInput } from '@/shared/components/inputs/text-input';
import { Button } from '@/shared/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/shared/components/ui/card';
import { Field, FieldGroup } from '@/shared/components/ui/field';
import { FormDemoProvider } from '@/shared/context/form';
import { formSchema } from '@/shared/schema';

export default function Home() {
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         username: '',
      },
   });

   function onSubmit(data: z.infer<typeof formSchema>) {
      toast('You submitted the following values:', {
         description: (
            <pre className='bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4'>
               <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
         ),
      });
   }
   return (
      <div className='flex h-screen w-full flex-col items-center justify-center'>
         <Card className='w-full sm:max-w-4xl'>
            <CardHeader>
               <CardTitle>Form Demo</CardTitle>
               <CardDescription>Edit and test the form below.</CardDescription>
            </CardHeader>

            <CardContent>
               <form id='form-id' onSubmit={form.handleSubmit(onSubmit)}>
                  <FormDemoProvider form={form}>
                     <FieldGroup>
                        <TextInput />
                     </FieldGroup>
                  </FormDemoProvider>
               </form>
            </CardContent>

            <CardFooter>
               <Field orientation='horizontal'>
                  <Button
                     type='button'
                     variant='outline'
                     onClick={() => form.reset()}
                  >
                     Reset
                  </Button>
                  <Button type='submit' form='form-id'>
                     Save
                  </Button>
               </Field>
            </CardFooter>
         </Card>
      </div>
   );
}
