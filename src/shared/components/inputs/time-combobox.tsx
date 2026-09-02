import type { ComponentProps, Ref } from 'react';

import {
   Combobox,
   ComboboxContent,
   ComboboxEmpty,
   ComboboxInput,
   ComboboxItem,
   ComboboxList,
} from '@/shared/components/ui/combobox';
import { cn } from '@/shared/lib/utils';

// Generate time options from 00:00 to 23:45 with 15-minute intervals
const generateTimeOptions = () => {
   const times = [];
   for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
         const hourStr = hour.toString().padStart(2, '0');
         const minuteStr = minute.toString().padStart(2, '0');
         times.push(`${hourStr}:${minuteStr}`);
      }
   }
   return times;
};

const timeOptions = generateTimeOptions();

type Props = Omit<
   ComponentProps<typeof Combobox<string>>,
   'items' | 'value' | 'onValueChange' | 'children'
> & {
   value?: string;
   onChange?: (value: string) => void;
   onBlur?: () => void;
   ref?: Ref<HTMLInputElement>;
   id?: string;
   name?: string;
   'aria-invalid'?: boolean;
   placeholder?: string;
   triggerClassName?: string;
};

export function TimeCombobox({
   value,
   onChange,
   onBlur,
   name,
   id,
   'aria-invalid': ariaInvalid,
   placeholder,
   triggerClassName,
   ref,
   ...props
}: Props) {
   return (
      <Combobox
         items={timeOptions}
         value={value ?? null}
         onValueChange={(newValue) => onChange?.(newValue ?? '')}
         {...props}
      >
         <ComboboxInput
            ref={ref}
            id={id}
            name={name}
            onBlur={onBlur}
            aria-invalid={ariaInvalid}
            placeholder={placeholder ?? 'Select a time'}
            showClear={!!value}
            className={cn(triggerClassName ?? 'w-24')}
         />

         <ComboboxContent>
            <ComboboxEmpty>No time found.</ComboboxEmpty>

            <ComboboxList>
               {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                     {item}
                  </ComboboxItem>
               )}
            </ComboboxList>
         </ComboboxContent>
      </Combobox>
   );
}
