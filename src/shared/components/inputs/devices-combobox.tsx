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

type Device = {
   id: number;
   name: string;
};

type Props = Omit<
   ComponentProps<typeof Combobox<Device>>,
   | 'items'
   | 'value'
   | 'onValueChange'
   | 'itemToStringLabel'
   | 'itemToStringValue'
   | 'filter'
   | 'children'
> & {
   id?: string;
   ref?: Ref<HTMLInputElement>;
   name?: string;
   onBlur: () => void;
   'aria-invalid': boolean;
   placeholder?: string;
   triggerClassName?: string;
   value: string;
   onChange: (value: string) => void;
};

const devices = [
   { id: 1, name: 'Device 1' },
   { id: 2, name: 'Device 2' },
   { id: 3, name: 'Device 3' },
   { id: 4, name: 'Device 4' },
   { id: 5, name: 'Device 5' },
   { id: 6, name: 'Device 6' },
   { id: 7, name: 'Special Device 11' },
   { id: 8, name: 'Very Special Device 22' },
   { id: 9, name: 'Special Device 33' },
];

export function DevicesCombobox({
   id,
   ref,
   name,
   onBlur,
   'aria-invalid': ariaInvalid,
   placeholder,
   triggerClassName,
   value,
   onChange,
   ...props
}: Props) {
   const selectedDevice = value
      ? (devices.find((d) => d.id === Number(value)) ?? null)
      : null;

   return (
      <Combobox
         items={devices}
         value={selectedDevice}
         onValueChange={(device) => onChange(device ? String(device.id) : '')}
         itemToStringLabel={(device) => device.name}
         itemToStringValue={(device) => device.name}
         filter={(device, query) =>
            !query ||
            device.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
         }
         {...props}
      >
         <ComboboxInput
            ref={ref}
            id={id}
            name={name}
            onBlur={onBlur}
            showClear={!!value}
            aria-invalid={ariaInvalid}
            placeholder={placeholder ?? 'Select a Device'}
            className={cn(triggerClassName)}
         />

         <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>

            <ComboboxList>
               {(device: Device) => (
                  <ComboboxItem key={device.id} value={device}>
                     {device.name}
                  </ComboboxItem>
               )}
            </ComboboxList>
         </ComboboxContent>
      </Combobox>
   );
}
