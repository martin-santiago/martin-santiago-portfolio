import type { MouseEvent, PointerEvent } from "react";

export function isMousePointer(event: PointerEvent | MouseEvent): boolean {
  return "pointerType" in event.nativeEvent && event.nativeEvent.pointerType === "mouse";
}
