import { TRADE_SIDE_TEXT_CLASSES } from "@/common/constants/chart-palette";
import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { describeOrder } from "@/common/utils/describe-order";
import { formatShares, formatSignedUsd, formatUsd } from "@/common/utils/format";
import { tradeSideTextClass } from "@/common/utils/stock-colors";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";
import { totalTradeAmount, tradesOf, tradesOnSide } from "@/modules/portfolio/utils/totals";

type CalculationTableProps = {
  positions: PositionOverview[];
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["calculation"];
  orderCopy: Dictionary["orders"];
};

const HEADER_CELL_CLASSES = "px-4 pb-1 text-right font-medium whitespace-nowrap";
const ROW_CELL_CLASSES = "h-11 border-y border-line bg-surface px-4 text-right tabular-nums";

export function CalculationTable({ positions, colorClassBySymbol, locale, copy, orderCopy }: CalculationTableProps) {
  const trades = tradesOf(positions);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-3xl border-separate border-spacing-y-1 text-ui">
        <caption className="sr-only">{copy.tableCaption}</caption>
        <thead className="text-label text-faint uppercase">
          <tr>
            <th scope="col" className={`${HEADER_CELL_CLASSES} text-left`}>{copy.stock}</th>
            <th scope="col" className={HEADER_CELL_CLASSES}>{copy.currentValue}</th>
            <th scope="col" className={HEADER_CELL_CLASSES}>{copy.targetValue}</th>
            <th scope="col" className={HEADER_CELL_CLASSES}>{copy.gap}</th>
            <th scope="col" className={HEADER_CELL_CLASSES}>÷ {copy.price}</th>
            <th scope="col" className={HEADER_CELL_CLASSES}>{copy.order}</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(({ symbol, value, targetValue, valueGap, price, trade }) => (
            <tr key={symbol}>
              <th scope="row" className={`${ROW_CELL_CLASSES} border-l text-left font-semibold`}>
                <span className="flex items-center gap-3">
                  <span aria-hidden className={`size-2.5 shrink-0 ${colorClassBySymbol[symbol]}`} />
                  {symbol}
                </span>
              </th>
              <td className={ROW_CELL_CLASSES}>{formatUsd(value, locale)}</td>
              <td className={ROW_CELL_CLASSES}>{formatUsd(targetValue, locale)}</td>
              <td className={`${ROW_CELL_CLASSES} font-medium ${tradeSideTextClass(trade)}`}>{formatSignedUsd(valueGap, locale)}</td>
              <td className={`${ROW_CELL_CLASSES} text-muted`}>{formatUsd(price, locale)}</td>
              <td className={`${ROW_CELL_CLASSES} border-r ${tradeSideTextClass(trade)}`}>
                {trade ? `${describeOrder(trade, orderCopy)} ${formatShares(trade.shares, locale)} ${orderCopy.shareUnit}` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6} className="px-4 pt-3 text-right tabular-nums">
              {copy.sold} <span className={`font-medium ${TRADE_SIDE_TEXT_CLASSES.sell}`}>{formatUsd(totalTradeAmount(tradesOnSide(trades, "sell")), locale)}</span>{" "}
              = {copy.bought} <span className={`font-medium ${TRADE_SIDE_TEXT_CLASSES.buy}`}>{formatUsd(totalTradeAmount(tradesOnSide(trades, "buy")), locale)}</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
