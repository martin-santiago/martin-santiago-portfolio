import type { ReactNode } from "react";

import { formatRank } from "@/common/utils/format";

type CalculationStepProps = {
  rank: number;
  title: string;
  description: string;
  formula: string;
  result: ReactNode;
  note?: string;
};

export function CalculationStep({ rank, title, description, formula, result, note }: CalculationStepProps) {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 gap-y-2 p-4 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-x-6">
      <span className="text-faint tabular-nums">{formatRank(rank)}</span>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-ink">{title}</p>
        <p className="text-muted">{description}</p>
      </div>
      <div className="col-start-2 flex flex-col gap-1 tabular-nums sm:col-start-auto sm:items-end sm:text-right">
        <p className="text-muted">
          {formula} = <span className="font-medium whitespace-nowrap">{result}</span>
        </p>
        {note && <p className="text-label text-muted">{note}</p>}
      </div>
    </li>
  );
}
