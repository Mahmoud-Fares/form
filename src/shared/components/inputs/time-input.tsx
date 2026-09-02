import { Clock2Icon } from 'lucide-react';

import {
   InputGroup,
   InputGroupAddon,
   InputGroupInput,
} from '@/shared/components/ui/input-group';
import { cn } from '@/shared/lib/utils';

export function TimeInput({
   className,
   ...props
}: React.ComponentProps<typeof InputGroupInput>) {
   return (
      <InputGroup>
         <InputGroupInput
            type='time'
            step='1'
            className={cn(
               'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
               className
            )}
            {...props}
         />

         <InputGroupAddon>
            <Clock2Icon className='text-muted-foreground' />
         </InputGroupAddon>
      </InputGroup>
   );
}
