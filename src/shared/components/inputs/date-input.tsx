import * as React from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';

type Props = {
   id: string;
   value: Date | undefined;
   onChange: (date: Date | undefined) => void;
   'aria-invalid': boolean;
   placeholder?: string;
   disabled?: boolean;
   triggerClassName?: string;
   dateFormat?: string;
   defaultMonth?: Date;
};

export function DateInput({
   id,
   value,
   onChange,
   placeholder = 'Select date',
   disabled = false,
   triggerClassName,
   dateFormat = 'PPP',
   defaultMonth,
   'aria-invalid': ariaInvalid,
}: Props) {
   const [open, setOpen] = React.useState(false);

   const handleSelect = (date: Date | undefined) => {
      onChange(date);
      setOpen(false);
   };

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               id={id}
               variant='outline'
               disabled={disabled}
               className={cn('justify-start font-normal', triggerClassName)}
               aria-invalid={ariaInvalid}
            >
               <CalendarIcon
                  data-icon='inline-start'
                  className={cn(
                     !value && 'text-muted-foreground',
                     ariaInvalid && 'text-destructive'
                  )}
               />

               {value ? (
                  format(value, dateFormat)
               ) : (
                  <span
                     className={cn(
                        'text-muted-foreground',
                        ariaInvalid && 'text-destructive'
                     )}
                  >
                     {' '}
                     {placeholder}
                  </span>
               )}
            </Button>
         </PopoverTrigger>

         <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
               mode='single'
               selected={value}
               onSelect={handleSelect}
               defaultMonth={defaultMonth ?? value}
               captionLayout='dropdown'
               disabled={disabled}
            />
         </PopoverContent>
      </Popover>
   );
}
