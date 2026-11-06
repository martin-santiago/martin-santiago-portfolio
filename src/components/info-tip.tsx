"use client";

import { type FocusEvent, type MouseEvent, type PointerEvent, useRef } from "react";

import { isMousePointer } from "@/common/utils/pointer";

type InfoTipProps = {
  id: string;
  label: string;
  text: string;
};

export function InfoTip({ id, label, text }: InfoTipProps) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const anchorName = `--${id}`;

  const handleShow = () => tooltipRef.current?.togglePopover(true);
  const handleHide = () => tooltipRef.current?.togglePopover(false);
  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (isMousePointer(event)) handleShow();
  };
  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    if (isMousePointer(event)) handleHide();
  };
  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    if (event.currentTarget.matches(":focus-visible")) handleShow();
  };
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isMousePointer(event)) event.preventDefault();
  };

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        popoverTarget={id}
        style={{ anchorName }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={handleHide}
        onClick={handleClick}
        className="ml-1.5 inline-flex size-4 cursor-help items-center justify-center border border-line-strong align-middle text-label leading-none font-medium text-faint normal-case transition-colors duration-150 hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
      >
        i
      </button>
      <span
        ref={tooltipRef}
        id={id}
        role="tooltip"
        popover="auto"
        style={{ positionAnchor: anchorName }}
        className="info-popover pointer-events-none"
      >
        {text}
      </span>
    </>
  );
}
