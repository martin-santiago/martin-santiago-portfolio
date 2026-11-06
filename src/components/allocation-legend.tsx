import type { Locale } from "@/common/i18n/locales";
import { formatPercentage, formatRank } from "@/common/utils/format";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";

type AllocationLegendProps = {
  positions: PositionOverview[];
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
};

export function AllocationLegend({ positions, colorClassBySymbol, locale }: AllocationLegendProps) {
  return (
    <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
      {positions.map((position, index) => (
        <li key={position.symbol} className="flex h-9 items-center gap-3 border border-line bg-surface px-3 text-ui">
          <span className="text-faint tabular-nums">{formatRank(index + 1)}</span>
          <span aria-hidden className={`size-2.5 shrink-0 ${colorClassBySymbol[position.symbol]}`} />
          <span className="font-semibold">{position.symbol}</span>
          <span className="ml-auto text-muted tabular-nums">
            {formatPercentage(position.currentPercentage, locale)} →{" "}
            <span className="font-medium text-ink">{formatPercentage(position.targetPercentage, locale)}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
