import type { Locale } from "@/common/i18n/locales";
import { formatPercentage, formatPercentagePoints, formatShares, formatUsd } from "@/common/utils/format";
import { tradeSideTextClass } from "@/common/utils/stock-colors";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";

import { DriftTrack } from "./drift-track";

type PositionRowProps = {
  position: PositionOverview;
  colorClass: string;
  scalePercentage: number;
  locale: Locale;
};

const ROW_CELL_CLASSES = "h-12 border-y border-line bg-surface px-4 transition-colors duration-150 group-hover:bg-track";

export function PositionRow({ position, colorClass, scalePercentage, locale }: PositionRowProps) {
  const side = position.trade?.side ?? null;

  return (
    <tr className="group">
      <th scope="row" className={`${ROW_CELL_CLASSES} border-l text-left font-normal`}>
        <span className="flex items-center gap-3">
          <span aria-hidden className={`size-2.5 shrink-0 ${colorClass}`} />
          <span className="flex flex-col leading-tight">
            <span className="font-semibold">{position.symbol}</span>
            <span className="text-label whitespace-nowrap text-muted">{position.name}</span>
          </span>
        </span>
      </th>
      <td className={`${ROW_CELL_CLASSES} text-right tabular-nums`}>{formatUsd(position.price, locale)}</td>
      <td className={`${ROW_CELL_CLASSES} text-right tabular-nums`}>{formatShares(position.shares, locale)}</td>
      <td className={`${ROW_CELL_CLASSES} text-right tabular-nums`}>{formatUsd(position.value, locale)}</td>
      <td className={`${ROW_CELL_CLASSES} text-right font-medium tabular-nums`}>
        {formatPercentage(position.currentPercentage, locale)}
      </td>
      <td className={`${ROW_CELL_CLASSES} text-right text-muted tabular-nums`}>
        {formatPercentage(position.targetPercentage, locale)}
      </td>
      <td className={`${ROW_CELL_CLASSES} text-right font-medium tabular-nums ${tradeSideTextClass(position.trade)}`}>
        {formatPercentagePoints(position.currentPercentage - position.targetPercentage, locale)}
      </td>
      <td className={`${ROW_CELL_CLASSES} border-r`}>
        <DriftTrack
          currentPercentage={position.currentPercentage}
          targetPercentage={position.targetPercentage}
          scalePercentage={scalePercentage}
          side={side}
        />
      </td>
    </tr>
  );
}
