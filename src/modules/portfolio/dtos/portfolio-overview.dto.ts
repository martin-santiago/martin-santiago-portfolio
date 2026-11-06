import type { PriceSource } from "@/modules/market-data/entities/stock-price";

import type { Trade } from "../entities/trade";

export type PositionOverview = {
  symbol: string;
  name: string;
  price: number;
  shares: number;
  value: number;
  currentPercentage: number;
  targetPercentage: number;
  targetValue: number;
  valueGap: number;
  trade: Trade | null;
};

export type PortfolioOverview = {
  totalValue: number;
  positions: PositionOverview[];
  priceSource: PriceSource;
  pricedAt: string | null;
};

export type PortfolioOverviewDto =
  | { status: "ok"; overview: PortfolioOverview }
  | { status: "prices-unavailable"; unavailableSymbols: string[] };
