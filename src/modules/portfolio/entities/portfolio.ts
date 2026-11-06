import {
  ALLOCATION_TOLERANCE_PERCENTAGE,
  FULL_ALLOCATION_PERCENTAGE,
  MIN_TRADE_VALUE,
} from "../constants/rebalance";
import { sum } from "../utils/totals";
import type { Stock } from "./stock";
import type { Trade } from "./trade";

export type Holding = { stock: Stock; shares: number };

export type AllocatedStock = { stock: Stock; targetPercentage: number };

export class Portfolio {
  constructor(
    private readonly holdings: Holding[],
    private readonly allocatedStocks: AllocatedStock[],
  ) {
    assertValidHoldings(holdings);
    assertValidAllocation(allocatedStocks);
  }

  totalValue(): number {
    return sum(this.holdings.map(holdingValue));
  }

  stocks(): Stock[] {
    const stocksBySymbol = new Map<string, Stock>();
    for (const { stock } of [...this.holdings, ...this.allocatedStocks]) {
      if (!stocksBySymbol.has(stock.symbol)) stocksBySymbol.set(stock.symbol, stock);
    }
    return [...stocksBySymbol.values()];
  }

  sharesOf(symbol: string): number {
    return this.holdingOf(symbol)?.shares ?? 0;
  }

  positionValue(symbol: string): number {
    const holding = this.holdingOf(symbol);
    return holding ? holdingValue(holding) : 0;
  }

  currentPercentage(symbol: string): number {
    const totalValue = this.totalValue();
    if (totalValue === 0) return 0;
    return (this.positionValue(symbol) / totalValue) * FULL_ALLOCATION_PERCENTAGE;
  }

  targetPercentage(symbol: string): number {
    const allocatedStock = this.allocatedStocks.find(({ stock }) => stock.symbol === symbol);
    return allocatedStock?.targetPercentage ?? 0;
  }

  targetValue(symbol: string): number {
    return (this.totalValue() * this.targetPercentage(symbol)) / FULL_ALLOCATION_PERCENTAGE;
  }

  rebalance(): Trade[] {
    if (this.totalValue() === 0) return [];

    return this.stocks()
      .map((stock) => this.tradeTowardsTarget(stock))
      .filter((trade): trade is Trade => trade !== null)
      .sort(sellsBeforeBuys);
  }

  private holdingOf(symbol: string): Holding | undefined {
    return this.holdings.find(({ stock }) => stock.symbol === symbol);
  }

  private tradeTowardsTarget(stock: Stock): Trade | null {
    const valueGap = this.targetValue(stock.symbol) - this.positionValue(stock.symbol);
    if (Math.abs(valueGap) < MIN_TRADE_VALUE) return null;

    const amount = Math.abs(valueGap);
    const closesPosition = this.targetPercentage(stock.symbol) === 0;
    return {
      symbol: stock.symbol,
      side: valueGap > 0 ? "buy" : "sell",
      shares: closesPosition ? this.sharesOf(stock.symbol) : amount / stock.currentPrice(),
      amount,
      closesPosition,
    };
  }
}

function holdingValue({ stock, shares }: Holding): number {
  return shares * stock.currentPrice();
}

function sellsBeforeBuys(first: Trade, second: Trade): number {
  if (first.side === second.side) return 0;
  return first.side === "sell" ? -1 : 1;
}

function assertUniqueSymbols(symbols: string[]): void {
  const duplicatedSymbol = symbols.find((symbol, index) => symbols.indexOf(symbol) !== index);
  if (duplicatedSymbol) throw new Error(`Stock ${duplicatedSymbol} appears more than once`);
}

function assertValidHoldings(holdings: Holding[]): void {
  assertUniqueSymbols(holdings.map(({ stock }) => stock.symbol));

  const invalidHolding = holdings.find(({ shares }) => !Number.isFinite(shares) || shares < 0);
  if (invalidHolding) {
    throw new Error(`Holding ${invalidHolding.stock.symbol} has invalid shares: ${invalidHolding.shares}`);
  }
}

function assertValidAllocation(allocatedStocks: AllocatedStock[]): void {
  assertUniqueSymbols(allocatedStocks.map(({ stock }) => stock.symbol));

  const negativeAllocation = allocatedStocks.find(({ targetPercentage }) => targetPercentage < 0);
  if (negativeAllocation) {
    throw new Error(`Allocation for ${negativeAllocation.stock.symbol} cannot be negative`);
  }

  const allocatedPercentage = sum(allocatedStocks.map(({ targetPercentage }) => targetPercentage));
  if (Math.abs(allocatedPercentage - FULL_ALLOCATION_PERCENTAGE) > ALLOCATION_TOLERANCE_PERCENTAGE) {
    throw new Error(`Allocation must add up to 100%, got ${allocatedPercentage}%`);
  }
}
