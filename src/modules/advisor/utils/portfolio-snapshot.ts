import type { PortfolioOverview, PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";

import { roundToFractionDigits } from "@/common/utils/rounding";

import { ADVICE_SNAPSHOT_FRACTION_DIGITS } from "../constants/advisor-model";
import type { PortfolioSnapshot, SnapshotOrder } from "../entities/portfolio-snapshot";

function snapshotOrderOf({ trade }: PositionOverview): SnapshotOrder {
  if (!trade) return "none";
  return trade.closesPosition ? "sell-all" : trade.side;
}

export function toPortfolioSnapshot(overview: PortfolioOverview): PortfolioSnapshot {
  return {
    positions: overview.positions.map((position) => ({
      symbol: position.symbol,
      name: position.name,
      currentPercentage: roundToFractionDigits(position.currentPercentage, ADVICE_SNAPSHOT_FRACTION_DIGITS),
      targetPercentage: roundToFractionDigits(position.targetPercentage, ADVICE_SNAPSHOT_FRACTION_DIGITS),
      order: snapshotOrderOf(position),
    })),
  };
}

export function portfolioSnapshotKey(overview: PortfolioOverview): string {
  return JSON.stringify(toPortfolioSnapshot(overview));
}
