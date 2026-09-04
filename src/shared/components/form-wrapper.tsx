import { useId } from 'react';

import { Home } from 'lucide-react';
import {
   type FieldValues,
   FormProvider,
   type UseFormReturn,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

type Props<TFieldValues extends FieldValues> = {
   form: UseFormReturn<TFieldValues>;
   children: React.ReactNode;
};

export function FormWrapper<TFieldValues extends FieldValues>({
   children,
   form,
}: Props<TFieldValues>) {
   function onSubmit(data: TFieldValues) {
      toast('You submitted the following values:', {
         description: (
            <pre className='bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4'>
               <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
         ),
      });
   }

   const id = useId();
   const navigate = useNavigate();

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
                  onClick={() => navigate('/')}
               >
                  <Home />
               </Button>
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
