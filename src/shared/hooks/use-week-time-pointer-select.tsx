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

// Only cells with the .item class are drag targets -- guards against the
// weekday-letter <th> buttons or header cells being picked up by the
// pointerdown handler.
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

// On pointerdown, the cell under the cursor is toggled immediately, even
// before any drag movement happens. This mirrors the old DragSelect
// library's behavior (hence "legacy") so a plain click still works exactly
// like clicking a single checkbox, independent of the drag logic below.
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

type Props = {
   enabled: boolean;
   schedules: WeekSchedules;
   areaRef: RefObject<HTMLElement | null>;
   onSelectionChange: (schedules: WeekSchedules) => void;
};

export function useWeekTimePointerSelect({
   enabled,
   schedules,
   areaRef,
   onSelectionChange,
}: Props) {
   const containerRef = useRef<HTMLTableElement>(null);

   // Wrapped in a ref so the pointerdown/move/up listeners (attached once
   // in the effect below) always call the latest callback without needing
   // to be re-attached every time the parent passes a new function
   // reference.
   const onSelectionChangeRef = useRef(onSelectionChange);

   // Same reasoning: lets event handlers read the latest schedules prop
   // without forcing the listener-setup effect to re-run on every
   // schedules change.
   const schedulesRef = useRef(schedules);

   // Tells the "sync from props" effect (bottom of file) to back off while
   // a drag is actively in progress, so an external schedules update
   // doesn't stomp on the live DOM classes mid-drag.
   const isInteractingRef = useRef(false);

   // Everything about the current drag lives in a ref, not state, because
   // it's mutated continuously on pointermove and should never itself
   // trigger a React re-render -- only selectorRect (below) does that.
   const dragStateRef = useRef<{
      pointerId: number;
      startPoint: Point;
      startCellKey: string;
      prevSelectedKeys: Set<string>;
      allCellKeys: Set<string>;
      paintMode: boolean;
      currentKeys: Set<string>;
      hasMoved: boolean;
   } | null>(null);

   // The ONE piece of drag state that does live in React state, because
   // it drives the visual overlay rectangle (a single small div) -- cheap
   // enough to re-render on every move, unlike the full cell grid.
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

   // Called once when a drag/click ends. This is the only point where the
   // internal Set representation is converted back into WeekSchedules and
   // handed to the parent -- i.e. the only point that triggers a React
   // re-render of the actual schedules prop.
   const finishInteraction = useCallback((nextKeys: Set<string>) => {
      isInteractingRef.current = false;
      dragStateRef.current = null;
      setSelectorRect(null);
      onSelectionChangeRef.current(schedulesFromKeys(nextKeys));
   }, []);

   // Attaches raw pointer event listeners directly to the scroll container
   // (not via React's onPointerDown props) so we get full control over
   // pointer capture and can keep drag state out of React entirely.
   useEffect(() => {
      const area = areaRef.current;
      const container = containerRef.current;

      if (!enabled || !area || !container) return;

      const handlePointerDown = (event: PointerEvent) => {
         // button !== 0 excludes right/middle click; only left-click drags.
         if (event.button !== 0 || !isSelectableCell(event.target)) return;

         const startCellKey = getCellKeyFromElement(event.target);

         if (!startCellKey) return;

         const startPoint = getAreaPointerPosition(area, event);
         const prevSelectedKeys = scheduleKeys(schedulesRef.current);
         // Clicking an empty cell starts a "paint" (add) drag; clicking an
         // already-selected cell starts an "erase" (remove) drag.
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
         // Pointer capture ensures we keep receiving move/up events for
         // this pointer even if it moves outside the grid's bounds.
         area.setPointerCapture(event.pointerId);
         event.preventDefault();
      };

      const handlePointerMove = (event: PointerEvent) => {
         const dragState = dragStateRef.current;

         // Ignore move events from any pointer other than the one that
         // started this drag (relevant for multi-touch devices).
         if (dragState?.pointerId !== event.pointerId) return;

         const currentPoint = getAreaPointerPosition(area, event);

         // Nothing visual happens until the pointer has moved past the
         // drag threshold -- this is what separates "click" from "drag".
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

         // Recompute the full live selection (paint/erase + revert-on-leave)
         // for this frame -- see computePaintEraseSelection for the rules.
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

         // Pointer never moved past the threshold -> treat as a plain
         // click: toggle only the start cell, computed fresh against
         // prevSelectedKeys rather than trusting dragState.currentKeys.
         if (!dragState.hasMoved) {
            const nextKeys = new Set(dragState.prevSelectedKeys);

            if (nextKeys.has(dragState.startCellKey))
               nextKeys.delete(dragState.startCellKey);
            else nextKeys.add(dragState.startCellKey);

            finishInteraction(nextKeys);
            return;
         }

         // Real drag happened -> commit whatever the live preview
         // currently shows.
         finishInteraction(dragState.currentKeys);
      };

      area.addEventListener('pointerdown', handlePointerDown);
      area.addEventListener('pointermove', handlePointerMove);
      area.addEventListener('pointerup', handlePointerEnd);
      // pointercancel handles interruptions (e.g. browser gesture takeover,
      // alt-tab) the same way as a normal pointerup, so a drag never gets
      // stuck half-applied.
      area.addEventListener('pointercancel', handlePointerEnd);

      return () => {
         area.removeEventListener('pointerdown', handlePointerDown);
         area.removeEventListener('pointermove', handlePointerMove);
         area.removeEventListener('pointerup', handlePointerEnd);
         area.removeEventListener('pointercancel', handlePointerEnd);
      };
   }, [applyPreviewSelection, areaRef, enabled, finishInteraction]);

   // Keeps the DOM classes in sync when `schedules` changes from OUTSIDE
   // this hook (e.g. parent applies a preset, resets the form, or loads
   // new data) -- but only when no drag is currently running, so it
   // doesn't fight the live pointermove updates above.
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
