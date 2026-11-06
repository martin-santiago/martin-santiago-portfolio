import type { ReactNode } from "react";

import { type AllocationSegment, AllocationStackSegment } from "./allocation-stack-segment";

type AllocationStackProps = {
  label: string;
  info: ReactNode;
  segments: AllocationSegment[];
};

const SEGMENT_LABEL_MIN_PERCENTAGE = 6;

export function AllocationStack({ label, info, segments }: AllocationStackProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
      <p className="w-28 shrink-0 text-label text-faint uppercase">
        {label}
        {info}
      </p>
      <div aria-hidden className="flex h-12 gap-0.5 sm:flex-1">
        {segments
          .filter(({ percentage }) => percentage > 0)
          .map((segment) => (
            <AllocationStackSegment
              key={segment.symbol}
              segment={segment}
              showsSymbol={segment.percentage >= SEGMENT_LABEL_MIN_PERCENTAGE}
            />
          ))}
      </div>
    </div>
  );
}
