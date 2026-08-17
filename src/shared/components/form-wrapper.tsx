import { useId } from 'react';

import {
   type FieldValues,
   FormProvider,
   type UseFormReturn,
} from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';

import { Button } from '@/shared/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/shared/components/ui/card';
import { Field } from '@/shared/components/ui/field';

type Props<TSchema extends z.ZodType<FieldValues>> = {
   schema: TSchema;
   form: UseFormReturn<z.infer<TSchema>>;
   children: React.ReactNode;
};

export function FormWrapper<TSchema extends z.ZodType<FieldValues>>({
   children,
   form,
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   schema,
}: Props<TSchema>) {
   function onSubmit(data: z.infer<typeof schema>) {
      toast('You submitted the following values:', {
         description: (
            <pre className='bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4'>
               <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
         ),
      });
   }

   const id = useId();

   return (
      <Card className='w-full sm:max-w-4xl'>
         <CardHeader>
            <CardTitle>Form Demo</CardTitle>
            <CardDescription>Edit and test the form below.</CardDescription>
         </CardHeader>

         <CardContent>
            <form id={id} onSubmit={form.handleSubmit(onSubmit)}>
               <FormProvider {...form}>{children}</FormProvider>
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
               <Button type='submit' form={id}>
                  Save
               </Button>
            </Field>
         </CardFooter>
      </Card>
   );
}
