import type { StockPrice } from "@/modules/market-data/entities/stock-price";
import type { StockPriceLookup } from "@/modules/market-data/repositories/stock-price.repository";

import type { PortfolioOverview, PositionOverview } from "../dtos/portfolio-overview.dto";
import { Portfolio } from "../entities/portfolio";
import type { PortfolioPosition } from "../entities/portfolio-position";
import { Stock } from "../entities/stock";
import type { Trade } from "../entities/trade";

export type PricedPosition = {
  position: PortfolioPosition;
  stock: Stock;
};

export function pricePositions(positions: PortfolioPosition[], stockPrices: StockPrice[]): PricedPosition[] {
  const priceBySymbol = new Map(stockPrices.map(({ symbol, price }) => [symbol, price]));
  return positions.map((position) => ({
    position,
    stock: new Stock(position.symbol, position.name, priceBySymbol.get(position.symbol) ?? Number.NaN),
  }));
}

export function buildPortfolio(pricedPositions: PricedPosition[]): Portfolio {
  const holdings = pricedPositions
    .filter(({ position }) => position.shares > 0)
    .map(({ position, stock }) => ({ stock, shares: position.shares }));
  const allocatedStocks = pricedPositions
    .filter(({ position }) => position.targetPercentage > 0)
    .map(({ position, stock }) => ({ stock, targetPercentage: position.targetPercentage }));

  return new Portfolio(holdings, allocatedStocks);
}

export function toPortfolioOverview({
  portfolio,
  stocks,
  priceLookup,
}: {
  portfolio: Portfolio;
  stocks: Stock[];
  priceLookup: StockPriceLookup;
}): PortfolioOverview {
  const trades = portfolio.rebalance();

  return {
    totalValue: portfolio.totalValue(),
    positions: stocks.map((stock) => toPositionOverview({ portfolio, stock, trades })),
    priceSource: priceLookup.source,
    pricedAt: latestPricedAt(priceLookup.prices),
  };
}

function toPositionOverview({
  portfolio,
  stock,
  trades,
}: {
  portfolio: Portfolio;
  stock: Stock;
  trades: Trade[];
}): PositionOverview {
  return {
    symbol: stock.symbol,
    name: stock.name,
    price: stock.currentPrice(),
    shares: portfolio.sharesOf(stock.symbol),
    value: portfolio.positionValue(stock.symbol),
    currentPercentage: portfolio.currentPercentage(stock.symbol),
    targetPercentage: portfolio.targetPercentage(stock.symbol),
    targetValue: portfolio.targetValue(stock.symbol),
    valueGap: portfolio.targetValue(stock.symbol) - portfolio.positionValue(stock.symbol),
    trade: trades.find((trade) => trade.symbol === stock.symbol) ?? null,
  };
}

function latestPricedAt(stockPrices: StockPrice[]): string | null {
  const pricedAtTimestamps = stockPrices
    .map(({ pricedAt }) => pricedAt)
    .filter((pricedAt): pricedAt is string => pricedAt !== null);
  return pricedAtTimestamps.sort().at(-1) ?? null;
}
