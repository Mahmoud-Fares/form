import { useRef } from 'react';

import { Button } from '@/shared/components/ui/button';
import { useWeekTimePointerSelect } from '@/shared/hooks/use-week-time-pointer-select';
import { cn } from '@/shared/lib/utils';
import {
   type SchedulePreset,
   WEEKDAY_LABELS,
   getOrderedWeekdays,
   getTimeHeaderChunks,
   getTimeSlots,
   isSlotSelected,
} from '@/shared/lib/utils/schedule-utils';
import type { WeekSchedules } from '@/shared/schema/schedule';

import './week-time-grid.css';

type Props = {
   schedules: WeekSchedules;
   enabled: boolean;
   weekStartDay?: number;
   use12Hour?: boolean;
   invalid?: boolean;
   onSchedulesChange: (schedules: WeekSchedules) => void;
   onPreset: (preset: SchedulePreset) => void;
};

export function WeekTimeGrid({
   schedules,
   enabled,
   weekStartDay = 1,
   use12Hour = false,
   invalid = false,
   onSchedulesChange,
   onPreset,
}: Props) {
   const areaRef = useRef<HTMLDivElement>(null);

   const timeSlots = getTimeSlots(use12Hour);
   const headerChunks = getTimeHeaderChunks(timeSlots);
   const orderedWeekdays = getOrderedWeekdays(weekStartDay);

   const { containerRef, selectorRect } = useWeekTimePointerSelect({
      enabled,
      schedules,
      areaRef,
      onSelectionChange: onSchedulesChange,
   });

   return (
      <div className='space-y-3'>
         <div
            ref={areaRef}
            className='week-time-grid-scroll overflow-x-auto rounded-md border'
         >
            {selectorRect ? (
               <div
                  className='week-time-selector'
                  style={{
                     left: selectorRect.x,
                     top: selectorRect.y,
                     width: selectorRect.w,
                     height: selectorRect.h,
                  }}
               />
            ) : null}

            <table
               ref={containerRef}
               id='weektime-selectarea'
               className={cn(
                  'week-time-grid table-weektime',
                  !enabled && 'disabled',
                  invalid && 'ring-destructive/40 ring-1'
               )}
            >
               <thead>
                  <tr>
                     <th aria-hidden='true' />
                     {headerChunks.map((chunk) => (
                        // the CSS span 12 must stay in sync with the chunk size of 12
                        // the colSpan is only for the screen readers and accessibility, but the CSS span 12 has the highest priority
                        <th key={chunk[0].id} colSpan={chunk.length}>
                           <span>{chunk[0].label}</span>
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody>
                  {orderedWeekdays.map((day) => (
                     <tr key={day}>
                        <th>
                           <Button
                              type='button'
                              variant='outline'
                              size='icon-sm'
                              className='size-8'
                              title={WEEKDAY_LABELS[day]}
                              disabled={!enabled}
                              onClick={() => onPreset(day)}
                           >
                              {WEEKDAY_LABELS[day].charAt(0).toUpperCase()}
                           </Button>
                        </th>
                        {timeSlots.map((slot, index) => {
                           const selected = isSlotSelected(
                              schedules,
                              day,
                              slot.id
                           );

                           return (
                              <td
                                 key={`${day}-${slot.id}`}
                                 data-day={day}
                                 data-time={slot.id}
                                 className={cn(
                                    'item',
                                    selected && 'ds-selected',
                                    index % 4 === 0 && 'hour',
                                    index % 12 === 0 && 'quarter'
                                 )}
                              >
                                 <input
                                    type='checkbox'
                                    className='hidden'
                                    name={`schedules[${day}][]`}
                                    value={slot.id}
                                    checked={selected}
                                    readOnly
                                    tabIndex={-1}
                                    aria-hidden='true'
                                 />
                              </td>
                           );
                        })}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className='flex flex-wrap justify-end gap-2'>
            <Button
               type='button'
               variant='outline'
               size='sm'
               disabled={!enabled}
               onClick={() => onPreset('workdays')}
            >
               Workdays
            </Button>

            <Button
               type='button'
               variant='outline'
               size='sm'
               disabled={!enabled}
               onClick={() => onPreset('weekend')}
            >
               Weekend
            </Button>

            <Button
               type='button'
               variant='outline'
               size='sm'
               disabled={!enabled}
               onClick={() => onPreset('always')}
            >
               Always
            </Button>
         </div>
      </div>
   );
}
