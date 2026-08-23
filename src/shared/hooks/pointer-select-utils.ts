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

// Minimum pixel movement before a pointerdown is treated as a drag instead
// of a simple click. Without this, every click would register as a
// zero-size drag and could misfire the rectangle-selection logic.
export const DRAG_THRESHOLD_PX = 4;

// All selection state (WeekSchedules) is flattened into "day:time" string
// keys internally. This turns "is this cell selected" into a single Set
// lookup instead of nested object/array traversal, which matters because
// these checks run for every cell on every pointermove.
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

// Pointer coordinates from the browser are relative to the viewport.
// We need them relative to the scrollable grid container instead, and we
// have to add back the scroll offset -- otherwise the selection rectangle
// would jump/drift if the user scrolls the grid mid-drag.
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

// Pointer drags can go in any direction (up-left, down-right, etc).
// This converts two arbitrary points into a rectangle anchored at its
// top-left corner with positive width/height, so downstream intersection
// math doesn't need to handle negative sizes or direction.
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

// Same coordinate-space conversion as getAreaPointerPosition, but for an
// element's bounding box instead of a pointer event. Needed so a cell's
// position can be compared against the selection rectangle, which is also
// expressed relative to the scrollable area.
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

// Standard axis-aligned bounding box (AABB) overlap test: two rectangles
// intersect if each one starts before the other ends, on both axes.
// Named "legacy" in the codebase because it mirrors an older DragSelect
// library's intersection model -- kept for behavior parity.
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

// Used as the universe of possible keys for the paint/erase sweep below --
// we need to know about every cell (not just the ones under the rectangle)
// so cells that fall OUT of the rectangle can be reverted correctly.
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
 * Computes the live selection state while a drag is in progress.
 *
 * Two rules only, applied to EVERY cell on every pointermove:
 *
 *  1. Cell is currently under the rectangle -> force it to match the
 *     drag's mode (add if painting, remove if erasing).
 *
 *  2. Cell is NOT under the rectangle -> only touch it if its current
 *     state differs from its state before the drag started. If it
 *     differs, that difference can only be caused by this same drag
 *     (nothing else mutates selection mid-drag), so revert it back to
 *     prevSelected. If it matches prevSelected, leave it alone.
 *
 * Rule 2 is what gives "rubber-band undo" behavior: drag out over cells
 * to highlight them, then drag back over fewer cells and the ones no
 * longer covered un-highlight again -- without keeping any history log,
 * just by comparing current vs. pre-drag state.
 *
 * We sweep ALL cells (not just ones near the rectangle) because a cell
 * painted earlier in the drag can be arbitrarily far from the rectangle's
 * current position and still need to be reverted.
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

// Converts the internal flat Set (day:time) back into the WeekSchedules shape the
// parent component actually owns. Only called once, when an interaction
// finishes -- everything during the drag stays in Set form.
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

// Applies the live selection directly to the DOM via classList, bypassing
// React entirely. This runs on every pointermove across up to ~672 cells;
// doing it as React state would mean re-rendering the whole grid on every
// mouse-move event, which would be noticeably janky.
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
