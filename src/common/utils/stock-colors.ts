import type { Trade } from "@/modules/portfolio/entities/trade";

import { STOCK_COLOR_CLASSES, TRADE_SIDE_TEXT_CLASSES } from "../constants/chart-palette";

export function assignStockColors(symbols: string[]): Record<string, string> {
  return Object.fromEntries(
    symbols.map((symbol, index) => [symbol, STOCK_COLOR_CLASSES[index % STOCK_COLOR_CLASSES.length]]),
  );
}

export function tradeSideTextClass(trade: Pick<Trade, "side"> | null): string {
  return trade ? TRADE_SIDE_TEXT_CLASSES[trade.side] : "text-muted";
}
