import {
   type RefObject,
   useCallback,
   useEffect,
   useRef,
   useState,
} from 'react';

import type { WeekSchedules } from '@/shared/schema/schedule';

import {
   DRAG_THRESHOLD_PX,
   type Point,
   type Rect,
   computePaintEraseSelection,
   getAllCellKeys,
   getAreaPointerPosition,
   getCellKeyFromElement,
   getCellKeysFromElements,
   getCellsInRect,
   normalizeRect,
   scheduleKeys,
   schedulesFromKeys,
   syncCellSelectionClasses,
} from './pointer-select-utils';

type Options = {
   enabled: boolean;
   schedules: WeekSchedules;
   areaRef: RefObject<HTMLElement | null>;
   onSelectionChange: (schedules: WeekSchedules) => void;
};

function isSelectableCell(
   target: EventTarget | null
): target is HTMLTableCellElement {
   return (
      target instanceof HTMLTableCellElement &&
      target.classList.contains('item')
   );
}

function distanceBetween(a: Point, b: Point) {
   return Math.hypot(b.x - a.x, b.y - a.y);
}

function applyLegacyStartCellToggle(
   prevSelectedKeys: Set<string>,
   startCellKey: string,
   paintMode: boolean
) {
   const currentKeys = new Set(prevSelectedKeys);

   if (paintMode) currentKeys.add(startCellKey);
   else currentKeys.delete(startCellKey);

   return currentKeys;
}

export function useWeekTimePointerSelect({
   enabled,
   schedules,
   areaRef,
   onSelectionChange,
}: Options) {
   const containerRef = useRef<HTMLTableElement>(null);
   const onSelectionChangeRef = useRef(onSelectionChange);
   const schedulesRef = useRef(schedules);
   const isInteractingRef = useRef(false);

   const dragStateRef = useRef<{
      pointerId: number; // to ignore other simultaneous pointers, e.g. multi-touch
      startPoint: Point;
      startCellKey: string;
      prevSelectedKeys: Set<string>;
      allCellKeys: Set<string>;
      paintMode: boolean;
      currentKeys: Set<string>;
      hasMoved: boolean;
   } | null>(null);

   const [selectorRect, setSelectorRect] = useState<Rect | null>(null);

   useEffect(() => {
      onSelectionChangeRef.current = onSelectionChange;
   }, [onSelectionChange]);

   useEffect(() => {
      schedulesRef.current = schedules;
   }, [schedules]);

   const applyPreviewSelection = useCallback((keys: Set<string>) => {
      const container = containerRef.current;

      if (!container) return;

      syncCellSelectionClasses(container, keys);
   }, []);

   const finishInteraction = useCallback((nextKeys: Set<string>) => {
      isInteractingRef.current = false;
      dragStateRef.current = null;
      setSelectorRect(null);
      onSelectionChangeRef.current(schedulesFromKeys(nextKeys));
   }, []);

   useEffect(() => {
      const area = areaRef.current;
      const container = containerRef.current;

      if (!enabled || !area || !container) {
         return;
      }

      const handlePointerDown = (event: PointerEvent) => {
         if (event.button !== 0 || !isSelectableCell(event.target)) return;

         const startCellKey = getCellKeyFromElement(event.target);

         if (!startCellKey) return;

         const startPoint = getAreaPointerPosition(area, event);
         const prevSelectedKeys = scheduleKeys(schedulesRef.current);
         const paintMode = !prevSelectedKeys.has(startCellKey);
         const currentKeys = applyLegacyStartCellToggle(
            prevSelectedKeys,
            startCellKey,
            paintMode
         );

         dragStateRef.current = {
            pointerId: event.pointerId,
            startPoint,
            startCellKey,
            prevSelectedKeys,
            allCellKeys: getAllCellKeys(container),
            paintMode,
            currentKeys,
            hasMoved: false,
         };

         isInteractingRef.current = true;
         area.setPointerCapture(event.pointerId);
         event.preventDefault();
      };

      const handlePointerMove = (event: PointerEvent) => {
         const dragState = dragStateRef.current;

         if (dragState?.pointerId !== event.pointerId) return;

         const currentPoint = getAreaPointerPosition(area, event);

         if (
            !dragState.hasMoved &&
            distanceBetween(dragState.startPoint, currentPoint) >=
               DRAG_THRESHOLD_PX
         ) {
            dragState.hasMoved = true;
            applyPreviewSelection(dragState.currentKeys);
         }

         if (!dragState.hasMoved) return;

         const rect = normalizeRect(dragState.startPoint, currentPoint);
         setSelectorRect(rect);

         const cellsInRect = getCellKeysFromElements(
            getCellsInRect(container, area, rect)
         );

         dragState.currentKeys = computePaintEraseSelection(
            dragState.prevSelectedKeys,
            dragState.paintMode,
            dragState.currentKeys,
            cellsInRect,
            dragState.allCellKeys
         );

         applyPreviewSelection(dragState.currentKeys);
      };

      const handlePointerEnd = (event: PointerEvent) => {
         const dragState = dragStateRef.current;

         if (dragState?.pointerId !== event.pointerId) return;

         if (area.hasPointerCapture(event.pointerId)) {
            area.releasePointerCapture(event.pointerId);
         }

         if (!dragState.hasMoved) {
            const nextKeys = new Set(dragState.prevSelectedKeys);

            if (nextKeys.has(dragState.startCellKey)) {
               nextKeys.delete(dragState.startCellKey);
            } else {
               nextKeys.add(dragState.startCellKey);
            }

            finishInteraction(nextKeys);
            return;
         }

         finishInteraction(dragState.currentKeys);
      };

      area.addEventListener('pointerdown', handlePointerDown);
      area.addEventListener('pointermove', handlePointerMove);
      area.addEventListener('pointerup', handlePointerEnd);
      area.addEventListener('pointercancel', handlePointerEnd);

      return () => {
         area.removeEventListener('pointerdown', handlePointerDown);
         area.removeEventListener('pointermove', handlePointerMove);
         area.removeEventListener('pointerup', handlePointerEnd);
         area.removeEventListener('pointercancel', handlePointerEnd);
      };
   }, [applyPreviewSelection, areaRef, enabled, finishInteraction]);

   useEffect(() => {
      const container = containerRef.current;

      if (!enabled || !container || isInteractingRef.current) return;

      syncCellSelectionClasses(container, scheduleKeys(schedules));
   }, [enabled, schedules]);

   return {
      containerRef,
      selectorRect,
   };
}
