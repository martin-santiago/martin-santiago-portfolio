"use client";

import { type MouseEvent, type PointerEvent, useId, useRef } from "react";

import { isMousePointer } from "@/common/utils/pointer";

export type AllocationSegment = {
  symbol: string;
  name: string;
  percentage: number;
  percentageLabel: string;
  colorClass: string;
};

type AllocationStackSegmentProps = {
  segment: AllocationSegment;
  showsSymbol: boolean;
};

export function AllocationStackSegment({ segment, showsSymbol }: AllocationStackSegmentProps) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const anchorName = `--segment-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (isMousePointer(event)) tooltipRef.current?.togglePopover(true);
  };
  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (isMousePointer(event)) tooltipRef.current?.togglePopover(false);
  };
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isMousePointer(event)) tooltipRef.current?.togglePopover(true);
  };

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      style={{ flexGrow: segment.percentage, anchorName }}
      className={`${segment.colorClass} flex basis-0 items-end overflow-hidden px-1.5 pb-1 text-label font-medium text-ink/80 transition-opacity duration-150 hover:opacity-85`}
    >
      {showsSymbol && <span className="hidden sm:inline">{segment.symbol}</span>}
      <span ref={tooltipRef} popover="auto" style={{ positionAnchor: anchorName }} className="info-popover pointer-events-none">
        <span className="font-medium">{segment.name}</span> <span className="text-muted">{segment.percentageLabel}</span>
      </span>
    </div>
  );
}
