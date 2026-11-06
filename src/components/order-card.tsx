import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { describeOrder } from "@/common/utils/describe-order";
import { formatRank, formatShares, formatUsd } from "@/common/utils/format";
import { tradeSideTextClass } from "@/common/utils/stock-colors";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";
import type { Trade, TradeSide } from "@/modules/portfolio/entities/trade";

export type RankedOrder = {
  rank: number;
  position: PositionOverview;
  trade: Trade;
  colorClass: string;
};

type OrderCardProps = {
  order: RankedOrder;
  locale: Locale;
  copy: Dictionary["orders"];
};

const SIDE_BORDER_CLASSES: Record<TradeSide, string> = {
  buy: "border-l-buy",
  sell: "border-l-sell",
};

export function OrderCard({ order, locale, copy }: OrderCardProps) {
  const { rank, position, trade, colorClass } = order;

  return (
    <li
      className={`raised flex items-center gap-4 border border-l-4 border-line bg-surface p-4 text-ui transition duration-150 hover:-translate-y-px ${SIDE_BORDER_CLASSES[trade.side]}`}
    >
      <span className="text-faint tabular-nums">{formatRank(rank)}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-1 text-ink">
        <p className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-3 font-semibold">
            <span aria-hidden className={`size-2.5 shrink-0 ${colorClass}`} />
            {position.symbol}
          </span>
          <span className="font-medium tabular-nums">{formatUsd(trade.amount, locale)}</span>
        </p>
        <p className="flex items-center justify-between gap-3 pl-5.5">
          <span className="min-w-0 truncate text-muted">{position.name}</span>
          <span className={`shrink-0 tabular-nums ${tradeSideTextClass(trade)}`}>
            {describeOrder(trade, copy)} {formatShares(trade.shares, locale)} {copy.shareUnit}
          </span>
        </p>
      </div>
    </li>
  );
}
