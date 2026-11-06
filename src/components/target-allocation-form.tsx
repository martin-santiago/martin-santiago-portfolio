"use client";

import { useActionState, useState } from "react";

import { chooseExampleTargetAllocation } from "@/app/actions/choose-example-target-allocation";
import { saveTargetAllocation } from "@/app/actions/save-target-allocation";
import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { formatPercentage } from "@/common/utils/format";
import { roundToFractionDigits } from "@/common/utils/rounding";
import { FULL_ALLOCATION_PERCENTAGE } from "@/modules/portfolio/constants/rebalance";
import { TARGET_PERCENTAGE_FRACTION_DIGITS } from "@/modules/portfolio/constants/target-allocation";
import type { SaveTargetAllocationDto } from "@/modules/portfolio/dtos/save-target-allocation.dto";
import type { TargetAllocationStock } from "@/modules/portfolio/dtos/target-allocation-form.dto";
import { isFullAllocation } from "@/modules/portfolio/utils/target-allocation";
import { sum } from "@/modules/portfolio/utils/totals";

import { InfoTip } from "./info-tip";
import { TargetAllocationRow } from "./target-allocation-row";

type TargetAllocationFormProps = {
  stocks: TargetAllocationStock[];
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["targetEditor"];
  infoCopy: Dictionary["info"];
};

const USE_EXAMPLE_FORM_ID = "use-example-target";

function describeTotal(totalPercentage: number, locale: Locale, copy: Dictionary["targetEditor"]): string {
  if (isFullAllocation(totalPercentage)) return copy.complete;
  const percentageGap = formatPercentage(
    Math.abs(FULL_ALLOCATION_PERCENTAGE - totalPercentage),
    locale,
    TARGET_PERCENTAGE_FRACTION_DIGITS,
  );
  const template = totalPercentage < FULL_ALLOCATION_PERCENTAGE ? copy.missing : copy.excess;
  return template.replace("{percentage}", percentageGap);
}

export function TargetAllocationForm({ stocks, colorClassBySymbol, locale, copy, infoCopy }: TargetAllocationFormProps) {
  const [percentageBySymbol, setPercentageBySymbol] = useState<Record<string, string>>(() =>
    Object.fromEntries(stocks.map(({ symbol, targetPercentage }) => [symbol, String(targetPercentage)])),
  );
  const [saveResult, saveAllocation, isSaving] = useActionState<SaveTargetAllocationDto | null, FormData>(
    saveTargetAllocation.bind(null, locale),
    null,
  );

  const totalPercentage = roundToFractionDigits(
    sum(Object.values(percentageBySymbol).map(Number).filter(Number.isFinite)),
    TARGET_PERCENTAGE_FRACTION_DIGITS,
  );
  const isComplete = isFullAllocation(totalPercentage);

  const handlePercentageChange = (symbol: string, percentage: string) =>
    setPercentageBySymbol((currentPercentages) => ({ ...currentPercentages, [symbol]: percentage }));

  return (
    <>
      <form action={saveAllocation} className="mt-10 flex max-w-3xl flex-col gap-4">
        <div className="flex gap-4 px-4 text-label text-faint uppercase">
          <span className="flex-1 pl-6.5">{copy.stock}</span>
          <span className="w-24 text-right whitespace-nowrap">
            {copy.example}
            <InfoTip id="target-editor-example-info" label={`${infoCopy.label}: ${copy.example}`} text={infoCopy.example} />
          </span>
          <span className="w-32 text-right whitespace-nowrap">
            {copy.target}
            <InfoTip id="target-editor-your-target-info" label={`${infoCopy.label}: ${copy.target}`} text={infoCopy.yourTarget} />
          </span>
        </div>
        <ul className="flex flex-col gap-1">
          {stocks.map((stock) => (
            <TargetAllocationRow
              key={stock.symbol}
              stock={stock}
              colorClass={colorClassBySymbol[stock.symbol]}
              percentage={percentageBySymbol[stock.symbol]}
              locale={locale}
              onPercentageChange={handlePercentageChange}
            />
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p aria-live="polite" className={`text-ui ${isComplete ? "text-buy" : "text-sell"}`}>
            <span className="font-medium tabular-nums">
              {copy.total} {formatPercentage(totalPercentage, locale, TARGET_PERCENTAGE_FRACTION_DIGITS)}.
            </span>{" "}
            {describeTotal(totalPercentage, locale, copy)}
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="submit" form={USE_EXAMPLE_FORM_ID} className="button-secondary">
              {copy.useExample}
            </button>
            <button type="submit" disabled={!isComplete || isSaving} className="button-primary">
              {isSaving ? copy.saving : copy.save}
            </button>
          </div>
        </div>
        {saveResult?.status === "invalid" && <p className="text-ui text-sell">{copy.invalid}</p>}
      </form>
      <form id={USE_EXAMPLE_FORM_ID} action={chooseExampleTargetAllocation.bind(null, locale)} hidden />
    </>
  );
}
