import * as React from 'react';

import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';

type Props = {
   value?: Date;
   onChange?: (date: Date | undefined) => void;
   placeholder?: string;
   disabled?: boolean;
   triggerClassName?: string;
   dateFormat?: string;
   defaultMonth?: Date;
};

export function DateInput({
   value,
   onChange,
   placeholder = 'Select date',
   disabled = false,
   triggerClassName,
   dateFormat = 'PPP',
   defaultMonth,
}: Props) {
   const [open, setOpen] = React.useState(false);

   const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      setOpen(false);
   };

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant='outline'
               disabled={disabled}
               className={cn('justify-between font-normal', triggerClassName)}
            >
               {value ? (
                  format(value, dateFormat)
               ) : (
                  <span className='text-muted-foreground'> {placeholder}</span>
               )}
               <ChevronDownIcon />
            </Button>
         </PopoverTrigger>

         <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
               mode='single'
               selected={value}
               captionLayout='dropdown'
               defaultMonth={defaultMonth ?? value}
               onSelect={handleSelect}
               disabled={disabled}
            />
         </PopoverContent>
      </Popover>
   );
}
