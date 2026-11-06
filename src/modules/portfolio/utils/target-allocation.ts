import { ALLOCATION_TOLERANCE_PERCENTAGE, FULL_ALLOCATION_PERCENTAGE } from "../constants/rebalance";
import { TARGET_FIELD_PREFIX } from "../constants/target-allocation";
import type { PortfolioPosition } from "../entities/portfolio-position";
import type { TargetAllocation } from "../entities/target-allocation";

type AllocatedSymbol = Pick<PortfolioPosition, "symbol" | "targetPercentage">;

export function targetFieldName(symbol: string): string {
  return `${TARGET_FIELD_PREFIX}${symbol}`;
}

export function isFullAllocation(totalPercentage: number): boolean {
  return Math.abs(totalPercentage - FULL_ALLOCATION_PERCENTAGE) <= ALLOCATION_TOLERANCE_PERCENTAGE;
}

export function targetAllocationKey(allocatedSymbols: AllocatedSymbol[]): string {
  return allocatedSymbols.map(({ symbol, targetPercentage }) => `${symbol}:${targetPercentage}`).join();
}

export function applyTargetAllocation(
  positions: PortfolioPosition[],
  customAllocation: TargetAllocation | null,
): PortfolioPosition[] {
  if (!customAllocation) return positions;
  return positions.map((position) => ({ ...position, targetPercentage: customAllocation[position.symbol] ?? 0 }));
}
