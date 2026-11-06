import type { Trade, TradeSide } from "../entities/trade";

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function tradesOf(positions: { trade: Trade | null }[]): Trade[] {
  return positions.flatMap(({ trade }) => (trade ? [trade] : []));
}

export function tradesOnSide(trades: Trade[], side: TradeSide): Trade[] {
  return trades.filter((trade) => trade.side === side);
}

export function totalTradeAmount(trades: Trade[]): number {
  return sum(trades.map(({ amount }) => amount));
}
