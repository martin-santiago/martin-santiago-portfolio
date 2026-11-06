"use client";

import { useState } from "react";

import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { describeOrder } from "@/common/utils/describe-order";
import { formatPercentage, formatShares, formatSignedUsd, formatUsd } from "@/common/utils/format";
import { tradeSideTextClass } from "@/common/utils/stock-colors";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";

import { CalculationStep } from "./calculation-step";

type CalculationWalkthroughProps = {
  positions: PositionOverview[];
  totalValue: number;
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["calculation"];
  orderLabels: Pick<Dictionary["orders"], "buy" | "sell" | "sellAll" | "shareUnit">;
};

const SELECTOR_LABEL_ID = "calculation-selector-label";

function largestGapPosition(positions: PositionOverview[]): PositionOverview {
  return positions.reduce((largest, position) =>
    Math.abs(position.valueGap) > Math.abs(largest.valueGap) ? position : largest,
  );
}

function gapNote(position: PositionOverview, copy: Dictionary["calculation"]): string {
  if (!position.trade) return copy.onTarget;
  return position.trade.side === "sell" ? copy.excess : copy.shortfall;
}

export function CalculationWalkthrough({
  positions,
  totalValue,
  colorClassBySymbol,
  locale,
  copy,
  orderLabels,
}: CalculationWalkthroughProps) {
  const [selectedSymbol, setSelectedSymbol] = useState(() => largestGapPosition(positions).symbol);
  const position = positions.find(({ symbol }) => symbol === selectedSymbol) ?? positions[0];
  const { trade } = position;
  const sideClass = tradeSideTextClass(trade);

  return (
    <div id="calculation-walkthrough" className="flex flex-col gap-4 text-ui">
      <div role="group" aria-labelledby={SELECTOR_LABEL_ID} className="flex flex-wrap items-center gap-1">
        <span id={SELECTOR_LABEL_ID} className="mr-2 text-muted">
          {copy.selectorLabel}
        </span>
        {positions.map(({ symbol }) => (
          <button
            key={symbol}
            type="button"
            aria-pressed={symbol === position.symbol}
            onClick={() => setSelectedSymbol(symbol)}
            className="flex h-7 items-center gap-1.5 px-2 text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-2 focus-visible:outline-ink aria-pressed:bg-track aria-pressed:font-medium aria-pressed:text-ink"
          >
            <span aria-hidden className={`size-2 ${colorClassBySymbol[symbol]}`} />
            {symbol}
          </button>
        ))}
      </div>
      <div className="raised border border-line bg-surface">
        <p className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span aria-hidden className={`size-2.5 shrink-0 ${colorClassBySymbol[position.symbol]}`} />
          <span className="font-semibold">{position.symbol}</span>
          <span className="truncate text-muted">{position.name}</span>
        </p>
        <ol className="divide-y divide-line">
          <CalculationStep
            rank={1}
            title={copy.totalStep}
            description={copy.totalStepDescription}
            formula={copy.totalFormula}
            result={formatUsd(totalValue, locale)}
          />
          <CalculationStep
            rank={2}
            title={copy.targetStep}
            description={copy.targetStepDescription}
            formula={`${formatUsd(totalValue, locale)} × ${formatPercentage(position.targetPercentage, locale)}`}
            result={formatUsd(position.targetValue, locale)}
          />
          <CalculationStep
            rank={3}
            title={copy.gapStep}
            description={copy.gapStepDescription}
            formula={`${formatUsd(position.targetValue, locale)} − ${formatUsd(position.value, locale)}`}
            result={<span className={sideClass}>{formatSignedUsd(position.valueGap, locale)}</span>}
            note={gapNote(position, copy)}
          />
          <CalculationStep
            rank={4}
            title={copy.sharesStep}
            description={copy.sharesStepDescription}
            formula={`${formatUsd(Math.abs(position.valueGap), locale)} ÷ ${formatUsd(position.price, locale)}`}
            result={
              <span className={sideClass}>
                {trade
                  ? `${describeOrder(trade, orderLabels)} ${formatShares(trade.shares, locale)} ${orderLabels.shareUnit}`
                  : `0 ${orderLabels.shareUnit}`}
              </span>
            }
          />
        </ol>
      </div>
    </div>
  );
}
