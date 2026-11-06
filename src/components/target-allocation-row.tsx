"use client";

import type { ChangeEvent } from "react";

import type { Locale } from "@/common/i18n/locales";
import { formatPercentage } from "@/common/utils/format";
import { MAX_TARGET_PERCENTAGE, TARGET_PERCENTAGE_FRACTION_DIGITS } from "@/modules/portfolio/constants/target-allocation";
import type { TargetAllocationStock } from "@/modules/portfolio/dtos/target-allocation-form.dto";
import { targetFieldName } from "@/modules/portfolio/utils/target-allocation";

type TargetAllocationRowProps = {
  stock: TargetAllocationStock;
  colorClass: string;
  percentage: string;
  locale: Locale;
  onPercentageChange: (symbol: string, percentage: string) => void;
};

export function TargetAllocationRow({ stock, colorClass, percentage, locale, onPercentageChange }: TargetAllocationRowProps) {
  const inputId = targetFieldName(stock.symbol);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onPercentageChange(stock.symbol, event.target.value);

  return (
    <li className="flex h-14 items-center gap-4 border border-line bg-surface px-4 text-ui">
      <span aria-hidden className={`size-2.5 shrink-0 ${colorClass}`} />
      <label htmlFor={inputId} className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="font-semibold">{stock.symbol}</span>
        <span className="truncate text-label text-muted">{stock.name}</span>
      </label>
      <span className="w-24 text-right text-faint tabular-nums">
        {formatPercentage(stock.exampleTargetPercentage, locale)}
      </span>
      <span className="flex w-32 items-center justify-end gap-1.5">
        <input
          id={inputId}
          name={inputId}
          type="number"
          inputMode="decimal"
          min={0}
          max={MAX_TARGET_PERCENTAGE}
          step={10 ** -TARGET_PERCENTAGE_FRACTION_DIGITS}
          value={percentage}
          onChange={handleChange}
          className="h-8 w-20 border border-line bg-page px-2 text-right tabular-nums focus-visible:outline-2 focus-visible:outline-ink"
        />
        <span className="text-muted">%</span>
      </span>
    </li>
  );
}
