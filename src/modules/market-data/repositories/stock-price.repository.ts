import type { PriceSource, StockPrice } from "../entities/stock-price";

export type StockPriceLookup = {
  source: PriceSource;
  prices: StockPrice[];
  unavailableSymbols: string[];
};

export type StockPriceRepository = {
  getLastPrices(symbols: string[]): Promise<StockPriceLookup>;
};
