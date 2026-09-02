import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

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
   value: DateRange | undefined;
   onChange: (date: DateRange | undefined) => void;
   placeholder?: string;
   disabled?: boolean;
   triggerClassName?: string;
   dateFormat?: string;
   defaultMonth?: Date;
   'aria-invalid': boolean;
};

export function DateRangeInput({
   id,
   value,
   onChange,
   placeholder = 'Pick a date range',
   disabled = false,
   triggerClassName,
   dateFormat = 'LLL dd, y',
   defaultMonth,
   'aria-invalid': ariaInvalid,
}: Props) {
   return (
      <Popover>
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

               {value?.from ? (
                  value.to ? (
                     <>
                        {format(value.from, dateFormat)} -{' '}
                        {format(value.to, dateFormat)}
                     </>
                  ) : (
                     format(value.from, dateFormat)
                  )
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
               mode='range'
               selected={value}
               onSelect={onChange}
               defaultMonth={defaultMonth ?? value?.from}
               captionLayout='dropdown'
               disabled={disabled}
               numberOfMonths={2}
            />
         </PopoverContent>
      </Popover>
   );
}
