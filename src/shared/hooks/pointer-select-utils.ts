import type { Weekday } from '@/shared/lib/utils/schedule-utils';
import type { WeekSchedules } from '@/shared/schema/schedule';

export type Point = {
   x: number;
   y: number;
};

export type Rect = {
   x: number;
   y: number;
   w: number;
   h: number;
};

export type Bounds = {
   left: number;
   top: number;
   right: number;
   bottom: number;
};

export const DRAG_THRESHOLD_PX = 4;

export function cellKey(day: Weekday, time: string) {
   return `${day}:${time}`;
}

export function parseCellKey(
   key: string
): { day: Weekday; time: string } | null {
   const separatorIndex = key.indexOf(':');

   if (separatorIndex === -1) return null;

   return {
      day: key.slice(0, separatorIndex) as Weekday,
      time: key.slice(separatorIndex + 1),
   };
}

export function getAreaPointerPosition(
   area: HTMLElement,
   event: PointerEvent
): Point {
   const areaRect = area.getBoundingClientRect();

   return {
      x: event.clientX - areaRect.left + area.scrollLeft,
      y: event.clientY - areaRect.top + area.scrollTop,
   };
}

export function normalizeRect(start: Point, end: Point): Rect {
   const x = Math.min(start.x, end.x);
   const y = Math.min(start.y, end.y);

   return {
      x,
      y,
      w: Math.abs(end.x - start.x),
      h: Math.abs(end.y - start.y),
   };
}

export function rectToBounds(rect: Rect): Bounds {
   return {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.w,
      bottom: rect.y + rect.h,
   };
}

export function getElementBoundsInArea(
   element: HTMLElement,
   area: HTMLElement
): Bounds {
   const areaRect = area.getBoundingClientRect();
   const elementRect = element.getBoundingClientRect();

   return {
      left: elementRect.left - areaRect.left + area.scrollLeft,
      top: elementRect.top - areaRect.top + area.scrollTop,
      right: elementRect.right - areaRect.left + area.scrollLeft,
      bottom: elementRect.bottom - areaRect.top + area.scrollTop,
   };
}

/** Axis-aligned bounding box intersection (same model as legacy DragSelect). */
export function boundsIntersect(a: Bounds, b: Bounds) {
   return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
   );
}

export function getCellKeyFromElement(cell: HTMLElement): string | null {
   const day = cell.dataset.day;
   const time = cell.dataset.time;

   if (!day || !time) return null;

   return cellKey(day as Weekday, time);
}

export function getAllCellKeys(container: HTMLElement): Set<string> {
   const keys = new Set<string>();

   container.querySelectorAll<HTMLElement>('.item').forEach((cell) => {
      const key = getCellKeyFromElement(cell);

      if (key) keys.add(key);
   });

   return keys;
}

export function getCellKeysFromElements(
   cells: Iterable<HTMLElement>
): Set<string> {
   const keys = new Set<string>();

   for (const cell of cells) {
      const key = getCellKeyFromElement(cell);

      if (key) keys.add(key);
   }

   return keys;
}

/**
 * Mirrors legacy DragSelect paint/erase with revert when cells leave the selector.
 * - paintMode: add cells inside the rectangle
 * - eraseMode: remove cells inside the rectangle
 * - outside the rectangle: undo changes made during this drag (restore prev state)
 */
export function computePaintEraseSelection(
   prevSelected: Set<string>,
   paintMode: boolean,
   currentKeys: Set<string>,
   cellsInRect: Set<string>,
   allCellKeys: Set<string>
): Set<string> {
   const next = new Set(currentKeys);

   for (const key of allCellKeys) {
      const inRect = cellsInRect.has(key);
      const isSelected = next.has(key);
      const wasSelected = prevSelected.has(key);

      if (inRect) {
         if (paintMode) next.add(key);
         else next.delete(key);
         continue;
      }

      if (isSelected && !wasSelected) {
         next.delete(key);
      } else if (!isSelected && wasSelected) {
         next.add(key);
      }
   }

   return next;
}

export function getCellsInRect(
   container: HTMLElement,
   area: HTMLElement,
   rect: Rect
): HTMLElement[] {
   const selectorBounds = rectToBounds(rect);
   const cells = container.querySelectorAll<HTMLElement>('.item');

   return Array.from(cells).filter((cell) =>
      boundsIntersect(selectorBounds, getElementBoundsInArea(cell, area))
   );
}

export function scheduleKeys(schedules: WeekSchedules): Set<string> {
   const keys = new Set<string>();

   for (const [day, times] of Object.entries(schedules)) {
      for (const time of times) {
         keys.add(cellKey(day as Weekday, time));
      }
   }

   return keys;
}

export function schedulesFromKeys(keys: Iterable<string>): WeekSchedules {
   const schedules: WeekSchedules = {};

   for (const key of keys) {
      const parsed = parseCellKey(key);

      if (!parsed) continue;

      const daySlots = schedules[parsed.day] ?? [];

      if (!daySlots.includes(parsed.time)) {
         schedules[parsed.day] = [...daySlots, parsed.time];
      }
   }

   for (const [day, times] of Object.entries(schedules)) {
      schedules[day as Weekday] = [...times].sort();
   }

   return schedules;
}

export function syncCellSelectionClasses(
   container: HTMLElement,
   selectedKeys: Set<string>
) {
   container.querySelectorAll<HTMLElement>('.item').forEach((cell) => {
      const day = cell.dataset.day;
      const time = cell.dataset.time;

      if (!day || !time) return;

      cell.classList.toggle(
         'ds-selected',
         selectedKeys.has(cellKey(day as Weekday, time))
      );
   });
}
