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
   // The scrollable wrapper -- pointer coordinates and the drag rectangle
   // are both measured relative to this element (see pointer-select-utils).
   const areaRef = useRef<HTMLDivElement>(null);

   // 96 slots = 24h split into 15-minute increments.
   const timeSlots = getTimeSlots(use12Hour);
   // Groups the 96 slots into chunks of 12 (=3h) for the "00:00 03:00..."
   // header row. NOTE: the chunk size (12) is also hardcoded in the CSS
   // (`grid-column: span 12`) -- if this chunking changes, the CSS must
   // change too, or the header's visual span will silently stop matching
   // its actual colSpan.
   const headerChunks = getTimeHeaderChunks(timeSlots);
   const orderedWeekdays = getOrderedWeekdays(weekStartDay);

   // containerRef must land on the <table> itself (not a wrapping div) --
   // the CSS subgrid trick requires the table to be a direct grid
   // participant relative to its rows.
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
            {/* Floating rubber-band rectangle. Purely visual -- not part of
                the grid layout, positioned absolutely over it. Only exists
                while a drag is in progress (see useWeekTimePointerSelect). */}
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
                     {/* Empty corner cell above the weekday-letter column. */}
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
                           {/* Clicking a weekday letter applies that single
                               day as a preset (fills/clears the whole row) --
                               separate from the drag-select interaction. */}
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
                                 // data-day/data-time are the ONLY contract
                                 // the pointer-select hook relies on (via
                                 // getCellKeyFromElement) -- do not rename
                                 // or remove these without updating
                                 // pointer-select-utils.ts.
                                 data-day={day}
                                 data-time={slot.id}
                                 className={cn(
                                    // .item marks this cell as a valid drag
                                    // target/selectable cell -- also relied
                                    // on directly by the pointer-select hook.
                                    'item',
                                    selected && 'ds-selected',
                                    index % 4 === 0 && 'hour',
                                    index % 12 === 0 && 'quarter'
                                 )}
                              >
                                 {/* Hidden checkbox exists purely so this
                                     grid participates correctly in native
                                     <form> submission (name/value pairs);
                                     it is not used for interaction -- all
                                     clicking/dragging is handled by the
                                     pointer-select hook on the <td>/<table>,
                                     not by this input. */}
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
